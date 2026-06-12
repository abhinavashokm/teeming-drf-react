import { useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { errorCodes } from "../../constants/errorCodes";
import { ROUTE_PATHS } from "../../constants/routePaths.js";
import useInvitationToken from "../../hooks/invite/useInvitationToken";
import authService from "../../services/authService";
import { setAccessToken } from "../../store/slices/authSlice";
import { getErrorCode } from "../../utils/apiParser.js";
import { showApiError } from "../../utils/toast";
import useAppMutation from "../base/useAppMutation.js";
import useWelcomeBanner from "../invite/useWelcomeBanner.js";
import useWorkspaceRedirect from "../routes/useWorkspaceRedirect.js";
import { globalQueryKeys } from "../../constants/queryKeys";


export function useVerifyOtp({ onError = null } = {}) {
    const dispatch = useDispatch()
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const invitationToken = useInvitationToken()
    const { setWelcome } = useWelcomeBanner()

    const { mutate: redirectToWorkspace } = useWorkspaceRedirect()

    return useAppMutation({
        mutationFn: (data) => authService.verifyOTP(data, invitationToken),
        onSuccess: (res) => {

            sessionStorage.removeItem('verificationEmail')

             dispatch(setAccessToken(res.data.accessToken));
             queryClient.setQueryData(globalQueryKeys.auth, res.data.user);


            //if user joined a workspace using invite token, store workspace deatils for showing welcome banner
            if (res.data?.joinedWorkspace) {
                setWelcome(res.data.joinedWorkspace.slug, res.data.user.id)
            }

            redirectToWorkspace();

        },
        onError: (error) => {

            console.log(error)

            onError?.()

            if (getErrorCode(error) === errorCodes.SIGNUP_SESSION_EXPIRED) {
                navigateWithToast({
                    path: ROUTE_PATHS.LOGIN,
                    message: "Signup session expired. Please sign up again.",
                    error: true,
                    replace: true,
                })
            } else {
                showApiError(error)
            }
        }
    })

}