import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import {buildWorkspacePath} from "../../utils/routeUtils"

export default function useSwitchWorkspace() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    return (workspace) => {
        queryClient.clear()
        navigate(buildWorkspacePath(workspace.slug))
    }
}