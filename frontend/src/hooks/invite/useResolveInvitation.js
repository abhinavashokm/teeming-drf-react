
import { useQuery } from '@tanstack/react-query'
import { inviteService } from '../../services/inviteService'
import useInvitationToken from './useInvitationToken'


function useResolveInvitation() {

    const token = useInvitationToken()

    return useQuery({
        queryKey: ['resolveInvite', token],
        queryFn: async() => {
            const res = await inviteService.resolveInvite(token)
            return res.data
        },
        retry: false,
        enabled: !!token,
        
    })
}

export default useResolveInvitation