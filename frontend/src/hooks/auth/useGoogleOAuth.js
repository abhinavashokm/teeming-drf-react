import { useMutation } from "@tanstack/react-query";
import authService from "../../services/authService";
import { useDispatch } from "react-redux";
import { setAccessToken, setUser } from "../../store/slices/authSlice";
import { showApiError, showSuccess } from "../../utils/toast";
import { useNavigate } from "react-router-dom";


export default function useGoogleOAuth() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    return useMutation({
        mutationFn: async (data) => authService.googleLogin(data),
    
        onSuccess: (userRes) => {

            dispatch(setUser(userRes.data.user))
            dispatch(setAccessToken(userRes.data.accessToken))
            showSuccess("Google sign-in successful")
            navigate("/", { replace: true })

        },
        onError: (error) => {
            showApiError(error)
        }
    })
}