import { useQuery } from '@tanstack/react-query'
import useWorkspaceSlug from "../workspace/useWorkspaceSlug"
import { inviteService } from '../../services/inviteService'

export default function usePendingInvitations() {

    const workspaceSlug = useWorkspaceSlug()

  return useQuery({
    queryKey: ['pendingInvitations', workspaceSlug],
    queryFn: async () => {
        const res = await inviteService.fetchPendingInvitations(workspaceSlug)
        return res.data.pendingInvitations
    },
  })
}
