import { aiService } from '../../services/aiService'
import useAppMutation from '../base/useAppMutation'
import useWorkspaceQueryKeys from '../helper/useWorkspaceQueryKeys'
import useGoalId from '../params/useGoalId'


function useAIAssistant() {

    const workspaceKeys = useWorkspaceQueryKeys()
    const goalId = useGoalId()
 
    return useAppMutation({
        mutationFn: (workspaceSlug, data) => aiService.aiAssistant(workspaceSlug, goalId, data),
        passWorkspaceSlug: true,
        apiSuccessToast: false,
        apiErrorToast: false,
        invalidateKeys: [workspaceKeys.ai_assistant_responses]
    })

}

export default useAIAssistant