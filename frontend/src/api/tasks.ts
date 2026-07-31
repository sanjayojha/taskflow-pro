import type { ApiSuccess, PaginatedResponse, Task, TaskPriority, TaskStatus } from "@/types";
import { api } from "./axios";

export interface TaskListParams {
    status?: TaskStatus;
    priority?: TaskPriority;
    assigneeId?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    page?: number;
    limit?: number;
}

export interface CreateTaskPayload {
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    assigneeId?: string;
    dueDate?: string;
}

export const taskAPi = {
    listByProject: (projectId: string, params?: TaskListParams) => api.get<PaginatedResponse<Task>>(`/projects/${projectId}/tasks`, { params }),
    get: (taskId: string) => api.get<ApiSuccess<{ task: Task }>>(`/tasks/${taskId}`),
    create: (projectId: string, payload: CreateTaskPayload) => api.post<ApiSuccess<{ task: Task }>>(`/projects/${projectId}/tasks`, payload),
    update: (taskId: string, payload: Partial<CreateTaskPayload>) => api.put<ApiSuccess<{ task: Task }>>(`/tasks/${taskId}`, payload),
    updatePosition: (taskId: string, payload: { status: TaskStatus; position: number }) => api.patch<ApiSuccess<{ task: Task }>>(`/tasks/${taskId}`, payload),
    delete: (taskId: string) => api.delete<ApiSuccess<null>>(`/tasks/${taskId}`),
};
