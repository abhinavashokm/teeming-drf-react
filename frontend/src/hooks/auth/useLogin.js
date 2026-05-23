import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { showApiSuccess } from "../../utils/toast";
import { setAccessToken } from "../../store/slices/authSlice";
import useWorkspaceRedirect from "../workspace/useWorkspaceRedirect";
import useInvitationToken from "../invite/useInvitationToken";


export function useLogin() {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const redirectToWorkspace = useWorkspaceRedirect()

    const invitationToken = useInvitationToken()

    return useMutation({
        mutationFn: (data) => authService.login(data, invitationToken),
        onSuccess: async (res) => {

            //dispatch(setUser(res.data.user))
            dispatch(setAccessToken(res.data.accessToken))

            //navigate('/')
            await redirectToWorkspace()
            showApiSuccess(res)
        }
    })

}