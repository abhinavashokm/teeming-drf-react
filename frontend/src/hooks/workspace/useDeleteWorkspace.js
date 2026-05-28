import { useNavigate } from 'react-router-dom'
import { ROUTE_PATHS } from '../../constants/routePaths'
import { workspaceService } from '../../services/workspaceService'
import useAppMutation from '../base/useAppMutation'
import useWorkspaceSlug from '../workspace/useWorkspaceSlug'


function useDeleteWorkspace() {

    const workspaceSlug = useWorkspaceSlug()
    const navigate = useNavigate()

    return useAppMutation({
        mutationFn: workspaceService.deleteWorkspace,
        passWorkspaceSlug: true,
        invalidateKeys: [['workspace', workspaceSlug]],
        onSuccess: async (res) => navigate(ROUTE_PATHS.LOGIN),
    })
}

export default useDeleteWorkspace