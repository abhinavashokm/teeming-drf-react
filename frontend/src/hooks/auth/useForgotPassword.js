import { useMutation } from "@tanstack/react-query";
import authService from "../../services/authService";
import { getErrorMsg } from "../../utils/apiParser.js";
import { showApiError } from "../../utils/toast";
import { useNavigate } from "react-router-dom";


export function useForgotPassword() {
    const navigate = useNavigate()

    return useMutation({
        mutationFn: (data) => authService.forgotPassword(data),
        onSuccess: (res) => {
            navigate('/auth/reset-password-sent/', {
                state: { fromForgotPassword: true },
                replace: true
            })
        },
        onError: (error) => {
            showApiError(error)
        }
    })
}