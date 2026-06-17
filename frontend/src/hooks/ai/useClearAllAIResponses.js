import { aiService } from '../../services/aiService'
import { useQueryClient } from '@tanstack/react-query'
import useAppMutation from '../base/useAppMutation'
import useWorkspaceQueryKeys from '../helper/useWorkspaceQueryKeys'
import useGoalId from '../params/useGoalId'


function useClearAllAIResponses() {
    const workspaceKeys = useWorkspaceQueryKeys()
    const goalId = useGoalId()
    const queryClient = useQueryClient()

    return useAppMutation({
        mutationFn: (workspaceSlug) => aiService.clearAllAIResponses(workspaceSlug, goalId),
        passWorkspaceSlug: true,
        invalidateKeys: [workspaceKeys.ai_assistant_responses],
        apiSuccessToast: false,
        onSuccess: () => {
            queryClient.setQueryData(workspaceKeys.ai_assistant_responses, [])
        }
    })
}

export default useClearAllAIResponses
