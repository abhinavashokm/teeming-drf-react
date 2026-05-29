import { useMutation, useQuery } from "@tanstack/react-query";
import { workspaceService } from "../../services/workspaceService";
import { showApiError } from "../../utils/toast";
import { globalQueryKeys } from "../../constants/queryKeys";


export default function useMyWorkspaces() {

    return useQuery({
        queryKey: globalQueryKeys.workspaces,
        queryFn: async () => {
            const res = await workspaceService.fetchMyWorkspaces()
            return res.data
        },
        onError: (error) => showApiError(error)
    })
    
}
