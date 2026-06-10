import React from 'react'
import useAppMutation from '../base/useAppMutation'
import { notificationService } from '../../services/notificationService'
import useWorkspaceQueryKeys from '../helper/useWorkspaceQueryKeys'

function useClearAllNotifications() {

    const workspaceKeys = useWorkspaceQueryKeys()

    return useAppMutation({
        mutationFn: notificationService.clearAll,
        passWorkspaceSlug: true,
        invalidateKeys: [workspaceKeys.notifications],
        apiSuccessToast: false,
    })
}

export default useClearAllNotifications