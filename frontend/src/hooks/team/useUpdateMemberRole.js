import { workspaceService } from '../../services/workspaceService'
import useAppMutation from '../base/useAppMutation'
import useWorkspaceQueryKeys from '../helper/useWorkspaceQueryKeys'

function useUpdateMemberRole() {

    const workspaceKeys = useWorkspaceQueryKeys()

    return useAppMutation({
        //here workspace slug is attached to this callback fn by useAppMutation
        mutationFn: (workspaceSlug, { role, memberId }) => workspaceService.updateMemberRole(workspaceSlug, { role }, memberId),
        passWorkspaceSlug: true,
        invalidateKeys: [workspaceKeys.members]
    })
}

export default useUpdateMemberRole