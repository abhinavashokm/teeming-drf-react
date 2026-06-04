import { useNavigate } from 'react-router-dom'
import { workspaceService } from '../../services/workspaceService'
import { buildWorkspacePath } from '../../utils/routeUtils'
import useAppMutation from '../base/useAppMutation'
import useNavigateWithToast from '../routes/useNavigateWithToast'
import useWorkspaceSlug from '../params/useWorkspaceSlug'
import { ROUTE_PATHS } from '../../constants/routePaths'
import useWorkspaceQueryKeys from '../helper/useWorkspaceQueryKeys'


function useUpdateWorkspace() {

    const workspaceSlug = useWorkspaceSlug()
    const navigate = useNavigate()
    const workspaceKeys = useWorkspaceQueryKeys()

    return useAppMutation({
        mutationFn: workspaceService.updateWorkspace,
        onSuccess: (res) => {

            //if slug updated, redirect to new slug
            if (res.data.slug !== workspaceSlug) {
                navigate(ROUTE_PATHS.WORKSPACE_SETTINGS(res.data.slug), { replace: true })
            }

        },
        passWorkspaceSlug: true,
        invalidateKeys: [workspaceKeys.root]
    })
}

export default useUpdateWorkspace