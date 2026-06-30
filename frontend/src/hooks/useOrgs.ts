import { orgsApi } from "@/api/orgs";
import { useQuery } from "@tanstack/react-query";

export function useOrgs() {
    return useQuery({
        queryKey: ["orgs"],
        queryFn: async () => {
            const { data } = await orgsApi.list();
            return data.data;
        },
    });
}
