import { useMutation } from "@tanstack/react-query";
import authService from "../../services/authService";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";


export function useSignup(){
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    return useMutation({
        mutationFn: (data) => authService.signup(data),
        onSuccess: (res) => {
            
            sessionStorage.setItem('verificationEmail', res.data.email)
            navigate('/auth/verify-otp')
        }
    })

}