import { useQuery } from '@tanstack/react-query'
import { goalService } from '../../services/goalService'
import useWorkspaceQueryKeys from '../helper/useWorkspaceQueryKeys'
import useWorkspaceSlug from '../workspace/useWorkspaceSlug'

function useGoals() {
  const workspaceSlug = useWorkspaceSlug()
  const workspaceKeys = useWorkspaceQueryKeys()

  return useQuery({
    queryKey: workspaceKeys.goals,
    queryFn: async () => {
      const resData = await goalService.fetchAllGoals(workspaceSlug)
      return resData.data.goals
    },
  })
}

export default useGoals