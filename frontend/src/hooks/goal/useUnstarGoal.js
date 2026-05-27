import { goalService } from '../../services/goalService'
import useAppMutation from '../base/useAppMutation'

function useUnstarGoal() {
    return useAppMutation({
        mutationFn:goalService.unStarGoal,
        invalidateKeys: [['goals']],
        passWorkspaceSlug: true,
        apiSuccessToast: false,
    })
}

export default useUnstarGoal