import authService from "../../services/authService";
import useAppMutation from "../base/useAppMutation";
import useInvitationToken from "../invite/useInvitationToken";
import useAuthSuccess from "./useAuthSuccess";


export function useLogin() {

    const invitationToken = useInvitationToken()
    const handleAuthSuccess = useAuthSuccess()

    return useAppMutation({
        mutationFn: (data) => authService.login(data, invitationToken),
        onSuccess: (res) => handleAuthSuccess(res.data),
        apiSuccessToast: false,
        onError: (err) => {
            console.log(err)
        }
    })
}