
import { inviteService } from '../../services/inviteService'
import useAppMutation from "../base/useAppMutation"
import useWorkspaceQueryKeys from '../helper/useWorkspaceQueryKeys'


function useInviteMembers() {

  const workspaceKeys = useWorkspaceQueryKeys()

  return useAppMutation({
    'mutationFn': inviteService.sendInvitations,
    passWorkspaceSlug: true,
    invalidateKeys: [workspaceKeys.pendingInvitations]
  })
}

export default useInviteMembers