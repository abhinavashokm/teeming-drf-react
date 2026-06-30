import { subscriptionService } from '../../services/subscriptionService';
import useAppMutation from '../base/useAppMutation';

/**
 * Fetches the prorated amount due if the workspace upgrades to a given plan,
 * without actually charging anything. Used to populate the confirm modal.
 */
const usePreviewUpgrade = () => {
    return useAppMutation({
        mutationFn: subscriptionService.previewUpgrade,
        passWorkspaceSlug: true,
        apiSuccessToast: false,
    });
};

export default usePreviewUpgrade;