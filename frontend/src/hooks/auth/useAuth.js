import { useMutation, useQuery } from "@tanstack/react-query";
import authService from "../../services/authService";
import { useDispatch } from "react-redux";
import { setAccessToken } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import ErrorPage from "../../pages/error/ErrorPage";


export default function useAuth(caller) {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    return useQuery({
        queryKey: ['auth'],
        queryFn: async () => {
            try {
                const refreshRes = await authService.refresh()
                dispatch(setAccessToken(refreshRes?.data?.accessToken))
                const userRes = await authService.getCurrentUser()

                return userRes.data.user
            } catch (error) {
                return null
            }
        },

        retry: false, // don't retry on 401
        staleTime: Infinity,
        refetchOnWindowFocus: false,  // ← add this
        refetchOnMount: false,        // ← add this
        refetchOnReconnect: false,    // ← add this
    })
} 