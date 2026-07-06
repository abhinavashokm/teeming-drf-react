import authService from "../../services/authService";
import useAppMutation from "../base/useAppMutation";
import useAuthSuccess from "./useAuthSuccess";


export default function useGoogleOAuth() {

    const handleAuthSuccess = useAuthSuccess()

    return useAppMutation({
        mutationFn: authService.googleLogin,
        onSuccess: (res) =>handleAuthSuccess(res.data),
        apiSuccessToast: false,
    })
}