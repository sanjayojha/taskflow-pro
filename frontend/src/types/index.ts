// -- Auth
export interface User {
    id: string;
    name: string;
    email: string;
    role: "admin" | "member";
    isVerified: boolean;
    avatarUrl?: string; // pre-signed S3 URL
}

// -- Organizations
export interface Organization {
    id: string;
    name: string;
    slug: string;
    ownerId: string;
    plan: "free" | "pro";
    memberCount: number;
    myRole: "owner" | "admin" | "member";
}

export interface OrgMember {
    id: string;
    userId: string;
    orgId: string;
    role: "owner" | "admin" | "member";
    joinedAt: string;
    user: {
        id: string;
        name: string;
        email: string;
        avatarUrl?: string;
    };
}

export interface OrgMember {
    id: string;
    userId: string;
    orgId: string;
    role: "owner" | "admin" | "member";
    joinedAt: string;
    user: {
        id: string;
        name: string;
        email: string;
        avatarUrl?: string;
    };
}

// -- Projects

export interface Project {
    id: string;
    orgId: string;
    name: string;
    description?: string;
    status: "active" | "archived" | "completed";
    createdBy: string;
    deadline?: string;
    taskSummary: {
        total: number;
        backlog: number;
        inProgress: number;
        review: number;
        done: number;
    };
    myRole: "manager" | "member" | "viewer";
}

export interface ProjectMember {
    id: string;
    userId: string;
    projectId: string;
    role: "manager" | "member" | "viewer";
    user: {
        id: string;
        name: string;
        email: string;
        avatarUrl?: string;
    };
}

// -- Tasks
export type TaskStatus = "backlog" | "in_progress" | "review" | "done";
export type TaskPriority = "low" | "medium" | "high" | "critical";

export interface Task {
    id: string;
    projectId: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    assigneeId?: string;
    assignee?: {
        id: string;
        name: string;
        avatarUrl?: string;
    };
    dueDate?: string;
    position: number;
    commentCount: number;
    attachmentCount: number;
    createdAt: string;
    updatedAt: string;
}

// -- Comments
export interface Comment {
    id: string;
    taskId: string;
    userId: string;
    body: string;
    createdAt: string;
    updatedAt: string;
    user: {
        id: string;
        name: string;
        avatarUrl?: string;
    };
}

// -- Attachments
export interface Attachment {
    id: string;
    taskId: string;
    userId: string;
    filename: string;
    s3Key: string;
    size: number;
    downloadUrl: string; // pre-signed, 15 min expiry
    createdAt: string;
    user: {
        id: string;
        name: string;
    };
}

// -- Notifications
export interface Notification {
    id: string;
    userId: string;
    type: string;
    payload: Record<string, unknown>;
    isRead: boolean;
    createdAt: string;
}

// -- API Response Shapes
export interface ApiSuccess<T> {
    success: true;
    message: string;
    data: T;
}

export interface ApiError {
    success: false;
    message: string;
    errors?: Array<{ field: string; message: string }>;
}

export interface PaginatedData<T> {
    items: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export interface PaginatedResponse<T> {
    success: true;
    data: PaginatedData<T>;
}
