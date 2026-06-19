import { useEffect } from "react"
import useAuth from "../../hooks/auth/useAuth"
import useWorkspaceRedirect from "../../hooks/routes/useWorkspaceRedirect"
import { Outlet, useNavigate } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
import { globalQueryKeys } from "../../constants/queryKeys"
import { buildWorkspacePath } from "../../utils/routeUtils"


function PublicRoute() {

    const queryClient = useQueryClient()
    const currentUser = queryClient.getQueryData(globalQueryKeys.auth)
    const navigate = useNavigate()

    const { mutate: redirectToWorkspace } = useWorkspaceRedirect()

    useEffect(() => {
        if (currentUser) {
            if(currentUser.lastWorkspace){
                const workspacePath = buildWorkspacePath(currentUser.lastWorkspace.slug)
                navigate(workspacePath)
            }else{
                redirectToWorkspace()
            }
        }
    }, [currentUser])

    if (currentUser) return null  // prevent flash
    return <Outlet />
}

export default PublicRoute