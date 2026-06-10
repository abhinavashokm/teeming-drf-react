import { ideaService } from "../../services/ideaService"
import useAppMutation from "../base/useAppMutation"
import useWorkspaceQueryKeys from "../helper/useWorkspaceQueryKeys"

function useUpdateIdea() {
  
  const workspaceKeys = useWorkspaceQueryKeys()

  return useAppMutation({
    mutationFn: (slug, {data, ideaId} ) => ideaService.updateIdea(slug, ideaId, data),
    passWorkspaceSlug: true,
    invalidateKeys: [workspaceKeys.ideas],
  })
}

export default useUpdateIdea