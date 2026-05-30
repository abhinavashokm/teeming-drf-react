
import { inviteService } from '../../services/inviteService'
import useAppMutation from "../base/useAppMutation"
import useWorkspaceQueryKeys from "../helper/useWorkspaceQueryKeys"


function useCancelnvitation() {

    const workspaceKeys = useWorkspaceQueryKeys()

  return useAppMutation({
    'mutationFn': inviteService.cancelInvitation,
    passWorkspaceSlug: true,
    invalidateKeys: [workspaceKeys.pendingInvitations]
  })
}

export default useCancelnvitation