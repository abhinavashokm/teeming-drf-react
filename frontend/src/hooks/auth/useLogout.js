import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { clearAuth } from "../../store/slices/authSlice";
import authService from "../../services/authService";
import { showApiError, showSuccess } from "../../utils/toast";
import { useNavigate } from "react-router-dom";


export default function useLogout(){
    const dispatch = useDispatch()
    const navigate = useNavigate()

    return useMutation({
        mutationFn: async () => {
            await dispatch(clearAuth())
            authService.logout()
        },
        onSuccess: () => {
            //navigate('/auth/login/')
            showSuccess("You have been logged out.")
        },
        onError: (error) => showApiError(error)
    })
}