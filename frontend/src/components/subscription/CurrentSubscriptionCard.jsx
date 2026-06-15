import { currencySymbols, planCodes } from '../../constants/subscriptionConstants'
import { dateToHuman } from '../../utils/timeUtils'
import { cn } from '../../utils/cn'

function CurrentSubscriptionCard({ subscription, className }) {
    return (

        <div
            className={cn(
                "bg-white border border-gray-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
                className
            )}
        >
            <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                    Current Subscription
                </p>

                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {subscription.plan.name} Plan
                    </h2>

                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                        {subscription.status}
                    </span>
                </div>

                {
                    subscription.plan.code !== planCodes.FREE &&
                    <p className="text-sm text-gray-500 mt-1">
                        Renews on {dateToHuman(subscription.expiresAt)}
                    </p>
                }

            </div>

            <div className="text-sm text-gray-500">
                {currencySymbols[subscription.plan.currency]}{subscription.plan.monthlyPrice}/month
            </div>

        </div>

    )
}

export default CurrentSubscriptionCard