import { useMutation } from '@tanstack/react-query'
import React from 'react'
import { inviteService } from '../../services/inviteService'
import useInvitationToken from "./useInvitationToken"
import useWorkspaceRedirect from '../routes/useWorkspaceRedirect'
import useAppMutation from '../base/useAppMutation'
import useWelcomeBanner from './useWelcomeBanner'
import useAuth from '../auth/useAuth'

function useAcceptInvitation() {
  const invitationToken = useInvitationToken()
  const { mutate: workspaceRedirect } = useWorkspaceRedirect()
  const { setWelcome } = useWelcomeBanner()
  const {data: currentUser} = useAuth()

  return useAppMutation({
    'mutationFn': () => inviteService.acceptInvitation(invitationToken),
    onSuccess: (res) => {

      //store it in local storage for welcome msg
      setWelcome(res.data.joinedWorkspace.slug, currentUser.id)

      workspaceRedirect()
    }
  })
}

export default useAcceptInvitation