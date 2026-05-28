import { useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import authService from "../../services/authService";
import { setAccessToken } from "../../store/slices/authSlice";
import useAppMutation from "../base/useAppMutation";
import useInvitationToken from "../invite/useInvitationToken";
import useWorkspaceRedirect from "../routes/useWorkspaceRedirect";


export function useLogin(){

    const dispatch = useDispatch()
    const queryClient = useQueryClient()

    const { mutate: redirectToWorkspace } = useWorkspaceRedirect()
    const invitationToken = useInvitationToken()

    return useAppMutation({
        mutationFn: (data) => authService.login(data, invitationToken),
        onSuccess: (res) => {
            dispatch(setAccessToken(res.data.accessToken))

            queryClient.setQueryData(['auth'], res.data.user)  // ← set user directly to pass protect route

            redirectToWorkspace()
        }
    })
}