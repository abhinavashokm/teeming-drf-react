import { useQuery } from '@tanstack/react-query';
import { discussionService } from '../../services/discussionService';
import useWorkspaceQueryKeys from '../helper/useWorkspaceQueryKeys';
import useGoalId from '../params/useGoalId';
import useWorkspaceSlug from '../params/useWorkspaceSlug';


export default function useDiscussionHistory(page=1) {

    const workspaceKeys = useWorkspaceQueryKeys()
    const workspaceSlug = useWorkspaceSlug()
    const goalId = useGoalId()

    return useQuery({
        queryKey: workspaceKeys.discussions(page),
        queryFn: async () => {
            const resData = await discussionService.fetchDiscussionHistory(workspaceSlug, goalId, page)
            return resData.data
        },
    });
}