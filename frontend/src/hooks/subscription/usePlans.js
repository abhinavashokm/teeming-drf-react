import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { subscriptionService } from '../../services/subscriptionService'
import { globalQueryKeys } from '../../constants/queryKeys'
import useWorkspaceSlug from '../params/useWorkspaceSlug'

function usePlans() {

    const workspaceSlug = useWorkspaceSlug()

    return useQuery({
        queryKey: globalQueryKeys.plans,
        queryFn: async () => {
            const resData = await subscriptionService.fetchPlans(workspaceSlug)
            return resData.data.plans
        },
    })
}

export default usePlans