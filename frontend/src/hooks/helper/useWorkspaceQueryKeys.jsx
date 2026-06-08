import { use } from "react"
import useWorkspaceSlug from "../params/useWorkspaceSlug"
import { workspaceQueryKeys } from "../../constants/queryKeys"
import useGoalId from "../params/useGoalId"

function useWorkspaceQueryKeys() {
    const workspaceSlug = useWorkspaceSlug()
    const goalId = useGoalId()

    return {
        all: workspaceQueryKeys.all,
        root: workspaceQueryKeys.root(workspaceSlug),
        members: workspaceQueryKeys.members(workspaceSlug),
        pendingInvitations: workspaceQueryKeys.pendingInvitations(workspaceSlug),
        goals: workspaceQueryKeys.goals(workspaceSlug),
        goal:  workspaceQueryKeys.goal(workspaceSlug, goalId),
        ideas: workspaceQueryKeys.ideas(workspaceSlug, goalId),
        metrics: workspaceQueryKeys.metrics(workspaceSlug, goalId)
    }
}

export default useWorkspaceQueryKeys