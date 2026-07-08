import { useQuery } from '@tanstack/react-query'
import { ADMIN_QUERY_KEYS } from '../../constants/queryKeys'
import { adminWorkspaceService } from '../../services/adminWorkspaceService'

function useWorkspaceMembers(workspaceId) {

    return useQuery({
        queryKey: ADMIN_QUERY_KEYS.WORKSPACE_DETAILS(workspaceId),
        'queryFn': async () => {
            const resData = await adminWorkspaceService.adminGetWorkspaceDetails(workspaceId)
            console.log(resData.data.members)
            return resData.data?.members ?? []
        }
    })
}

export default useWorkspaceMembers