import { useQuery } from "@tanstack/react-query";
import authService from "../../services/authService";


export function useValidateResetToken(data) {
    return useQuery({
        queryKey: ['verify_reset_token', data],
        queryFn: () => authService.validateResetToken(data),
        retry: false,
        enabled: !!data  // only run if token exists
    })
}