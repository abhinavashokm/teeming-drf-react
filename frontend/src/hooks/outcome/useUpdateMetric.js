import { outcomeService } from '../../services/outcomeService'
import useAppMutation from '../base/useAppMutation'
import useWorkspaceQueryKeys from '../helper/useWorkspaceQueryKeys'
import useGoalId from '../params/useGoalId'


function useUpdateMetric(){

  const workspaceKeys = useWorkspaceQueryKeys()
  const goalId = useGoalId()

  return useAppMutation({
    mutationFn: (workspaceSlug, {data, metricId}) => outcomeService.updateMetric(workspaceSlug, metricId, data),
    passWorkspaceSlug: true,
    invalidateKeys: [workspaceKeys.metrics],
  })
  
}

export default useUpdateMetric