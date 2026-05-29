import { use } from "react"
import useWorkspaceSlug from "../workspace/useWorkspaceSlug"
import { workspaceQueryKeys } from "../../constants/queryKeys"

function useWorkspaceQueryKeys() {
    const workspaceSlug = useWorkspaceSlug()

    return {
        all: workspaceQueryKeys.all,
        root: workspaceQueryKeys.root(workspaceSlug),
        members: workspaceQueryKeys.members(workspaceSlug),
        pendingInvitations: workspaceQueryKeys.pendingInvitations(workspaceSlug),
        goals: workspaceQueryKeys.goals(workspaceSlug),
    }
}

export default useWorkspaceQueryKeys