import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { goalService } from '../../services/goalService'
import useWorkspaceSlug from '../workspace/useWorkspaceSlug'

function useGoals() {
  const workspaceSlug = useWorkspaceSlug()

  return useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const resData = await goalService.fetchAllGoals(workspaceSlug)
      return resData.data.goals
    },

  })
}

export default useGoals