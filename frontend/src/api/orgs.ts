import { api } from "./axios";
import type { Organization, OrgMember, ApiSuccess, PaginatedResponse } from "@/types";

export const orgsApi = {
    list: () => api.get<ApiSuccess<{ orgs: Organization[] }>>("/orgs"),

    get: (orgId: string) => api.get<ApiSuccess<{ org: Organization }>>(`/orgs/${orgId}`),

    create: (payload: { name: string }) => api.post<ApiSuccess<{ org: Organization }>>("/orgs", payload),

    update: (orgId: string, payload: { name?: string }) => api.put<ApiSuccess<{ org: Organization }>>(`/orgs/${orgId}`, payload),

    delete: (orgId: string) => api.delete<ApiSuccess<null>>(`/orgs/${orgId}`),

    listMembers: (orgId: string, params?: { page?: number; limit?: number }) => api.get<PaginatedResponse<OrgMember>>(`/orgs/${orgId}/members`, { params }),

    inviteMember: (orgId: string, email: string, role: "admin" | "member") => api.post<ApiSuccess<null>>(`/orgs/${orgId}/members/invite`, { email, role }),

    updateMemberRole: (orgId: string, userId: string, role: "admin" | "member") => api.patch<ApiSuccess<{ member: OrgMember }>>(`/orgs/${orgId}/members/${userId}/role`, { role }),

    removeMember: (orgId: string, userId: string) => api.delete<ApiSuccess<null>>(`/orgs/${orgId}/members/${userId}`),
};
