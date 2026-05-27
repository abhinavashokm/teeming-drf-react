import { useMutation, useQueryClient } from '@tanstack/react-query'
import { workspaceService } from '../../services/workspaceService'
import { showApiError, showApiSuccess } from '../../utils/toast'
import useWorkspaceSlug from '../workspace/useWorkspaceSlug'
import { useNavigate } from 'react-router-dom'
import useAppMutation from '../base/useAppMutation'


function useRemoveMember() {
    const workspaceSlug = useWorkspaceSlug()

    return useAppMutation({
        mutationFn: workspaceService.removeMember,
        invalidateKeys: ['team', workspaceSlug]
    })
}

export default useRemoveMember