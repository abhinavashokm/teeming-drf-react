import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { goalService } from '../../services/goalService'
import useWorkspaceSlug from '../workspace/useWorkspaceSlug'
import { showApiSuccess, showError } from '../../utils/toast'

function useDeleteGoal() {

    const workspaceSlug = useWorkspaceSlug()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (goal_id) => goalService.deleteGoal(goal_id, workspaceSlug),
        onSuccess: (res) => {
            console.log(res)
           showApiSuccess(res)
           queryClient.invalidateQueries({
            queryKey: ['goals']
           })
        },
        onError: (error) => {
            showError(error)
        }
    })
}

export default useDeleteGoal