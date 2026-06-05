import { useQuery } from '@tanstack/react-query'
import useWorkspaceQueryKeys from "../helper/useWorkspaceQueryKeys"
import useGoalId from '../params/useGoalId'
import { ideaService } from '../../services/ideaService'
import useWorkspaceSlug from '../params/useWorkspaceSlug'

function useIdeas() {

    const workspaceKeys = useWorkspaceQueryKeys()
    const workspaceSlug = useWorkspaceSlug()
    const goalId = useGoalId()

    return useQuery({
        queryKey: workspaceKeys.ideas,
        queryFn: async () => {
            const resData = await ideaService.fetchIdeas(workspaceSlug, goalId)
            return resData.data.ideas
        },
    })
}

export default useIdeas