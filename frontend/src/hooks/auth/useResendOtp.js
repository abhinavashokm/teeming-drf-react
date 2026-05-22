import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { showApiError, showSuccess } from "../../utils/toast";


export function useResendOtp() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    return useMutation({
        mutationFn: (data) => authService.resendOTP(data),
        onSuccess: (res) => {
            showSuccess("OTP resent successfully")
        },
        onError: (error) => {
            showApiError(error)
        }
    })

}