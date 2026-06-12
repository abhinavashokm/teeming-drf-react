import { useQuery } from '@tanstack/react-query';
import { discussionService } from '../../services/discussionService';
import useWorkspaceQueryKeys from '../helper/useWorkspaceQueryKeys';
import useGoalId from '../params/useGoalId';
import useWorkspaceSlug from '../params/useWorkspaceSlug';


export default function useDiscussionHistory() {

    const workspaceKeys = useWorkspaceQueryKeys()
    const workspaceSlug = useWorkspaceSlug()
    const goalId = useGoalId()

    return useQuery({
        queryKey: workspaceKeys.discussions,
        queryFn: async () => {
            const resData = await discussionService.fetchDiscussionHistory(workspaceSlug, goalId)
            return resData.data.messages
        },
    });
}