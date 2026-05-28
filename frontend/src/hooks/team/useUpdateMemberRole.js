import { useMutation, useQueryClient } from '@tanstack/react-query'
import { workspaceService } from '../../services/workspaceService'
import { showApiError, showApiSuccess } from '../../utils/toast'
import useWorkspaceSlug from '../workspace/useWorkspaceSlug'
import { useNavigate } from 'react-router-dom'

function useUpdateMemberRole() {

    const workspaceSlug = useWorkspaceSlug()
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    return useMutation({
        mutationFn: ({role, memberId}) => workspaceService.updateMemberRole(workspaceSlug, {role}, memberId),
        onSuccess: (res) => {
            queryClient.invalidateQueries({
                queryKey: ['team', workspaceSlug]
            })

            showApiSuccess(res)
        },
        onError: (error) => {
            showApiError(error)
        }
    })
}

export default useUpdateMemberRole