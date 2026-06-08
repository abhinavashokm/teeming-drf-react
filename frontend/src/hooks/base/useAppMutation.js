
import.meta.env.DEV // boolean, true in dev automatically

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { showApiError, showApiSuccess, showError, showSuccess } from '../../utils/toast'
import useWorkspaceSlug from '../params/useWorkspaceSlug'

function useAppMutation({
    mutationFn,
    invalidateKeys = [],
    passWorkspaceSlug = false,
    apiSuccessToast = true,
    apiErrorToast = true,
    successMsg,
    onSuccess,
    onError,
    onMutate,
}) {

    const queryClient = useQueryClient()
    const workspaceSlug = useWorkspaceSlug()

    return useMutation({

        mutationFn: (variables) => {

            //include the workspace slug in service fn call
            if (passWorkspaceSlug) {
                return mutationFn(workspaceSlug, variables)
            }

            return mutationFn(variables)

        }
        ,

        onSuccess: async (res, variables, context) => {

            const results = await Promise.allSettled(
                invalidateKeys.map(queryKey =>
                    queryClient.invalidateQueries({ queryKey })
                )
            )

            // dev mode only: log failures without crashing
            results.forEach((result, index) => {
                if (
                    import.meta.env.DEV &&
                    result.status === 'rejected'
                ) {
                    console.error(
                        `Failed to invalidate key: ${invalidateKeys[index]}`,
                        result.reason
                    )
                }
            })

            // if successMsg is passed, treat it as opting out of apiSuccessToast automatically
            const shouldShowApiToast = apiSuccessToast && !successMsg

            if (successMsg) {
                showSuccess(successMsg)
            } else if (shouldShowApiToast) {
                showApiSuccess(res)
            }

            onSuccess?.(res, variables, context)

        },

        onError: (error, variables, context) => {
            if (apiErrorToast) {
                showApiError(error)
            }

            onError?.(error, variables, context)
        },

        onMutate: async (variables) => {
            return await onMutate?.(variables);
        }

    })
}

export default useAppMutation