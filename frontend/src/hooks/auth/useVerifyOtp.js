import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { showApiError } from "../../utils/toast";
import { getErrorCode, getErrorMsg } from "../../utils/errorHandler";
import { errorCodes } from "../../constants/errorCodes";


export function useVerifyOtp({ onError = null } = {}) {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    return useMutation({
        mutationFn: (data) => authService.verifyOTP(data),
        onSuccess: (res) => {
            sessionStorage.removeItem('verificationEmail')
            navigate('/auth/login', { state: { toast: "Email verified successfully, you can now login" }, replace: true })
        },
        onError: (error) => {
            onError?.()

            if (getErrorCode(error) === errorCodes.SIGNUP_SESSION_EXPIRED) {
                navigate('/auth/login', { state: { 
                    toast: "Signup session expired. Please sign up again.", error: true }, 
                    replace: true 
                })
            } else {
                showApiError(error)
            }
        }
    })

}