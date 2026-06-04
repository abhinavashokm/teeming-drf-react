import { useQuery } from '@tanstack/react-query'
import { inviteService } from '../../services/inviteService'
import useWorkspaceQueryKeys from '../helper/useWorkspaceQueryKeys'
import useWorkspaceSlug from "../params/useWorkspaceSlug"

export default function usePendingInvitations() {

    const workspaceSlug = useWorkspaceSlug()
    const workspaceKeys = useWorkspaceQueryKeys()

  return useQuery({
    queryKey: workspaceKeys.pendingInvitations,
    queryFn: async () => {
        const res = await inviteService.fetchPendingInvitations(workspaceSlug)
        return res.data.pendingInvitations
    },
  })
}
