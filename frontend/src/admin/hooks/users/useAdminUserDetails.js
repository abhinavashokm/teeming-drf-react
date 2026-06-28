import { useQuery } from '@tanstack/react-query'
import { adminUserService } from '../../services/adminUserServices'
import { ADMIN_QUERY_KEYS } from '../../constants/queryKeys'


function useAdminUserDetail(userId) {
    return useQuery({
        queryKey: ADMIN_QUERY_KEYS.USER_DETAIL(userId),
        queryFn: async () => {
            const res = await adminUserService.adminGetUserDetails(userId)
            return res.data
        },
    })
}

export default useAdminUserDetail