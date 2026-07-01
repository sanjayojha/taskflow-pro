import { User } from "../models/User";
import { Task, TaskPriority, TaskStatus } from "../models/Task";
import { Op } from "sequelize";
import { Comment } from "../models/Comment";
import { Attachment } from "../models/Attachment";
import { paginate } from "../utils/pagination";
import { CreateCommentInput, CreateTaskInput, UpdateCommentInput, UpdateTaskInput, UpdateTaskPositionInput } from "../schemas/task.schema";
import { ProjectMember } from "../models/ProjectMember";
import { AppError } from "../middlewares/errorHandler";
import { CacheKeys, CacheTTL } from "../utils/cacheKeys";
import { cache } from "../utils/cache";
import { Project } from "../models/Project";
import { attachmentKey, deleteFromS3, getPresignedUrl, uploadToS3 } from "../utils/s3Helper";

// -- List tasks --
export const getProjectTasks = async (
    projectId: string,
    query: {
        page?: number;
        limit?: number;
        status?: string;
        priority?: string;
        assigneeId?: string;
        search?: string;
        sortBy?: string;
        sortOrder?: string;
    },
) => {
    const isDefaultQuery = !query.status && !query.priority && !query.assigneeId && !query.search && (query.page || 1) === 1 && (query.limit || 50) === 50 && !query.sortBy;

    const cacheKey = CacheKeys.projectTasks(projectId);

    if (isDefaultQuery) {
        const cached = await cache.get(cacheKey);
        if (cached) return cached;
    }

    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, query.limit || 50);
    const offset = (page - 1) * limit;

    // dynamic where clause
    const where: Record<string, unknown> = { projectId };

    if (query.status) {
        where.status = query.status;
    }
    if (query.priority) {
        where.priority = query.priority;
    }
    if (query.assigneeId) {
        where.assigneeId = query.assigneeId;
    }
    if (query.search) {
        where.title = { [Op.iLike]: `%${query.search}%` };
    }

    // dynamic order clause
    const validSortFields: Record<string, string> = {
        createdAt: "createdAt",
        updatedAt: "updatedAt",
        dueDate: "dueDate",
        priority: "priority",
        position: "position",
        title: "title",
    };

    const sortField = validSortFields[query.sortBy || "position"] || "position";
    const sortOrder = query.sortOrder?.toUpperCase() === "DESC" ? "DESC" : "ASC";

    const { rows, count } = await Task.findAndCountAll({
        where,
        include: [
            {
                model: User,
                as: "assignee",
                attributes: ["id", "name", "avatarUrl"],
                required: false,
            },
        ],
        order: [[sortField, sortOrder]],
        limit,
        offset,
        distinct: true,
    });

    const taskIds = rows.map((t) => t.id);

    const commentCounts = (await Comment.findAll({
        where: { taskId: { [Op.in]: taskIds } },
        attributes: ["taskId", [Comment.sequelize!.fn("COUNT", Comment.sequelize!.col("id")), "count"]],
        group: ["taskId"],
        raw: true,
    })) as unknown as Array<{ taskId: string; count: string }>;

    const attachmentCounts = (await Attachment.findAll({
        where: { taskId: { [Op.in]: taskIds } },
        attributes: ["taskId", [Attachment.sequelize!.fn("COUNT", Attachment.sequelize!.col("id")), "count"]],
        group: ["taskId"],
        raw: true,
    })) as unknown as Array<{ taskId: string; count: string }>;

    const taskWithCounts = rows.map((task) => ({
        ...task.toJSON(),
        commentCount: parseInt(commentCounts.find((c) => c.taskId === task.id)?.count || "0"),
        attachmentCount: parseInt(attachmentCounts.find((a) => a.taskId === task.id)?.count || "0"),
    }));

    const result = paginate(taskWithCounts, count, { page, limit, offset });

    if (isDefaultQuery) {
        await cache.set(cacheKey, result, CacheTTL.SHORT);
    }

    return result;
};

// -- Create Task --
export const createTask = async (projectId: string, creatorId: string, input: CreateTaskInput) => {
    // Validate assignee is a project member if provided
    if (input.assigneeId) {
        const isMember = await ProjectMember.findOne({ where: { projectId, userId: input.assigneeId } });
        if (!isMember) {
            throw new AppError("Assignee must be a member of this project", 400);
        }
    }

    // Calculate next position in the target status column
    const lastTask = await Task.findOne({
        where: { projectId, status: input.status || TaskStatus.BACKLOG },
        order: [["position", "DESC"]],
    });

    const position = lastTask ? lastTask.position + 1 : 0;

    const task = await Task.create({
        projectId,
        title: input.title,
        description: input.description,
        status: (input.status as TaskStatus) || TaskStatus.BACKLOG,
        priority: (input.priority as TaskPriority) || TaskPriority.MEDIUM,
        assigneeId: input.assigneeId || null,
        dueDate: input.dueDate || null,
        position,
    });

    await cache.del(CacheKeys.projectTasks(projectId));

    return task.reload({
        include: [
            {
                model: User,
                as: "assignee",
                attributes: ["id", "name", "avatarUrl"],
                required: false,
            },
        ],
    });
};

// get single task
export const getTaskById = async (taskId: string) => {
    const cacheKey = CacheKeys.task(taskId);
    const cached = await cache.get(cacheKey);
    if (cached) {
        return cached;
    }

    const task = await Task.findByPk(taskId, {
        include: [
            {
                model: User,
                as: "assignee",
                attributes: ["id", "name", "email", "avatarUrl"],
                required: false,
            },
            {
                model: Comment,
                include: [{ model: User, attributes: ["id", "name", "avatarUrl"] }],
                order: [["createdAt", "ASC"]],
                separate: true, // load comments in separate query — avoids row duplication
            },
            {
                model: Attachment,
                include: [{ model: User, attributes: ["id", "name"] }],
                order: [["createdAt", "DESC"]],
                separate: true,
            },
        ],
    });

    if (!task) {
        throw new AppError("Task not found", 404);
    }
    await cache.set(cacheKey, task, CacheTTL.SHORT);
    return task;
};

// Update task
export const updateTask = async (taskId: string, projectId: string, input: UpdateTaskInput) => {
    const task = await Task.findOne({ where: { id: taskId, projectId } });
    if (!task) {
        throw new AppError("Task not found", 404);
    }

    // Validate new assignee is a project member
    if (input.assigneeId) {
        const isMember = await ProjectMember.findOne({
            where: { projectId, userId: input.assigneeId },
        });
        if (!isMember) {
            throw new AppError("Assignee must be a member of this project", 400);
        }
    }

    await task.update({
        ...(input.title !== undefined && { title: input.title }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.status !== undefined && { status: input.status as TaskStatus }),
        ...(input.priority !== undefined && { priority: input.priority as TaskPriority }),
        ...(input.assigneeId !== undefined && { assigneeId: input.assigneeId }),
        ...(input.dueDate !== undefined && { dueDate: input.dueDate }),
    });

    await cache.del(CacheKeys.task(taskId), CacheKeys.projectTasks(task.projectId));

    return task.reload({
        include: [
            {
                model: User,
                as: "assignee",
                attributes: ["id", "name", "avatarUrl"],
                required: false,
            },
        ],
    });
};

// Update task position (drag & drop)
export const updateTaskPosition = async (taskId: string, projectId: string, input: UpdateTaskPositionInput) => {
    const task = await Task.findOne({ where: { id: taskId, projectId } });
    if (!task) {
        throw new AppError("Task not found", 404);
    }

    const newStatus = input.status as TaskStatus;
    const newPosition = input.position;
    const oldStatus = task.status;
    const oldPosition = task.position;

    // Use a transaction — position updates touch multiple rows
    const transaction = await Task.sequelize!.transaction();

    try {
        if (oldStatus === newStatus) {
            // Moving within the same column
            if (oldPosition < newPosition) {
                // Moved down — shift tasks between old and new position up
                await Task.update(
                    { position: Task.sequelize!.literal("position - 1") as unknown as number },
                    {
                        where: {
                            projectId,
                            status: newStatus,
                            position: { [Op.gt]: oldPosition, [Op.lte]: newPosition },
                            id: { [Op.ne]: taskId },
                        },
                        transaction,
                    },
                );
            } else if (oldPosition > newPosition) {
                // Moved up — shift tasks between new and old position down
                await Task.update(
                    { position: Task.sequelize!.literal("position + 1") as unknown as number },
                    {
                        where: {
                            projectId,
                            status: newStatus,
                            position: { [Op.gte]: newPosition, [Op.lt]: oldPosition },
                            id: { [Op.ne]: taskId },
                        },
                        transaction,
                    },
                );
            }
        } else {
            // Moving to a different column

            // Close gap in the old column
            await Task.update(
                { position: Task.sequelize!.literal("position - 1") as unknown as number },
                {
                    where: {
                        projectId,
                        status: oldStatus,
                        position: { [Op.gt]: oldPosition },
                        id: { [Op.ne]: taskId },
                    },
                    transaction,
                },
            );

            // Open space in the new column
            await Task.update(
                { position: Task.sequelize!.literal("position + 1") as unknown as number },
                {
                    where: {
                        projectId,
                        status: newStatus,
                        position: { [Op.gte]: newPosition },
                        id: { [Op.ne]: taskId },
                    },
                    transaction,
                },
            );
        }

        // Update the task itself
        await task.update({ status: newStatus, position: newPosition }, { transaction });
        await transaction.commit();
        await cache.del(CacheKeys.task(taskId), CacheKeys.projectTasks(projectId));
    } catch (err) {
        await transaction.rollback();
        throw err;
    }

    return task.reload();
};

// Delete Task
export const deleteTask = async (taskId: string, projectId: string) => {
    const task = await Task.findOne({ where: { id: taskId, projectId } });
    if (!task) {
        throw new AppError("Task not found", 404);
    }

    // Close the position gap in the column after deletion
    const transaction = await Task.sequelize!.transaction();
    try {
        await Task.update(
            { position: Task.sequelize!.literal("position - 1") as unknown as number },
            {
                where: {
                    projectId,
                    status: task.status,
                    position: { [Op.gt]: task.position },
                },
                transaction,
            },
        );
        await task.destroy({ transaction });
        await transaction.commit();
        await cache.del(CacheKeys.task(taskId), CacheKeys.projectTasks(projectId));
    } catch (err) {
        await transaction.rollback();
        throw err;
    }
};

// Get task comments
export const getTaskComments = async (taskId: string) => {
    const task = await Task.findByPk(taskId);
    if (!task) {
        throw new AppError("Task not found", 404);
    }

    const cacheKey = CacheKeys.taskComments(taskId);
    const cached = await cache.get(cacheKey);
    if (cached) {
        return cached;
    }

    const comments = await Comment.findAll({
        where: { taskId },
        include: [{ model: User, attributes: ["id", "name", "avatarUrl"] }],
        order: [["createdAt", "ASC"]],
    });

    await cache.set(cacheKey, comments, CacheTTL.SHORT);
    return comments;
};

// create comment
export const createComment = async (taskId: string, userId: string, input: CreateCommentInput) => {
    const task = await Task.findByPk(taskId);
    if (!task) {
        throw new AppError("Task not found", 404);
    }

    const comment = await Comment.create({
        taskId,
        userId,
        body: input.body,
    });

    await cache.del(CacheKeys.task(taskId), CacheKeys.taskComments(taskId));

    return comment.reload({
        include: [{ model: User, attributes: ["id", "name", "avatarUrl"] }],
    });
};

// update comment
export const updateComment = async (commentId: string, userId: string, input: UpdateCommentInput) => {
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
        throw new AppError("Comment not found", 404);
    }

    // Only the author can edit their comment
    if (comment.userId !== userId) {
        throw new AppError("You can only edit your own comments", 403);
    }

    await comment.update({ body: input.body });

    await cache.del(CacheKeys.task(comment.taskId), CacheKeys.taskComments(comment.taskId));

    return comment.reload({
        include: [{ model: User, attributes: ["id", "name", "avatarUrl"] }],
    });
};

// delete comment
export const deleteComment = async (commentId: string, userId: string) => {
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
        throw new AppError("Comment not found", 404);
    }

    if (comment.userId !== userId) {
        throw new AppError("You can only delete your own comments", 403);
    }

    await comment.destroy();
    await cache.del(CacheKeys.task(comment.taskId), CacheKeys.taskComments(comment.taskId));
};

// -- Attachments
export const createAttachment = async (taskId: string, userId: string, file: Express.Multer.File): Promise<Attachment> => {
    const task = await Task.findByPk(taskId, {
        attributes: ["id", "projectId"],
    });
    if (!task) {
        throw new AppError("Task not found", 404);
    }

    // Get orgId from the project, needed for the S3 key structure
    const project = await Project.findByPk(task.projectId, {
        attributes: ["orgId"],
    });
    if (!project) {
        throw new AppError("Project not found", 404);
    }

    // Build S3 key and upload
    const key = attachmentKey(project.orgId, taskId, file.originalname);
    await uploadToS3({
        key,
        buffer: file.buffer,
        mimeType: file.mimetype,
    });

    // Store metadata in DB, never store the raw URL.
    const attachment = await Attachment.create({
        taskId,
        userId,
        filename: file.originalname,
        s3Key: key,
        size: file.size,
    });

    // Invalidate task and attachment cache
    cache.del(CacheKeys.taskAttachments(taskId), CacheKeys.task(taskId));

    return attachment.reload({
        include: [{ model: User, attributes: ["id", "name"] }],
    });
};

export const getTaskAttachments = async (taskId: string) => {
    const task = await Task.findByPk(taskId);
    if (!task) {
        throw new AppError("Task not found", 404);
    }

    const cacheKey = CacheKeys.taskAttachments(taskId);
    const cached = await cache.get(cacheKey);
    if (cached) {
        // Cached data has stale pre-signed URLs, we have to regenerate them
        const attachments = cached as Array<Record<string, unknown>>;
        return Promise.all(
            attachments.map(async (a) => ({
                ...a,
                downloadUrl: await getPresignedUrl(a.s3Key as string),
            })),
        );
    }

    const attachments = await Attachment.findAll({
        where: { taskId },
        include: [{ model: User, attributes: ["id", "name"] }],
        order: [["createdAt", "DESC"]],
    });

    const result = attachments.map((a) => a.toJSON());

    // Cache the raw data (without pre-signed URLs — they expire)
    await cache.set(cacheKey, result, CacheTTL.SHORT);

    // Return with fresh pre-signed URLs attached
    return Promise.all(
        result.map(async (a) => ({
            ...a,
            downloadUrl: await getPresignedUrl(a.s3Key as string),
        })),
    );
};

export const deleteAttachment = async (attachmentId: string, userId: string) => {
    const attachment = await Attachment.findByPk(attachmentId);
    if (!attachment) {
        throw new AppError("Attachment not found", 404);
    }

    if (attachment.userId !== userId) {
        throw new AppError("You can only delete your own attachments", 403);
    }

    // Delete from S3 first, if this fails we keep the DB record intact.
    await deleteFromS3(attachment.s3Key);

    // Then remove the DB record
    await attachment.destroy();

    await cache.del(CacheKeys.taskAttachments(attachment.taskId), CacheKeys.task(attachment.taskId));
};
