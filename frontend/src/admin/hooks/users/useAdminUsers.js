import { useQuery } from '@tanstack/react-query'
import { adminUserService } from '../../services/adminUserServices'
import { ADMIN_QUERY_KEYS } from '../../constants/queryKeys'


function useAdminUsers({ search = '', status = 'All', page = 1 } = {}) {
    return useQuery({
        queryKey: [...ADMIN_QUERY_KEYS.USERS, { search, status, page }],
        queryFn: async () => {
           const res = await adminUserService.adminListUsers({ search, status, page })
           return res.data
        },
    })
}

export default useAdminUsers