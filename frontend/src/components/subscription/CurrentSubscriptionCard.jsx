import { AlertTriangle } from 'lucide-react';
import {
    currencySymbols,
    planCodes,
} from '../../constants/subscriptionConstants';
import { dateToHuman } from '../../utils/timeUtils';
import { cn } from '../../utils/cn';

function CurrentSubscriptionCard({
    subscription,
    className,
    onResumeSubscription,
}) {
    const isScheduledForDowngrade = subscription.cancelAtPeriodEnd;
    const isFreePlan = subscription.plan.code === planCodes.FREE;

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

                        {isScheduledForDowngrade ? (
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                                Ending Soon
                            </span>
                        ) : (
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                                Active
                            </span>
                        )}
                    </div>

                    {!isFreePlan && (
                        <p className="text-sm text-gray-500 mt-1">
                            {isScheduledForDowngrade
                                ? `Active until ${dateToHuman(
                                    subscription.expiresAt
                                )}`
                                : `Renews on ${dateToHuman(
                                    subscription.expiresAt
                                )}`}
                        </p>
                    )}
                </div>

                <div className="text-sm text-gray-500">
                    {currencySymbols[subscription.plan.currency]}
                    {subscription.plan.monthlyPrice}
                    /month
                </div>
            </div>

            {isScheduledForDowngrade && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <div className="flex gap-3">
                        <AlertTriangle
                            size={18}
                            className="text-amber-600 shrink-0 mt-0.5"
                        />

                        <div>
                            <p className="text-sm font-medium text-amber-900">
                                Subscription will not renew
                            </p>

                            <p className="text-sm text-amber-700 mt-1">
                                Your workspace will be moved to the Free plan
                                on{' '}
                                {dateToHuman(subscription.expiresAt)}.
                            </p>
                        </div>
                    </div>

                    {onResumeSubscription && (
                        <button
                            onClick={onResumeSubscription}
                            className="px-4 py-2 text-sm font-medium rounded-lg border border-amber-300 bg-white text-amber-800 hover:bg-amber-100 transition-colors"
                        >
                            Resume Subscription
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default CurrentSubscriptionCard;