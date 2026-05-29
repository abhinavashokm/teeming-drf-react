import { goalService } from '../../services/goalService'
import useAppMutation from '../base/useAppMutation'
import useWorkspaceQueryKeys from '../helper/useWorkspaceQueryKeys'


function useUpdateGoal(){

  const workspaceKeys = useWorkspaceQueryKeys()

  return useAppMutation({
    mutationFn: (workspaceSlug, {data, goalId}) => goalService.updateGoal(workspaceSlug, goalId, data),
    passWorkspaceSlug: true,
    invalidateKeys: [workspaceKeys.goals],
  })
  
}

export default useUpdateGoal