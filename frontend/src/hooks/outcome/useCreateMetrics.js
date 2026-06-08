import useAppMutation from "../base/useAppMutation"
import { outcomeService } from "../../services/outcomeService"
import useGoalId from "../params/useGoalId"
import useWorkspaceQueryKeys from "../helper/useWorkspaceQueryKeys"

function useCreateMetrics() {
    const goalId = useGoalId()
    const workspaceKeys = useWorkspaceQueryKeys()

    return useAppMutation({
        mutationFn: (workspaceSlug, data) => outcomeService.createMetrics(workspaceSlug, goalId, data),
        passWorkspaceSlug: true,
        invalidateKeys: [workspaceKeys.metrics],
    })
}

export default useCreateMetrics