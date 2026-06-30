import type { ApiSuccess, Organization } from "@/types";
import { api } from "./axios";

export const orgsApi = {
    list: () => api.get<ApiSuccess<Organization[]>>("/orgs"),
    get: (orgId: string) => api.get<ApiSuccess<Organization>>(`orgs/${orgId}`),
    create: (payload: { name: string }) => api.post<ApiSuccess<Organization>>("/orgs", payload),
    update: (orgId: string, payload: { name: string }) => api.put<ApiSuccess<Organization>>(`orgs/${orgId}`, payload),
    delete: (orgId: string) => api.delete<ApiSuccess<null>>(`orgs/${orgId}`),
};
