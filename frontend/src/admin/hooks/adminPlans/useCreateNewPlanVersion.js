import useAppMutation from '../../../hooks/base/useAppMutation'
import { adminPlanService } from '../../services/adminPlanService'
import { ADMIN_QUERY_KEYS } from '../../constants/queryKeys'

function useCreateNewPlanVersion() {
  return useAppMutation({
    mutationFn: ({ planId, data }) => adminPlanService.createNewPlanVersion(planId, data),
    invalidateKeys: [ADMIN_QUERY_KEYS.PLANS],
  })
}

export default useCreateNewPlanVersion