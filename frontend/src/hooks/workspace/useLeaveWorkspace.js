import { useMutation, useQueryClient } from '@tanstack/react-query'
import { workspaceService } from '../../services/workspaceService'
import { showApiError, showApiSuccess } from '../../utils/toast'
import useWorkspaceSlug from '../workspace/useWorkspaceSlug'
import { useNavigate } from 'react-router-dom'
import useAuth from '../auth/useAuth'

function useLeaveWorkspace() {

    const workspaceSlug = useWorkspaceSlug()
    const { data: currentUser } = useAuth()
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    return useMutation({
        mutationFn: () => workspaceService.leaveWorkspace(workspaceSlug),
        onSuccess: (res) => {
            queryClient.invalidateQueries({
                queryKey: ['team', workspaceSlug]
            })

            navigate('/auth/login/')
            showApiSuccess(res)
        },
        onError: (error) => {
            showApiError(error)
        }
    })
}

export default useLeaveWorkspace