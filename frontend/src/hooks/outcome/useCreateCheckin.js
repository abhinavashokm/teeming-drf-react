import useAppMutation from "../base/useAppMutation"
import { outcomeService } from "../../services/outcomeService"
import useGoalId from "../params/useGoalId"
import useWorkspaceQueryKeys from "../helper/useWorkspaceQueryKeys"

function useCreateCheckin() {
    const goalId = useGoalId()
    const workspaceKeys = useWorkspaceQueryKeys()

    return useAppMutation({
        mutationFn: (workspaceSlug, data) => outcomeService.createCheckin(workspaceSlug, goalId, data),
        passWorkspaceSlug: true,
        invalidateKeys: [workspaceKeys.checkins],

    })
}

export default useCreateCheckin