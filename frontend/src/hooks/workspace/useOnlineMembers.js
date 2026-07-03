import { useQuery } from "@tanstack/react-query";
import { workspaceService } from "../../services/workspaceService";
import useWorkspaceSlug from "../params/useWorkspaceSlug";
import useWorkspaceQueryKeys from "../helper/useWorkspaceQueryKeys";

function useOnlineMembers() {
    const workspaceSlug = useWorkspaceSlug();
    const workspaceKeys = useWorkspaceQueryKeys();

    return useQuery({
        queryKey: workspaceKeys.onlineMembers,
        queryFn: async () => {
            const res = await workspaceService.fetchOnlineMembers(workspaceSlug);
            return res.data?.onlineMembers ?? [];
        },
    });
}

export default useOnlineMembers;