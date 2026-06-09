import { notificationService } from "../../services/notificationService"
import useAppMutation from "../base/useAppMutation"
import useWorkspaceQueryKeys from "../helper/useWorkspaceQueryKeys"

function useMarkAllNotificationAsRead() {

    const workspaceKeys = useWorkspaceQueryKeys()

    return useAppMutation({
        mutationFn: notificationService.markAllAsRead,
        passWorkspaceSlug: true,
        invalidateKeys: [workspaceKeys.notifications],
    })
}

export default useMarkAllNotificationAsRead