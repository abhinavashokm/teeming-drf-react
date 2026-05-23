import { useMutation, useQuery } from "@tanstack/react-query";
import authService from "../../services/authService";
import { useDispatch } from "react-redux";
import { setAccessToken } from "../../store/slices/authSlice";


export default function useAuth() {
    const dispatch = useDispatch()

    return useQuery({
        queryKey: ['auth'],
        queryFn: async () => {
            console.log("useauth aane..")
            const refreshRes = await authService.refresh()
            dispatch(setAccessToken(refreshRes?.data?.accessToken))
            const userRes = await authService.getCurrentUser()
            // dispatch(setUser(userRes.data.user))
            return userRes.data.user
        },
        retry: false, // don't retry on 401
        staleTime: Infinity
    })
} 