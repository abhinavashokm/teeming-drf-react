import { goalService } from '../../services/goalService'
import useAppMutation from '../base/useAppMutation'
import useWorkspaceQueryKeys from '../helper/useWorkspaceQueryKeys'

function useStarGoal() {

    const workspaceKeys = useWorkspaceQueryKeys()

    return useAppMutation({
        mutationFn:goalService.starGoal,
        invalidateKeys: [workspaceKeys.goals],
        passWorkspaceSlug: true,
        apiSuccessToast: false,
    })
}

export default useStarGoal