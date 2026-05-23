import { useSearchParams } from "react-router-dom"


export default function useInvitationToken() {
    const [searchParams] = useSearchParams()
    return searchParams.get('token') 
}