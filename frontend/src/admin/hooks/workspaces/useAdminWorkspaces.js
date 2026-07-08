import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { adminWorkspaceService } from '../../services/adminWorkspaceService'
import { ADMIN_QUERY_KEYS } from '../../constants/queryKeys'

function useAdminWorkspaces({ search = '', status = 'All', plan = 'All', page = 1 } = {}) {
    return useQuery({
        queryKey: [...ADMIN_QUERY_KEYS.WORKSPACES, { search, status, plan, page }],
        queryFn: async () => {
            const res = await adminWorkspaceService.adminListWorkspaces({ search, status, plan, page })
            return res.data
        },
        placeholderData: keepPreviousData,
    })
}

export default useAdminWorkspaces