import { useState } from 'react';
import {
    currencySymbols,
    planCodes,
} from '../../constants/subscriptionConstants';
import { formatDate } from '../../utils/timeUtils';
import { cn } from '../../utils/cn';
import DangerConfirmationModal from '../ui/modal/DangerConfirmationModal';
import useCancelSubscription from '../../hooks/subscription/useCancelSubscription';
import useResumeSubscription from '../../hooks/subscription/useResumeSubscription';

function CurrentSubscriptionCard({
    subscription,
    className,
}) {
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

    const { mutate: downgradeToFree, isPending: isCancelling } =
        useCancelSubscription();

    const scheduledPlan = subscription.scheduledPlan;

    const hasScheduledChange = !!scheduledPlan;

    const isFreePlan =
        subscription.plan.code === planCodes.FREE;

    const canCancel = !isFreePlan && !hasScheduledChange;

    const handleConfirmCancel = () => {
        downgradeToFree(undefined, {
            onSettled: () => {
                setIsCancelModalOpen(false);
            },
        });
    };

    const { mutate: resumeCurrentSubscription, isPending: loadingResumeSubscription } = useResumeSubscription()

    const handleResumeCurrentSubscritpion = () => {
        resumeCurrentSubscription()
    }

    return (
        <div
            className={cn(
                'bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-4',
                className
            )}
        >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                        Current Subscription
                    </p>

                    <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-lg font-semibold text-gray-900">
                            {subscription.plan.name} Plan
                        </h2>

                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                            Active
                        </span>
                    </div>

                    {!isFreePlan && (
                        <p className="text-sm text-gray-500 mt-1">
                            Current billing period ends on{" "}
                            {formatDate(subscription.expiresAt)}
                        </p>
                    )}

                </div>

                <div className="flex flex-col items-start sm:items-end gap-2">
                    <div className="text-sm text-gray-500 ">
                        {currencySymbols[subscription.plan.currency]}
                        {subscription.plan.monthlyPrice}
                        /month
                    </div>

                    {canCancel && (
                        <button
                            onClick={() => setIsCancelModalOpen(true)}
                            className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-red-600 hover:border-red-200 transition-colors"
                        >
                            Cancel Subscription
                        </button>
                    )}
                    {scheduledPlan && (
                        <button
                            onClick={handleResumeCurrentSubscritpion}
                            className="px-3 py-1.5 text-sm font-medium rounded-lg border border-blue-300 bg-white text-blue-700 hover:bg-blue-100 transition-colors"
                        >
                            {loadingResumeSubscription ? "Resuming.." : "Resume Subscription"}
                            
                            {/* Keep {subscription.plan.name} */}
                        </button>
                    )}
                </div>
            </div>

            {hasScheduledChange && (
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">

                    <div className="flex items-start gap-3">

                        <div className="mt-1 h-2 w-2 rounded-full bg-blue-500 shrink-0" />

                        <div className="flex-1">

                            <p className="text-sm font-semibold text-blue-900">
                                Scheduled Change
                            </p>

                            <p className="text-sm text-blue-700 mt-1">
                                <span className="font-medium">
                                    {scheduledPlan.name} Plan
                                </span>{" "}
                                will become active on{" "}
                                {formatDate(subscription.expiresAt)}.
                            </p>

                        </div>

                    </div>

                </div>
            )}

            <DangerConfirmationModal
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                onConfirm={handleConfirmCancel}
                title="Cancel Subscription"
                description={
                    `Your monthly auto-renewal will be turned off. You'll continue to have full access to the ${subscription.plan.name} plan until your current billing period ends on ${formatDate(subscription.expiresAt)}, after which your workspace will move to the Free plan.`
                }
                confirmButtonText="Cancel Subscription"
                confirmButtonTextOnLoading="Canceling.."
                isLoading={isCancelling}
            />
        </div>
    );
}

export default CurrentSubscriptionCard;