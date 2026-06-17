import { aiService } from '../../services/aiService'
import useAppMutation from '../base/useAppMutation'
import useGoalId from '../params/useGoalId'


function useAIAssistant() {

    const goalId = useGoalId()
 
    return useAppMutation({
        mutationFn: (workspaceSlug, data) => aiService.aiAssistant(workspaceSlug, goalId, data),
        passWorkspaceSlug: true,
        apiSuccessToast: false,
        apiErrorToast: false,
    })

}

export default useAIAssistant