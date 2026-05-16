import { useMutation, useQuery } from "@tanstack/react-query";
import authService from "../../services/authService";
import { useDispatch } from "react-redux";


export default function useInitializeAuth() {
    const dispatch = useDispatch()

    return useQuery({
        queryKey: ['auth'],
        queryFn: async () => {
            const refreshRes = await authService.refresh()
            dispatch(setAccessToken(refreshRes.data.accessToken))
            const userRes = await authService.getCurrentUser()
            dispatch(setUser(userRes.data.user))
            return userRes.data.user
        },
        retry: false // don't retry on 401
    })
} 