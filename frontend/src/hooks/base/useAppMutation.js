
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { showApiError, showApiSuccess, showSuccess } from '../../utils/toast'
import useWorkspaceSlug from '../workspace/useWorkspaceSlug'
import { useNavigate } from 'react-router-dom'
import { getSuccessMsg } from '../../utils/apiParser'

function useAppMutation({
    mutationFn,
    invalidateKeys = [],
    passWorkspaceSlug = false,
    apiSuccessToast = true,
    apiErrorToast = true,
    navigateAfterSuccess,
    successMsg,
    onSuccess,
    onError,
}) {

    const queryClient = useQueryClient()
    const workspaceSlug = useWorkspaceSlug()
    const navigate = useNavigate()

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

            await Promise.all(
                invalidateKeys.map(queryKey =>
                    queryClient.invalidateQueries({ queryKey })
                )
            )

            if (navigateAfterSuccess) {
                const toastMsg = apiSuccessToast ? getSuccessMsg(res) : successMsg

                if (toastMsg) {
                    navigate(navigateAfterSuccess, {
                        state: {
                            toast: {
                                type: 'success',
                                message: toastMsg
                            }
                        }
                    })
                } else {
                    navigate(navigateAfterSuccess)
                }
            } else {
                if (successMsg) {
                    showSuccess(successMsg)
                } else if (apiSuccessToast) {
                    showApiSuccess(res)
                }
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