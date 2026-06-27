import { useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { globalQueryKeys } from "../../../constants/queryKeys";
import authService from "../../../services/authService";
import { setAccessToken } from "../../../store/slices/authSlice";
import useAppMutation from "../../../hooks/base/useAppMutation";
import { showError } from "../../../utils/toast";


export function useAdminLogin() {

    const dispatch = useDispatch()
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    return useAppMutation({
        mutationFn: (data) => authService.login(data),
        onSuccess: (res) => {
            const user = res.data.user

            dispatch(setAccessToken(res.data.accessToken))
            console.log(res.data)
            if (!user.isStaff) {
                showError("You don't have admin access")
            } else {
                queryClient.setQueryData(globalQueryKeys.auth, res.data.user)  // ← set user directly to pass protect route
                navigate("/admin/dashboard/")
            }

        },
        onError: (err) => {
            console.log("error")
        },
        apiSuccessToast: false,
    })

}