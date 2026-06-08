import { outcomeService } from "../../services/outcomeService"
import useAppMutation from "../base/useAppMutation"
import useWorkspaceQueryKeys from "../helper/useWorkspaceQueryKeys"

function useCheckin() {
    const workspaceKeys = useWorkspaceQueryKeys()

    return useAppMutation({
        mutationFn: outcomeService.fetchCheckin,
        passWorkspaceSlug: true,
        invalidateKeys: [workspaceKeys.checkins],
    })
}

export default useCheckin