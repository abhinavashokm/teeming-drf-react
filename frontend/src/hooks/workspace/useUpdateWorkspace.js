import { useNavigate } from 'react-router-dom'
import { workspaceService } from '../../services/workspaceService'
import { buildWorkspacePath } from '../../utils/routeUtils'
import useAppMutation from '../base/useAppMutation'
import useNavigateWithToast from '../routes/useNavigateWithToast'
import useWorkspaceSlug from '../workspace/useWorkspaceSlug'
import { ROUTE_PATHS } from '../../constants/routePaths'


function useUpdateWorkspace() {

    const workspaceSlug = useWorkspaceSlug()
    const navigate = useNavigate()

    return useAppMutation({
        mutationFn: (data) => workspaceService.updateWorkspace(workspaceSlug, data),
        onSuccess: (res) => {

            //if slug updated, redirect to new slug
            if (res.data.slug !== workspaceSlug) {
                navigate(ROUTE_PATHS.WORKSPACE_SETTINGS(res.data.slug), { replace: true })
            }

        }
    })
}

export default useUpdateWorkspace