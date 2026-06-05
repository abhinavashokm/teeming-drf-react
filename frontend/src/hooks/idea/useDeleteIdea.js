import React from 'react'
import useAppMutation from '../base/useAppMutation'
import { ideaService } from '../../services/ideaService'
import useGoalId from '../params/useGoalId'
import useWorkspaceQueryKeys from '../helper/useWorkspaceQueryKeys'

function useDeleteIdea() {

    const workspaceKeys = useWorkspaceQueryKeys()

    return useAppMutation({
        mutationFn: ideaService.deleteIdea,
        passWorkspaceSlug: true,
        invalidateKeys: [workspaceKeys.ideas],
    })
}

export default useDeleteIdea