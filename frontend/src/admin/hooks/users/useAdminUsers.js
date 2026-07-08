import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { adminUserService } from '../../services/adminUserServices'
import { ADMIN_QUERY_KEYS } from '../../constants/queryKeys'


function useAdminUsers({ search = '', status = 'All', joined = '', page = 1 } = {}) {
    return useQuery({
        queryKey: [...ADMIN_QUERY_KEYS.USERS, { search, status, joined, page }],
        queryFn: async () => {
            const res = await adminUserService.adminListUsers({ search, status, joined, page })
            return res.data
        },
        placeholderData: keepPreviousData,
    })
}

export default useAdminUsers