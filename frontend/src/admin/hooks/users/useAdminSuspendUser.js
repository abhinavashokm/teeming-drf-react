import useAppMutation from '../../../hooks/base/useAppMutation'
import { adminUserService } from '../../services/adminUserServices'
import { ADMIN_QUERY_KEYS } from '../../constants/queryKeys'

function useAdminSuspendUser() {
    return useAppMutation({
        mutationFn: (userId) => adminUserService.adminSuspendUser(userId),
        invalidateKeys: [ADMIN_QUERY_KEYS.USERS],
        successMsg: 'User suspended successfully',
    })
}

export default useAdminSuspendUser