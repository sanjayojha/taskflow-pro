import { projectsApi } from "@/api/projects";
import { useQuery } from "@tanstack/react-query";

export function useProject(projectId: string | undefined) {
    return useQuery({
        queryKey: ["project", projectId],
        queryFn: async () => {
            const { data } = await projectsApi.get(projectId!);
            return data.data.project;
        },
        enabled: !!projectId,
    });
}
