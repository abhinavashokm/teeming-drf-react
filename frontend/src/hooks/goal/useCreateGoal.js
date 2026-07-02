import { goalService } from '../../services/goalService'
import useAppMutation from '../base/useAppMutation'
import useWorkspaceQueryKeys from '../helper/useWorkspaceQueryKeys'


function useCreateGoal() {

  const workspaceKeys = useWorkspaceQueryKeys()

  return useAppMutation({
    mutationFn: goalService.createGoal,
    passWorkspaceSlug: true,
    invalidateKeys:[workspaceKeys.goals, workspaceKeys.root],
  })

}

export default useCreateGoal