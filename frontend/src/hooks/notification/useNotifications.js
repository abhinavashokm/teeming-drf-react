import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { notificationService } from '../../services/notificationService'
import useWorkspaceSlug from "../params/useWorkspaceSlug"
import useWorkspaceQueryKeys from "../helper/useWorkspaceQueryKeys"

function useNotifications() {

    const workspaceSlug = useWorkspaceSlug()
    const workspaceKeys = useWorkspaceQueryKeys()

    return useQuery({
        queryKey: workspaceKeys.notifications,
        queryFn: async () => {
            const res = await notificationService.fetchNotifications(workspaceSlug)

            return res.data
        },
    })
}

export default useNotifications