import { useNavigate } from 'react-router-dom'
import { ROUTE_PATHS } from '../../constants/routePaths'
import { workspaceService } from '../../services/workspaceService'
import useAppMutation from '../base/useAppMutation'
import useWorkspaceQueryKeys from '../helper/useWorkspaceQueryKeys'


function useDeleteWorkspace() {

    const navigate = useNavigate()
    const workspaceKeys = useWorkspaceQueryKeys()

    return useAppMutation({
        mutationFn: workspaceService.deleteWorkspace,
        passWorkspaceSlug: true,
        invalidateKeys: [workspaceKeys.root],
        onSuccess: async (res) => navigate(ROUTE_PATHS.LOGIN),
    })
}

export default useDeleteWorkspace