import { outcomeService } from "../../services/outcomeService"
import useAppMutation from "../base/useAppMutation"
import useWorkspaceQueryKeys from "../helper/useWorkspaceQueryKeys"

function useDeleteMetric() {
    const workspaceKeys = useWorkspaceQueryKeys()

    return useAppMutation({
        mutationFn: outcomeService.getMetric,
        passWorkspaceSlug: true,
        invalidateKeys: [workspaceKeys.metrics],
    })
}

export default useDeleteMetric