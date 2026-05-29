import { workspaceService } from '../../services/workspaceService'
import useAppMutation from '../base/useAppMutation'
import useWorkspaceQueryKeys from '../helper/useWorkspaceQueryKeys'


function useRemoveMember() {

    const workspaceKeys = useWorkspaceQueryKeys()

    return useAppMutation({
        mutationFn: workspaceService.removeMember,
        passWorkspaceSlug: true,
        invalidateKeys: [workspaceKeys.members],
    })
}

export default useRemoveMember