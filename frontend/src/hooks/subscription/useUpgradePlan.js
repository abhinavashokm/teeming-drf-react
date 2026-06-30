import { subscriptionService } from '../../services/subscriptionService';
import useAppMutation from '../base/useAppMutation';
import useWorkspaceQueryKeys from '../helper/useWorkspaceQueryKeys';

/**
 * Confirms the upgrade — switches the Stripe subscription's price and
 * charges the prorated difference immediately on the saved payment method.
 */
const useUpgradePlan = () => {
    const workspaceKeys = useWorkspaceQueryKeys();

    return useAppMutation({
        mutationFn: subscriptionService.upgradePlan,
        passWorkspaceSlug: true,
        invalidateKeys: [workspaceKeys.root],
    });
};

export default useUpgradePlan;