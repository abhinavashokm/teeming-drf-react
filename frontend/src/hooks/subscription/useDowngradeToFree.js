import { subscriptionService } from '../../services/subscriptionService';
import useAppMutation from "../base/useAppMutation";
import useWorkspaceQueryKeys from '../helper/useWorkspaceQueryKeys';


const useDowngradeToFree = () => {

    const workspaceKeys = useWorkspaceQueryKeys()

    return useAppMutation({
        mutationFn: subscriptionService.downgradeToFree,
        passWorkspaceSlug: true,
        invalidateKeys: [workspaceKeys.root],
    })
}

export default useDowngradeToFree