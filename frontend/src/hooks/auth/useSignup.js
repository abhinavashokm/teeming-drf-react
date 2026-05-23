import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import useInvitationToken from "../invite/useInvitationToken";


export function useSignup() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    const invitationToken = useInvitationToken()

    return useMutation({
        mutationFn: (data) => authService.signup(data),
        onSuccess: (res) => {

            sessionStorage.setItem('verificationEmail', res.data.email)

            if(invitationToken){
                navigate(`/auth/verify-otp?token=${invitationToken}`)
            }else{
                navigate('/auth/verify-otp')
            }
            
        }
    })

}