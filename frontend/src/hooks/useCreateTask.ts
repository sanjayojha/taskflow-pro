import { taskAPi, type CreateTaskPayload } from "@/api/tasks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";

export function useCreateTask(projectId: string | undefined) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateTaskPayload) => {
            const { data } = await taskAPi.create(projectId!, payload);
            return data.data.task;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
        },
        onError: (err) => {
            if (isAxiosError(err) && err.response?.data?.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error("Failed to create task");
            }
        },
    });
}
