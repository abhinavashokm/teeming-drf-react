import { workspaceService } from '../../services/workspaceService'
import useAppMutation from '../base/useAppMutation'
import useWorkspaceSlug from '../workspace/useWorkspaceSlug'


const useLeaveWorkspace = () => {

    const workspaceSlug = useWorkspaceSlug()

    return useAppMutation({
        mutationFn: workspaceService.leaveWorkspace,
        passWorkspaceSlug: true,
        invalidateKeys: [['team', workspaceSlug]],
        navigateAfterSuccess: '/workspaces',
    })
}

export default useLeaveWorkspace