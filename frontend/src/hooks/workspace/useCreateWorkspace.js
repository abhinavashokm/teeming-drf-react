import { useNavigate } from "react-router-dom";
import { workspaceService } from "../../services/workspaceService";
import { buildWorkspacePath } from "../../utils/routeUtils";
import useAppMutation from "../base/useAppMutation";

export default function useCreateWorkspace(){

    const navigate = useNavigate()

    return useAppMutation({
        mutationFn: workspaceService.createWorkspace,
        onSuccess: (res) => {
            navigate(buildWorkspacePath(res.data?.slug))
        },
        apiErrorToast: false,
    })
}