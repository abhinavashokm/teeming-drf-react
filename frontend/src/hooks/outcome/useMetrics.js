import { useQuery } from '@tanstack/react-query'
import { outcomeService } from '../../services/outcomeService'
import useWorkspaceQueryKeys from '../helper/useWorkspaceQueryKeys'
import useGoalId from '../params/useGoalId'
import useWorkspaceSlug from '../params/useWorkspaceSlug'

function useMetrics() {
    const workspaceKeys = useWorkspaceQueryKeys()
    const workspaceSlug = useWorkspaceSlug()
    const goalId = useGoalId()

    return useQuery({
        queryKey: workspaceKeys.metrics,
        queryFn: async () => {
            const resData = await outcomeService.fetchMetrics(workspaceSlug, goalId)
            return resData.data.metrics
        },
    })
}

export default useMetrics