import { use } from "react"
import useWorkspaceSlug from "../params/useWorkspaceSlug"
import { workspaceQueryKeys } from "../../constants/queryKeys"

function useWorkspaceQueryKeys() {
    const workspaceSlug = useWorkspaceSlug()

    return {
        all: workspaceQueryKeys.all,
        root: workspaceQueryKeys.root(workspaceSlug),
        members: workspaceQueryKeys.members(workspaceSlug),
        pendingInvitations: workspaceQueryKeys.pendingInvitations(workspaceSlug),
        goals: workspaceQueryKeys.goals(workspaceSlug),
        goal: (goalId) => workspaceQueryKeys.goal(workspaceSlug, goalId)
    }
}

export default useWorkspaceQueryKeys