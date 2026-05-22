
import { useMutation } from '@tanstack/react-query'
import { inviteService } from '../../services/inviteService'
import { showApiError, showSuccess } from '../../utils/toast'
import useWorkspaceSlug from '../workspace/useWorkspaceSlug'

function useInviteMembers() {

  const slug = useWorkspaceSlug()

  return useMutation({
    'mutationFn': (data) => inviteService.sendInvitations(slug, data),
    'onSuccess': () => {
      showSuccess("Invitation send successfully")
    },
    'onError': (error) => {
      console.log(error)
      showApiError(error)
    }
  })
}

export default useInviteMembers