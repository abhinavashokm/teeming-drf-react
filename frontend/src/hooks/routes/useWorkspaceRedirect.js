import { useNavigate } from "react-router-dom";
import { workspaceService } from "../../services/workspaceService";
import { getWorkspaceRedirectPath } from "../../utils/routeUtils";
import useAppMutation from "../base/useAppMutation";


export default function useWorkspaceRedirect(){
    const navigate = useNavigate()

    return useAppMutation({
        mutationFn: workspaceService.fetchmyMemberships,
        onSuccess: (res) => {
            navigate(getWorkspaceRedirectPath(res.data))
        },
        apiSuccessToast: false,
        onError: (err) => {
            console.log(err)
        }
    })
}