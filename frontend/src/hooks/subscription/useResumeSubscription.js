import { subscriptionService } from '../../services/subscriptionService';
import useAppMutation from "../base/useAppMutation";
import useWorkspaceQueryKeys from '../helper/useWorkspaceQueryKeys';


const useResumeSubscription = () => {

    const workspaceKeys = useWorkspaceQueryKeys()

    return useAppMutation({
        mutationFn: subscriptionService.resumeSubscription,
        passWorkspaceSlug: true,
        invalidateKeys: [workspaceKeys.root],
    })
}

export default useResumeSubscription