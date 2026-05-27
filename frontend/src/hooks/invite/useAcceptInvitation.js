import { useMutation } from '@tanstack/react-query'
import React from 'react'
import { inviteService } from '../../services/inviteService'
import useInvitationToken from "./useInvitationToken"
import useWorkspaceRedirect from '../routes/useWorkspaceRedirect'

function useAcceptInvitation() {
  const invitationToken = useInvitationToken()
  const { mutate: workspaceRedirect } = useWorkspaceRedirect()

  return useMutation({
    'mutationFn': () => inviteService.acceptInvitation(invitationToken),
    onSuccess: (res) => {
      workspaceRedirect()
    }
  })
}

export default useAcceptInvitation