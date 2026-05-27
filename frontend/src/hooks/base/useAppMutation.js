
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { showApiError, showApiSuccess, showSuccess } from '../../utils/toast'

function useAppMutation({
    mutationFn,
    invalidateKeys = [],
    successMsg,
    onSuccess,
    onError,
}) {

    const queryClient = useQueryClient()

    return useMutation({
        mutationFn,

        onSuccess: async (res, variables, context) => {

            await Promise.all(
                invalidateKeys.map(queryKey =>
                    queryClient.invalidateQueries({ queryKey })
                )
            )

            if (successMsg) {
                showSuccess(successMsg)
            } else {
                showApiSuccess(res)
            }

            onSuccess?.(res, variables, context)

        },

        onError: (error, variables, context) => {
            showApiError(error)
            onError?.(error, variables, context)
        }

    })
}

export default useAppMutation