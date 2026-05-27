
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { showApiError, showApiSuccess, showSuccess } from '../../utils/toast'
import useWorkspaceSlug from '../workspace/useWorkspaceSlug'

function useAppMutation({
    mutationFn,
    invalidateKeys = [],
    passWorkspaceSlug = false,
    apiSuccessToast = true,
    apiErrorToast = true,
    successMsg,
    onSuccess,
    onError,
}) {

    const queryClient = useQueryClient()
    const workspaceSlug = useWorkspaceSlug()

    return useMutation({

        mutationFn: (variables) => {

            //include the workspace slug in service fn call
            if (passWorkspaceSlug) {
                return mutationFn(variables, workspaceSlug)
            }

            return mutationFn(variables)

        }
        ,

        onSuccess: async (res, variables, context) => {

            await Promise.all(
                invalidateKeys.map(queryKey =>
                    queryClient.invalidateQueries({ queryKey })
                )
            )

            if (successMsg) {
                showSuccess(successMsg)
            } else if (apiSuccessToast) {
                showApiSuccess(res)
            }

            onSuccess?.(res, variables, context)

        },

        onError: (error, variables, context) => {
            if (apiErrorToast) {
                showApiError(error)
            }

            onError?.(error, variables, context)
        }

    })
}

export default useAppMutation