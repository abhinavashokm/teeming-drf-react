import { useQuery } from '@tanstack/react-query'
import React from 'react'
import useWorkspaceQueryKeys from '../helper/useWorkspaceQueryKeys'
import { aiService } from '../../services/aiService'
import useWorkspaceSlug from '../params/useWorkspaceSlug'
import useGoalId from '../params/useGoalId'

function useAIAssistantResponses() {

    const workspaceKeys = useWorkspaceQueryKeys()
    const workspaceSlug = useWorkspaceSlug()
    const goalId = useGoalId()

    return useQuery({
        queryKey: workspaceKeys.ai_assistant_responses,
        queryFn: async () => {
            const res = await aiService.listAIResponses(workspaceSlug, goalId)
            return res.data
        },
    })
}

export default useAIAssistantResponses