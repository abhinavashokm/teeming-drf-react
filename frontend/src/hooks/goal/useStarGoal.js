import { useQueryClient } from '@tanstack/react-query'
import { goalService } from '../../services/goalService'
import useAppMutation from '../base/useAppMutation'
import useWorkspaceQueryKeys from '../helper/useWorkspaceQueryKeys'

function useStarGoal() {

    const workspaceKeys = useWorkspaceQueryKeys()
    const queryClient = useQueryClient();

    return useAppMutation({
        mutationFn: goalService.starGoal,
        onMutate: async (goalId) => {

            await queryClient.cancelQueries(workspaceKeys.goals)
            const previousGoals =
                queryClient.getQueryData(workspaceKeys.goals);

            queryClient.setQueryData(
                workspaceKeys.goals,
                (old) => {

                    if (!old) return old;

                    return {
                        ...old,

                        pages: old.pages.map(page => ({
                            ...page,

                            goals: page.goals.map(goal =>
                                goal.id === goalId
                                    ? {
                                        ...goal,
                                        isStarred: true,
                                    }
                                    : goal
                            ),
                        })),
                    };
                }
            );

            return { previousGoals };
        },
        invalidateKeys: [workspaceKeys.goals],
        passWorkspaceSlug: true,
        apiSuccessToast: false,
    })
}

export default useStarGoal