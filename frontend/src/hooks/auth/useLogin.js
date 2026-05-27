import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { showApiSuccess } from "../../utils/toast";
import { setAccessToken } from "../../store/slices/authSlice";
import useWorkspaceRedirect from "../api/useWorkspaceRedirect";
import useInvitationToken from "../invite/useInvitationToken";


export function useLogin() {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { mutate: redirectToWorkspace } = useWorkspaceRedirect()

    const invitationToken = useInvitationToken()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data) => authService.login(data, invitationToken),
        onSuccess: async (res) => {

            dispatch(setAccessToken(res.data.accessToken))

            queryClient.setQueryData(['auth'], res.data.user)  // ← set user directly to pass protect route

            redirectToWorkspace()
            showApiSuccess(res)
        }
    })

}