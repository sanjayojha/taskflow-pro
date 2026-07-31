import { taskAPi } from "@/api/tasks";
import type { PaginatedData, Task, TaskStatus } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface MoveTaskArgs {
    taskId: string;
    newStatus: TaskStatus;
    newPosition: number;
}

export function useUpdateTaskPosition(projectId: string | undefined) {
    const queryClient = useQueryClient();
    const queryKey = ["tasks", projectId, undefined] as const;

    return useMutation({
        mutationFn: async ({ taskId, newStatus, newPosition }: MoveTaskArgs) => {
            await taskAPi.updatePosition(taskId, { status: newStatus, position: newPosition });
        },
        onMutate: async ({ taskId, newStatus, newPosition }: MoveTaskArgs) => {
            await queryClient.cancelQueries({ queryKey: ["tasks", projectId] });

            const previous = queryClient.getQueryData<PaginatedData<Task>>(queryKey);

            if (previous) {
                const tasks = [...previous.items];
                const taskIndex = tasks.findIndex((t) => t.id === taskId);
                if (taskIndex !== -1) {
                    tasks[taskIndex] = { ...tasks[taskIndex], status: newStatus, position: newPosition };
                    queryClient.setQueryData(queryKey, { ...previous, items: tasks });
                }
            }

            return { previous };
        },
        onError: (_err, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(queryKey, context.previous);
            }
            toast.error("Could not move task. Reverted.");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
        },
    });
}
