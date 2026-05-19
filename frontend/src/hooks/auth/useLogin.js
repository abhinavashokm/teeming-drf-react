import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { showApiError } from "../../utils/toast";
import { setAccessToken, setUser } from "../../store/slices/authSlice";
import useWorkspaceRedirect from "../workspace/useWorkspaceRedirect";


export function useLogin(){

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const redirectToWorkspace = useWorkspaceRedirect()

    return useMutation({
        mutationFn: ({email, password}) => authService.login({email, password}),
        onSuccess: async(res) => {
            dispatch(setUser(res.data.user))
            dispatch(setAccessToken(res.data.accessToken))
            //navigate('/')
            await redirectToWorkspace()
        }
    })

}