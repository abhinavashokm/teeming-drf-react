import { useMutation, useQuery } from "@tanstack/react-query";
import { workspaceService } from "../../services/workspaceService";
import { showApiError } from "../../utils/toast";


export default function useMyWorkspaces() {

    return useQuery({
        queryKey: ['myWorkspaces'],
        queryFn: async () => {
            console.log("call here")
            const res = await workspaceService.fetchMyWorkspaces()
            console.log(res.data)
            return res.data
        },
        onError: (error) => showApiError(error)
    })
}
