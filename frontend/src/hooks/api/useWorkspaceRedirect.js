import { useDispatch } from "react-redux";
import { workspaceService } from "../../services/workspaceService";
import { showApiError } from "../../utils/toast";
import { useNavigate } from "react-router-dom";
import { getWorkspaceRedirectPath } from "../../utils/routeUtils";
import { useMutation } from "@tanstack/react-query";


export default function useWorkspaceRedirect() {
    const navigate = useNavigate()

    return useMutation({
        'mutationFn': () => workspaceService.fetchMyWorkspaces(),
        onSuccess: (res) => {
            navigate(getWorkspaceRedirectPath(res.data))},
        onError: (error) => showApiError(error)
    })
}