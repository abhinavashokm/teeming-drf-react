import { ideaService } from "../../services/ideaService"
import useAppMutation from "../base/useAppMutation"
import useWorkspaceQueryKeys from "../helper/useWorkspaceQueryKeys"

function useAddIdea() {
  
  const workspaceKeys = useWorkspaceQueryKeys()

  return useAppMutation({
    mutationFn: (slug, {data, goalId} ) => ideaService.addIdea(slug, goalId, data),
    passWorkspaceSlug: true,
    invalidateKeys: [workspaceKeys.ideas],
  })
}

export default useAddIdea