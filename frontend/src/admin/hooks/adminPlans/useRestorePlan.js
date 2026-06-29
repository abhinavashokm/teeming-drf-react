import useAppMutation from '../../../hooks/base/useAppMutation'
import { adminPlanService } from '../../services/adminPlanService'
import { ADMIN_QUERY_KEYS } from '../../constants/queryKeys'

function useRestorePlan() {
  return useAppMutation({
    mutationFn: ({ planId }) => adminPlanService.restorePlan(planId),
    invalidateKeys: [ADMIN_QUERY_KEYS.PLANS],
  })
}

export default useRestorePlan