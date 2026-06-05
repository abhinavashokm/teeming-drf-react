import { ideaService } from "../../services/ideaService"
import useAppMutation from "../base/useAppMutation"

function useAddIdea() {
  return useAppMutation({
    mutationFn: (slug, {data, goalId} ) => ideaService.addIdea(slug, goalId, data),
    passWorkspaceSlug: true,
  })
}

export default useAddIdea