import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { clearAuth } from "../../store/slices/authSlice";
import authService from "../../services/authService";
import { showApiError, showSuccess } from "../../utils/toast";
import { useNavigate } from "react-router-dom";


export default function useLogout() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: () => authService.logout(),
        onSuccess: () => {
            dispatch(clearAuth())
            queryClient.clear() // removes ALL cached queries
            navigate('/auth/login')
            showSuccess("You have been logged out.")
        },
        onError: (error) => showApiError(error)
    })
}