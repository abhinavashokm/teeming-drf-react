import { useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "../../constants/routePaths";
import authService from "../../services/authService";
import { clearAuth } from "../../store/slices/authSlice";
import useAppMutation from "../base/useAppMutation";


export default function useLogout() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    return useAppMutation({
        mutationFn: authService.logout,
        onSuccess: () => {
            dispatch(clearAuth())
            queryClient.clear() // removes ALL cached queries
            navigate(ROUTE_PATHS.LOGIN)
        },
        successMsg: "You have been logged out.",
    })
}

