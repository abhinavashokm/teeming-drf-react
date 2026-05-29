import { goalService } from '../../services/goalService'
import useAppMutation from '../base/useAppMutation'
import useWorkspaceQueryKeys from '../helper/useWorkspaceQueryKeys'

function useUnstarGoal() {
    
    const workspaceKeys = useWorkspaceQueryKeys()

    return useAppMutation({
        mutationFn:goalService.unStarGoal,
        invalidateKeys: [workspaceKeys.goals],
        passWorkspaceSlug: true,
        apiSuccessToast: false,
    })
}

export default useUnstarGoal