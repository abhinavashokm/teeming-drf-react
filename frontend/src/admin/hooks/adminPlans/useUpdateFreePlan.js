import useAppMutation from '../../../hooks/base/useAppMutation'
import { adminPlanService } from '../../services/adminPlanService'
import { ADMIN_QUERY_KEYS } from '../../constants/queryKeys'

function useUpdateFreePlan() {
    return useAppMutation({
        mutationFn: adminPlanService.updateFreePlan,
        invalidateKeys: [ADMIN_QUERY_KEYS.PLANS],
        apiSuccessToast: false,
    })
}

export default useUpdateFreePlan