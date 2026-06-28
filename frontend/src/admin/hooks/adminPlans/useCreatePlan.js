import useAppMutation from '../../../hooks/base/useAppMutation'
import { adminPlanService } from '../../services/adminPlanService'
import { ADMIN_QUERY_KEYS } from '../../constants/queryKeys'


function useCreatePlan() {

  return useAppMutation({
    mutationFn: adminPlanService.createPlan,
    invalidateKeys:[ADMIN_QUERY_KEYS.PLANS],
  })

}

export default useCreatePlan