
import { inviteService } from '../../services/inviteService'
import useAppMutation from "../base/useAppMutation"


function useInviteMembers() {

  return useAppMutation({
    'mutationFn': inviteService.sendInvitations,
    passWorkspaceSlug: true,
  })
}

export default useInviteMembers