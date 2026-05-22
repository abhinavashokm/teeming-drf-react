import { useSearchParams } from "react-router-dom"


export default function useInviteToken() {
    const [searchParams] = useSearchParams()
    return searchParams.get('token') 
}