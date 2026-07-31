import { taskAPi, type TaskListParams } from "@/api/tasks";
import { useQuery } from "@tanstack/react-query";

export function useTasks(projectId: string | undefined, params: TaskListParams) {
    return useQuery({
        queryKey: ["tasks", projectId, params],
        queryFn: async () => {
            const { data } = await taskAPi.listByProject(projectId!, {
                limit: 100,
                ...params,
            });
            return data.data;
        },
        enabled: !!projectId,
    });
}
