import { useMutation } from '@tanstack/react-query'
import React from 'react'
import { inviteService } from '../../services/inviteService'
import useInvitationToken from "./useInvitationToken"
import useWorkspaceRedirect from "../workspace/useWorkspaceRedirect"

function useAcceptInvitation() {
    const invitationToken = useInvitationToken()
    const workspaceRedirect = useWorkspaceRedirect()

  return useMutation({
    'mutationFn': () => inviteService.acceptInvitation(invitationToken),
    onSuccess: async(res) => {
        await workspaceRedirect()
    }
  })
}

export default useAcceptInvitation