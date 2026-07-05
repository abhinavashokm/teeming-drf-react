import { workspaceService } from '../../services/workspaceService'
import useAppMutation from '../base/useAppMutation'
import useWorkspaceQueryKeys from '../helper/useWorkspaceQueryKeys'


function useRemoveWorkspaceLogo() {

    const workspaceKeys = useWorkspaceQueryKeys()

    return useAppMutation({
        mutationFn: workspaceService.removeWorkspaceLogo,
        passWorkspaceSlug: true,
        invalidateKeys: [workspaceKeys.root],
        apiSuccessToast: false,
    })
}

export default useRemoveWorkspaceLogo