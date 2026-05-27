import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { goalService } from '../../services/goalService'
import useWorkspaceSlug from '../workspace/useWorkspaceSlug'
import { showApiError, showApiSuccess } from '../../utils/toast'
import useAppMutation from '../base/useAppMutation'


function useUpdateGoal(){

  const workspaceSlug = useWorkspaceSlug()

  return useAppMutation({
    mutationFn: ({data, goalId}) => goalService.updateGoal(data, goalId, workspaceSlug),

    invalidateKeys: [['goals']]
  })
}

export default useUpdateGoal