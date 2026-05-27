import { useEffect } from "react"
import useAuth from "../../hooks/auth/useAuth"
import useWorkspaceRedirect from "../../hooks/api/useWorkspaceRedirect"
import { Outlet } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"


function PublicRoute() {
    //const { data: currentUser } = useAuth('public route')
    const queryClient = useQueryClient()
    const currentUser = queryClient.getQueryData(['auth'])

    const { mutate: redirectToWorkspace } = useWorkspaceRedirect()

    useEffect(() => {
        if (currentUser) {
            redirectToWorkspace()
        }
    }, [currentUser])

    if (currentUser) return null  // prevent flash
    return <Outlet />
}

export default PublicRoute