import { projectsApi, type ProjectListParams } from "@/api/projects";
import { useQuery } from "@tanstack/react-query";

export function useProjects(orgId: string | undefined, params?: ProjectListParams) {
    return useQuery({
        queryKey: ["projects", orgId, params],
        queryFn: async () => {
            const { data } = await projectsApi.listByOrg(orgId!, params);
            return data.data;
        },
        enabled: !!orgId,
    });
}
