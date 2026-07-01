import { useQueryClient } from '@tanstack/react-query'
import { ideaService } from '../../services/ideaService'
import useAppMutation from '../base/useAppMutation'
import useWorkspaceQueryKeys from '../helper/useWorkspaceQueryKeys'

function useUnlikeIdea() {
    const workspaceKeys = useWorkspaceQueryKeys()
    const queryClient = useQueryClient()
    const queryKey = workspaceKeys.ideas

    return useAppMutation({
        mutationFn: ideaService.unlikeIdea,
        passWorkspaceSlug: true,
        onMutate: async (ideaId) => {

            await queryClient.cancelQueries(queryKey)
            const previousIdeas = queryClient.getQueryData(queryKey)

            queryClient.setQueryData(queryKey, (old) => {
                if (!old) return old
                return old.map((idea) =>
                    idea.id === ideaId
                        ? {
                            ...idea,
                            isLiked: false,
                            likeCount: Math.max((idea.likeCount ?? 1) - 1, 0),
                        }
                        : idea
                )
            })

            return { previousIdeas, queryKey }
        },
        onError: (err, variables, context) => {
            if (context?.previousIdeas) {
                queryClient.setQueryData(context.queryKey, context.previousIdeas)
            }
        },

        invalidateKeys: [queryKey],
        passWorkspaceSlug: true,
        apiSuccessToast: false,
    })
}

export default useUnlikeIdea