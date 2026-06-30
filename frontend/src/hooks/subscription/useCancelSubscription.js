import { subscriptionService } from '../../services/subscriptionService';
import useAppMutation from "../base/useAppMutation";
import useWorkspaceQueryKeys from '../helper/useWorkspaceQueryKeys';


const useCancelSubscription = () => {

    const workspaceKeys = useWorkspaceQueryKeys()

    return useAppMutation({
        mutationFn: subscriptionService.cancelSubscription,
        passWorkspaceSlug: true,
        invalidateKeys: [workspaceKeys.root],
    })
}

export default useCancelSubscription