import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { errorCodes } from "../../constants/errorCodes";
import { ROUTE_PATHS } from "../../constants/routePaths.js";
import useInvitationToken from "../../hooks/invite/useInvitationToken";
import authService from "../../services/authService";
import { getErrorCode } from "../../utils/apiParser.js";
import { showApiError } from "../../utils/toast";
import useWelcomeBanner from "../invite/useWelcomeBanner.js";


export function useVerifyOtp({ onError = null } = {}) {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const invitationToken = useInvitationToken()
    const { setWelcome } = useWelcomeBanner()

    return useMutation({
        mutationFn: (data) => authService.verifyOTP(data, invitationToken),
        onSuccess: (res) => {

            sessionStorage.removeItem('verificationEmail')

            //if user joined a workspace using invite token, store workspace deatils for showing welcome banner
            if (res.data?.joinedWorkspace) {
                setWelcome(res.data.joinedWorkspace.slug)
            }

            navigate(ROUTE_PATHS.LOGIN, {
                state:
                    { toast: "Email verified successfully, you can now login" },
                replace: true
            })
        },
        onError: (error) => {
            onError?.()

            if (getErrorCode(error) === errorCodes.SIGNUP_SESSION_EXPIRED) {
                navigate(ROUTE_PATHS.LOGIN, {
                    state: {
                        toast: "Signup session expired. Please sign up again.", error: true
                    },
                    replace: true
                })
            } else {
                showApiError(error)
            }
        }
    })

}