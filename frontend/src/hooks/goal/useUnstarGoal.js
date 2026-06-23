import { useQueryClient } from '@tanstack/react-query'
import { goalService } from '../../services/goalService'
import useAppMutation from '../base/useAppMutation'
import useWorkspaceQueryKeys from '../helper/useWorkspaceQueryKeys'

function useUnstarGoal() {

    const workspaceKeys = useWorkspaceQueryKeys()
    const queryClient = useQueryClient()

    return useAppMutation({
        mutationFn: goalService.unStarGoal,
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
                                        isStarred: false,
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

export default useUnstarGoal