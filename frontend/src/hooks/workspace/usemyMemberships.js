import { useMutation, useQuery } from "@tanstack/react-query";
import { workspaceService } from "../../services/workspaceService";
import { showApiError } from "../../utils/toast";
import { globalQueryKeys } from "../../constants/queryKeys";


export default function usemyMemberships() {

    return useQuery({
        queryKey: globalQueryKeys.workspaceMemberships,
        queryFn: async () => {
            const res = await workspaceService.fetchmyMemberships()
            return res.data
        },
        onError: (error) => showApiError(error)
    })
    
}
