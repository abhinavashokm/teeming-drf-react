import { subscriptionService } from '../../services/subscriptionService';
import useAppMutation from "../base/useAppMutation";


const useCreateCheckoutSession = () => {
    return useAppMutation({
        mutationFn: subscriptionService.createCheckoutSession,
        passWorkspaceSlug: true,
        onSuccess: async (res) => {
            window.location.assign(res.data.checkoutUrl);
        },
        apiSuccessToast: false,
    })
}

export default useCreateCheckoutSession