import type { ApiSuccess, PaginatedResponse, Project, ProjectMember } from "@/types";
import { api } from "./axios";

export interface ProjectListParams {
    status?: "active" | "archived" | "completed";
    search?: string;
    page?: number;
    limit?: number;
}

export const projectsApi = {
    listByOrg: (orgId: string, params?: ProjectListParams) => api.get<PaginatedResponse<Project>>(`/orgs/${orgId}/projects`, { params }),

    get: (projectId: string) => api.get<ApiSuccess<{ project: Project }>>(`/projects/${projectId}`),

    create: (orgId: string, payload: { name: string; description?: string; deadline?: string }) => api.post<ApiSuccess<{ project: Project }>>(`/orgs/${orgId}/projects`, payload),

    update: (projectId: string, payload: Partial<{ name: string; description: string; status: string; deadline: string }>) => api.put<ApiSuccess<{ project: Project }>>(`/projects/${projectId}`, payload),

    delete: (projectId: string) => api.delete<ApiSuccess<{ project: Project }>>(`/projects/${projectId}`),

    listMembers: (projectId: string) => api.get<ApiSuccess<{ members: ProjectMember[] }>>(`/projects/${projectId}/members`),
};
