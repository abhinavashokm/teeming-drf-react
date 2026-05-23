import { useMutation } from "@tanstack/react-query";
import { workspaceService } from "../../services/workspaceService";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { buildWorkspacePath } from "../../utils/routeUtils";

export default function useCreateWorkspace(){
    const dispatch = useDispatch()
    const navigate = useNavigate()

    return useMutation({
        'mutationFn': (data) => workspaceService.createWorkspace(data),
        'onSuccess': (res) => {
            //dispatch(setCurrentWorkspace(res.data))
            navigate(buildWorkspacePath(res.data?.slug))
        }
    })
}