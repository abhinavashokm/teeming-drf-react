import { useMutation } from "@tanstack/react-query";
import authService from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { showApiError } from "../../utils/toast";
import { getErrorMsg } from "../../utils/apiParser.js";


export function useResetPassword() {
    const navigate = useNavigate()

    return useMutation({
        mutationFn: (data) => authService.resetPassword(data),
        onSuccess: () => {
            navigate("/auth/reset-password-success/", {
                state: { fromResetPassword: true },
                replace: true
            })
        },
        onError: (error) => {
            showApiError(error)
        }
    })
}