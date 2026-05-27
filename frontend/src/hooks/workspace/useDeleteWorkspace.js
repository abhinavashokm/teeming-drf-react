import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { workspaceService } from '../../services/workspaceService'
import useWorkspaceSlug from '../workspace/useWorkspaceSlug'
import { showApiSuccess, showError } from '../../utils/toast'
import { useNavigate } from 'react-router-dom'

function useDeleteWorkspace() {

    const workspaceSlug = useWorkspaceSlug()
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    return useMutation({
        mutationFn: () => workspaceService.deleteWorkspace(workspaceSlug),
        onSuccess: async (res) => {

            await showApiSuccess(res)
            navigate('/auth/login/')

            queryClient.invalidateQueries({
                queryKey: ['workspace', workspaceSlug]
            })

        },
        onError: (error) => {
            showError(error)
        }
    })
}

export default useDeleteWorkspace