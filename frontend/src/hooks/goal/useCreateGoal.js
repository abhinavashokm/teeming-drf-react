import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { goalService } from '../../services/goalService'
import useWorkspaceSlug from '../workspace/useWorkspaceSlug'
import { showApiError, showApiSuccess } from '../../utils/toast'

function useCreateGoal() {

  const workspaceSlug = useWorkspaceSlug()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => goalService.createGoal(data, workspaceSlug),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ['goals']
      })
      showApiSuccess(res)
      return res.data
    },
    onError: (error) => {
      showApiError(error)
    }
  })
}

export default useCreateGoal