import { goalService } from '../../services/goalService'
import useAppMutation from '../base/useAppMutation'

function useStarGoal() {
    return useAppMutation({
        mutationFn:goalService.starGoal,
        invalidateKeys: [['goals']],
        passWorkspaceSlug: true,
        apiSuccessToast: false,
    })
}

export default useStarGoal