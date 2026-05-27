import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { goalService } from '../../services/goalService'
import useWorkspaceSlug from '../workspace/useWorkspaceSlug'
import { showApiSuccess, showError } from '../../utils/toast'
import useAppMutation from '../base/useAppMutation'


function useDeleteGoal() {

    const workspaceSlug = useWorkspaceSlug()

    return useAppMutation({
        mutationFn: (goal_id) => goalService.deleteGoal(goal_id, workspaceSlug),

        invalidateKeys: [['goals']]
    })
}

export default useDeleteGoal