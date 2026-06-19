import { useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import authService from "../../services/authService";
import { setAccessToken } from "../../store/slices/authSlice";
import useAppMutation from "../base/useAppMutation";
import useInvitationToken from "../invite/useInvitationToken";
import useWorkspaceRedirect from "../routes/useWorkspaceRedirect";
import useWelcomeBanner from "../invite/useWelcomeBanner";
import { globalQueryKeys } from "../../constants/queryKeys";
import { useNavigate } from "react-router-dom";
import { buildWorkspacePath } from "../../utils/routeUtils";


export function useLogin() {

    const dispatch = useDispatch()
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const { mutate: redirectToWorkspace } = useWorkspaceRedirect()
    const invitationToken = useInvitationToken()
    const { setWelcome } = useWelcomeBanner()

    return useAppMutation({
        mutationFn: (data) => authService.login(data, invitationToken),
        onSuccess: (res) => {
            dispatch(setAccessToken(res.data.accessToken))

            queryClient.setQueryData(globalQueryKeys.auth, res.data.user)  // ← set user directly to pass protect route

            //if user joined a workspace using invite token, store workspace deatils for showing welcome banner
            if (res.data?.joinedWorkspace) {
                setWelcome(res.data.joinedWorkspace.slug, res.data.user.id)
            }

            if(res.data.user?.lastWorkspace){
                navigate(buildWorkspacePath(res.data.user.lastWorkspace.slug))
            }else{
                redirectToWorkspace()
            }
            
        },
        apiSuccessToast: false,
         
    })
}