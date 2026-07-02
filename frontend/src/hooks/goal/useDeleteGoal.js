import { goalService } from '../../services/goalService'
import useAppMutation from '../base/useAppMutation'
import useWorkspaceQueryKeys from '../helper/useWorkspaceQueryKeys'


function useDeleteGoal() {

    const workspaceKeys = useWorkspaceQueryKeys()

    return useAppMutation({
        mutationFn: goalService.deleteGoal,
        passWorkspaceSlug: true,
        invalidateKeys: [workspaceKeys.goals, workspaceKeys.root],
    })
}

export default useDeleteGoal