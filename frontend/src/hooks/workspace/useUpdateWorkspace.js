import { workspaceService } from '../../services/workspaceService'
import { buildWorkspacePath } from '../../utils/routeUtils'
import useAppMutation from '../base/useAppMutation'
import useWorkspaceSlug from '../workspace/useWorkspaceSlug'


function useUpdateWorkspace() {

    const workspaceSlug = useWorkspaceSlug()

    return useAppMutation({
        mutationFn: (data) => workspaceService.updateWorkspace(workspaceSlug, data),
        invalidateKeys: [['workspace', workspaceSlug]],
        navigateAfterSuccess: buildWorkspacePath(workspaceSlug)
    })
}

export default useUpdateWorkspace