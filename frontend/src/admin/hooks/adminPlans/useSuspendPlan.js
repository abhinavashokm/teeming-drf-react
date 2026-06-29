import useAppMutation from '../../../hooks/base/useAppMutation'
import { adminPlanService } from '../../services/adminPlanService'
import { ADMIN_QUERY_KEYS } from '../../constants/queryKeys'

function useSuspendPlan() {
  return useAppMutation({
    mutationFn: ({ planId }) => adminPlanService.suspendPlan(planId),
    invalidateKeys: [ADMIN_QUERY_KEYS.PLANS],
  })
}

export default useSuspendPlan