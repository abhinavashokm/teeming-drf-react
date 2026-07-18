import { errorCodes } from "../../constants/errorCodes";
import { ROUTE_PATHS } from "../../constants/routePaths";
import authService from "../../services/authService";
import { getErrorCode } from "../../utils/apiParser";
import { showApiError, showSuccess } from "../../utils/toast";
import useAppMutation from "../base/useAppMutation";
import useNavigateWithToast from "../routes/useNavigateWithToast";


export function useResendOtp() {

    const navigateWithToast = useNavigateWithToast()

    return useAppMutation({
        mutationFn: authService.resendOTP,
        onError: (error) => {
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
        showApiError: false,
    })

}