import { projectsApi } from "@/api/projects";
import { useQuery } from "@tanstack/react-query";

export function useProjectMembers(projectId: string | undefined) {
    return useQuery({
        queryKey: ["project-members", projectId],
        queryFn: async () => {
            const { data } = await projectsApi.listMembers(projectId!);
            return data.data.members;
        },
        enabled: !!projectId,
    });
}
