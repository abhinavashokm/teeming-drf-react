import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { showApiError } from "../../utils/toast";
import { setAccessToken, setUser } from "../../store/slices/authSlice";


export function useLogin(){

    const dispatch = useDispatch()
    const navigate = useNavigate()

    return useMutation({
        mutationFn: ({email, password}) => authService.login({email, password}),
        onSuccess: (res) => {
            dispatch(setUser(res.data.user))
            dispatch(setAccessToken(res.data.accessToken))
            navigate('/')
        }
    })

}