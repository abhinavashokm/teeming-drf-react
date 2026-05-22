import { useMutation } from "@tanstack/react-query";
import authService from "../../services/authService";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";


export function useSignup() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')

    return useMutation({
        mutationFn: (data) => authService.signup(data),
        onSuccess: (res) => {

            sessionStorage.setItem('verificationEmail', res.data.email)
            if(token){
                navigate(`/auth/verify-otp?token=${token}`)
            }else{
                navigate('/auth/verify-otp')
            }
        }
    })

}