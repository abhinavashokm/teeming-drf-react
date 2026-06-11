import { ideaService } from '../../services/ideaService'
import useAppMutation from '../base/useAppMutation'
import useWorkspaceQueryKeys from '../helper/useWorkspaceQueryKeys'

function useMoveIdeaToPlanned() {

  const workspaceKeys = useWorkspaceQueryKeys()

  return useAppMutation({
    mutationFn: (workspaceSlug, {ideaId, data}) => ideaService.moveIdeaToPlanned(workspaceSlug, ideaId, data),
    passWorkspaceSlug: true,
    invalidateKeys: [workspaceKeys.ideas],
  })
}

export default useMoveIdeaToPlanned