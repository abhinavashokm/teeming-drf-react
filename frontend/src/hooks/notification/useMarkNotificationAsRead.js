import { notificationService } from "../../services/notificationService"
import useAppMutation from "../base/useAppMutation"
import useWorkspaceQueryKeys from "../helper/useWorkspaceQueryKeys"

function useMarkNotificationAsRead() {

    const workspaceKeys = useWorkspaceQueryKeys()

    return useAppMutation({
        mutationFn: notificationService.markAsRead,
        passWorkspaceSlug: true,
        invalidateKeys: [workspaceKeys.notifications],
        apiSuccessToast: false,
    })
}

export default useMarkNotificationAsRead