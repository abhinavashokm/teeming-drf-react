import { useNavigate } from 'react-router-dom'
import { workspaceService } from '../../services/workspaceService'
import useAppMutation from '../base/useAppMutation'
import useWorkspaceSlug from '../workspace/useWorkspaceSlug'
import { getSuccessMsg } from '../../utils/apiParser'


const useLeaveWorkspace = () => {

    const workspaceSlug = useWorkspaceSlug()
    const navigate = useNavigate()

    return useAppMutation({
        mutationFn: workspaceService.leaveWorkspace,
        passWorkspaceSlug: true,
        invalidateKeys: [['team', workspaceSlug]],
        onSuccess: () => navigate('/workspaces'),
    })
}

export default useLeaveWorkspace