import { workspaceService } from '../../services/workspaceService'
import useAppMutation from '../base/useAppMutation'
import useWorkspaceSlug from '../workspace/useWorkspaceSlug'


function useUpdateWorkspace() {

    const workspaceSlug = useWorkspaceSlug()

    return useAppMutation({
        mutationFn: (data) => workspaceService.updateWorkspace(data, workspaceSlug),
        invalidateKeys: [['workspace', workspaceSlug]]
    })
}

export default useUpdateWorkspace