import { errorCodes } from "../../constants/errorCodes";
import { ROUTE_PATHS } from "../../constants/routePaths.js";
import useInvitationToken from "../../hooks/invite/useInvitationToken";
import authService from "../../services/authService";
import { getErrorCode } from "../../utils/apiParser.js";
import { showApiError } from "../../utils/toast.js";
import useAppMutation from "../base/useAppMutation.js";
import useNavigateWithToast from "../routes/useNavigateWithToast.js";
import useAuthSuccess from "./useAuthSuccess.js";


export function useVerifyOtp({ onError = null } = {}) {

    const navigateWithToast = useNavigateWithToast()
    const invitationToken = useInvitationToken()
    const handleAuthSuccess = useAuthSuccess()

    return useAppMutation({
        mutationFn: (data) => authService.verifyOTP(data, invitationToken),
        onSuccess: (res) => {
            sessionStorage.removeItem('verificationEmail')
            handleAuthSuccess(res.data)
        },
        onError: (error) => {
            console.log(error)
            onError?.()
            if (getErrorCode(error) === errorCodes.SIGNUP_SESSION_EXPIRED) {
                navigateWithToast({
                    path: ROUTE_PATHS.SIGNUP,
                    message: "Signup session expired. Please sign up again.",
                    error: true,
                    replace: true,
                })
            } else {
                showApiError(error)
            }
        },
        apiErrorToast: false
    })

}