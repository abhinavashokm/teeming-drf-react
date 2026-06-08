import { useQuery } from '@tanstack/react-query'
import { outcomeService } from '../../services/outcomeService'
import useWorkspaceQueryKeys from '../helper/useWorkspaceQueryKeys'
import useGoalId from '../params/useGoalId'
import useWorkspaceSlug from '../params/useWorkspaceSlug'

function useCheckins() {
    const workspaceKeys = useWorkspaceQueryKeys()
    const workspaceSlug = useWorkspaceSlug()
    const goalId = useGoalId()

    return useQuery({
        queryKey: workspaceKeys.checkins,
        queryFn: async () => {
            const resData = await outcomeService.fetchCheckins(workspaceSlug, goalId)
            return resData.data.checkins
        },
    })
}

export default useCheckins