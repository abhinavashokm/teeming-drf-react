import { useQuery } from '@tanstack/react-query'
import { ADMIN_QUERY_KEYS } from '../../constants/queryKeys'
import { adminUserService } from '../../services/adminUserServices'


function useUserDetails(userId) {
    return useQuery({
        queryKey: ADMIN_QUERY_KEYS.USER_DETAIL((userId)),
        queryFn: async () => {
           const res = await adminUserService.adminGetUserDetails(userId)
           return res.data
        },
        enabled: !!userId,
    })
}

export default useUserDetails