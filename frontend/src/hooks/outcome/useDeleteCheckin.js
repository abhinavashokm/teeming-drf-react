import { outcomeService } from "../../services/outcomeService"
import useAppMutation from "../base/useAppMutation"
import useWorkspaceQueryKeys from "../helper/useWorkspaceQueryKeys"

function useDeleteCheckin() {
    const workspaceKeys = useWorkspaceQueryKeys()

    return useAppMutation({
        mutationFn: outcomeService.deleteCheckin,
        passWorkspaceSlug: true,
        invalidateKeys: [workspaceKeys.checkins],
    })
}

export default useDeleteCheckin