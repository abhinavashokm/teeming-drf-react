
import { useMutation } from '@tanstack/react-query'
import { inviteService } from '../../services/inviteService'
import { showApiError, showSuccess } from '../../utils/toast'
import useWorkspaceSlug from '../workspace/useWorkspaceSlug'
import useAppMutation from "../base/useAppMutation"


function useInviteMembers() {

  const slug = useWorkspaceSlug()

  return useAppMutation({
    'mutationFn': (data) => inviteService.sendInvitations(slug, data)
  })
}

export default useInviteMembers