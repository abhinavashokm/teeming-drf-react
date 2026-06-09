import { outcomeService } from '../../services/outcomeService'
import useAppMutation from '../base/useAppMutation'
import useWorkspaceQueryKeys from '../helper/useWorkspaceQueryKeys'
import useGoalId from '../params/useGoalId'


function useUpdateCheckin(){

  const workspaceKeys = useWorkspaceQueryKeys()
  const goalId = useGoalId()

  return useAppMutation({
    mutationFn: (workspaceSlug, {data, checkinId}) => outcomeService.updateCheckin(workspaceSlug, checkinId, data),
    passWorkspaceSlug: true,
    invalidateKeys: [workspaceKeys.checkins],
  })
  
}

export default useUpdateCheckin