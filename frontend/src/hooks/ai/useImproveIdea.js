import { aiService } from '../../services/aiService'
import useAppMutation from '../base/useAppMutation'


function useImproveIdea(){

  return useAppMutation({
    mutationFn: (workspaceSlug, {data, goalId}) => aiService.improveIdea(workspaceSlug, goalId, data),
    passWorkspaceSlug: true,
    apiSuccessToast: false,
    apiErrorToast: false,
  })
  
}

export default useImproveIdea