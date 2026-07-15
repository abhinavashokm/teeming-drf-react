import { use } from "react"
import useWorkspaceSlug from "../params/useWorkspaceSlug"
import { workspaceQueryKeys } from "../../constants/queryKeys"
import useGoalId from "../params/useGoalId"
import useAuth from "../auth/useAuth"

function useWorkspaceQueryKeys() {
    const workspaceSlug = useWorkspaceSlug()
    const goalId = useGoalId()
    const { data: currentUser } = useAuth()

    return {
        all: workspaceQueryKeys.all,
        root: workspaceQueryKeys.root(workspaceSlug),
        members: workspaceQueryKeys.members(workspaceSlug),
        onlineMembers: workspaceQueryKeys.onlineMembers(workspaceSlug),
        pendingInvitations: workspaceQueryKeys.pendingInvitations(workspaceSlug),
        goals: workspaceQueryKeys.goals(workspaceSlug),
        goal:  workspaceQueryKeys.goal(workspaceSlug, goalId),
        ideas: workspaceQueryKeys.ideas(workspaceSlug, goalId),
        metrics: workspaceQueryKeys.metrics(workspaceSlug, goalId),
        checkins: workspaceQueryKeys.checkins(workspaceSlug, goalId),
        notifications: workspaceQueryKeys.notifications(workspaceSlug),
        discussions: () => workspaceQueryKeys.discussions(workspaceSlug, goalId),
        ai_assistant_responses: workspaceQueryKeys.ai_assistant_responses(currentUser.email, workspaceSlug, goalId)
    }
}

export default useWorkspaceQueryKeys