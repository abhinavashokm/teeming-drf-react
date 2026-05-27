import { useDispatch } from "react-redux";
import { workspaceService } from "../../services/workspaceService";
import { showApiError } from "../../utils/toast";
import { useNavigate } from "react-router-dom";
import { buildWorkspacePath, getWorkspaceRedirectPath } from "../../utils/routeUtils";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export default function useSwitchWorkspace() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    return useMutation({
        'mutationFn': (workspace) => {
            queryClient.invalidateQueries()
            navigate(buildWorkspacePath(workspace.slug))
        }
    })
}