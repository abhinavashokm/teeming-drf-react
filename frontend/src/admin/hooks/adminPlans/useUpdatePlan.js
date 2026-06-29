import useAppMutation from '../../../hooks/base/useAppMutation'
import { adminPlanService } from '../../services/adminPlanService'
import { ADMIN_QUERY_KEYS } from '../../constants/queryKeys'

function useUpdatePlan() {
  return useAppMutation({
    mutationFn: ({ planId, data }) => adminPlanService.updatePlan(planId, data),
    invalidateKeys: [ADMIN_QUERY_KEYS.PLANS],
  })
}

export default useUpdatePlan