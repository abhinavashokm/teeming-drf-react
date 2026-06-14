import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { subscriptionService } from '../../services/subscriptionService'
import { globalQueryKeys } from '../../constants/queryKeys'
import useWorkspaceSlug from '../params/useWorkspaceSlug'
import useWorkspaceQueryKeys from "../helper/useWorkspaceQueryKeys"

function useCurrentPlan() {

    const workspaceSlug = useWorkspaceSlug()
    const workspaceKeys = useWorkspaceQueryKeys()

    return useQuery({
        queryKey: globalQueryKeys.plans,
        queryFn: async () => {
            const resData = await subscriptionService.fetchCurrentPlan(workspaceSlug)
            return resData.data
        },
    })
}

export default useCurrentPlan