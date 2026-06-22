import { Outlet, useOutletContext } from "react-router-dom"
import useWorkspaceSlug from "../hooks/params/useWorkspaceSlug"
import { GroupDiscussionWSProvider } from "../contexts/GroupDiscussionWSContext"
import useGoalId from "../hooks/params/useGoalId"
import { useEffect } from "react"

export default function GoalDashboardLayout() {
    const workspaceSlug = useWorkspaceSlug()
    const goalId = useGoalId()

    /* -------------------------------------------------------------------------- */
    /* override workspace layout spacing for full horizontal width */
    /* -------------------------------------------------------------------------- */
    const { setIsFullBleed, setIsGoalInfoModalOpen } = useOutletContext()

    useEffect(() => {
        setIsFullBleed(true)
        return () => setIsFullBleed(false);
    }, [])

    return (
        <GroupDiscussionWSProvider workspaceSlug={workspaceSlug} goalId={goalId}>
            <Outlet context={ {setIsGoalInfoModalOpen} } />
        </GroupDiscussionWSProvider>
    )
}