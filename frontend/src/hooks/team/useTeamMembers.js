import { useQuery } from '@tanstack/react-query'
import React from 'react'
import useWorkspaceSlug from '../workspace/useWorkspaceSlug'
import { teamService } from '../../services/teamService'
import { sortCurrentUserToFirst } from '../../utils/workspaceUtils'
import useAuth from '../auth/useAuth'
import useWorkspaceQueryKeys from '../helper/useWorkspaceQueryKeys'

function useTeamMembers() {

    const workspaceSlug = useWorkspaceSlug()
    const { data: currentUser } = useAuth()

    const workspaceKeys = useWorkspaceQueryKeys()

    return useQuery({
        queryKey: workspaceKeys.members,
        'queryFn': async () => {
            const resData = await teamService.fetchTeamMembers(workspaceSlug)
            return sortCurrentUserToFirst(resData.data.members, currentUser)
        }
    })
}

export default useTeamMembers