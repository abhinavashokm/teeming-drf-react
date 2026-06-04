import { useQuery } from '@tanstack/react-query'
import { goalService } from '../../services/goalService'
import useWorkspaceQueryKeys from '../helper/useWorkspaceQueryKeys'
import useWorkspaceSlug from '../params/useWorkspaceSlug'
import useGoalId from '../params/useGoalId'

function useGoal() {
  const workspaceSlug = useWorkspaceSlug()
  const goalId = useGoalId()
  const workspaceKeys = useWorkspaceQueryKeys()

  return useQuery({
    queryKey: workspaceKeys.goal(goalId),
    queryFn: async () => {
      const resData = await goalService.fetchGoal(workspaceSlug, goalId)
      return resData.data
    },
    enabled: !!goalId,
  })
}

export default useGoal