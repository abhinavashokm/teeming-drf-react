import { useQuery } from '@tanstack/react-query'
import { goalService } from '../../services/goalService'
import useWorkspaceQueryKeys from '../helper/useWorkspaceQueryKeys'
import useWorkspaceSlug from '../params/useWorkspaceSlug'

function useGoals() {
  const workspaceSlug = useWorkspaceSlug()
  const workspaceKeys = useWorkspaceQueryKeys()
  const limit = 8

  return useQuery({
    queryKey: workspaceKeys.goals,
    queryFn: async () => {
      const resData = await goalService.fetchAllGoals(workspaceSlug, limit)
      return resData.data.goals
    },
  })
}

export default useGoals