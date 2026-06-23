import { Check, X } from 'lucide-react';
import { currencySymbols, planCodes } from '../../constants/subscriptionConstants';
import useCreateCheckoutSession from '../../hooks/subscription/useCreateCheckoutSession';
import AppButton from "../../components/ui/buttons/AppButton"
import useWorkspace from '../../hooks/workspace/useWorkspace';
import useDowngradeToFree from '../../hooks/subscription/useDowngradeToFree';
import useResumeSubscription from '../../hooks/subscription/useResumeSubscription';


function PlanCard({ plan, loading }) {

    const { data: currentWorkspace } = useWorkspace()

    const currentSubscription =
        currentWorkspace?.subscription;

    const currentPlan =
        currentSubscription?.plan;

    const scheduledPlan =
        currentSubscription?.scheduledPlan;

    const isCurrentPlan =
        currentPlan?.code === plan?.code;

    const isScheduledPlan =
        scheduledPlan?.code === plan?.code;

    const hasPendingChange =
        !!scheduledPlan;

    const isDisabled = (plan?.tier < currentPlan?.tier) && plan?.code !== planCodes.FREE;

    const { mutate: createCheckoutSession, isPending } = useCreateCheckoutSession()

    const handleCreateCheckoutSession = () => {
        if (plan?.code === 'FREE') {
            return handleDowngradeToFree()
        }

        createCheckoutSession({ plan_id: plan?.id })
    }

    const { mutate: downgradeToFree, isPending: loadingDowngradeToFree } = useDowngradeToFree()
    const { mutate: resumeCurrentSubscription, isPending: loadingResumeSubscription } = useResumeSubscription()

    const handleDowngradeToFree = () => {
        downgradeToFree()
    }

    const handleResumeCurrentSubscritpion = () => {
        resumeCurrentSubscription()
    }

    if (loading) {
        return <PlanCardSkeleton />
    }

    return (
        <div
            className={`
    w-full
    lg:flex-1 lg:min-w-[280px]
    lg:snap-center
    bg-white rounded-xl relative flex flex-col border-2 shadow-md

    ${isCurrentPlan
                    ? 'border-[#1A9E6E] ring-2 ring-[#1A9E6E]/10'
                    : isScheduledPlan
                        ? 'border-amber-400 ring-2 ring-amber-100'
                        : 'border-gray-200'
                }
    `}
        >
            {/* Badge */}
            <div className="absolute -top-3 right-4">

                {isCurrentPlan && (
                    <span className="bg-[#1A9E6E] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                        Current
                    </span>
                )}

                {isScheduledPlan && (
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        Scheduled
                    </span>
                )}

            </div>

            <div className="p-6 flex-1 flex flex-col">

                {/* Plan Header */}
                <div className="flex items-center gap-2 mb-2 md:mb-4">
                    <h3 className="text-[18px] font-bold text-gray-900">
                        {plan.name}
                    </h3>

                    {
                        plan?.code === "PRO" && (
                            <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md uppercase">
                                Popular
                            </span>
                        )
                    }

                </div>

                {/* Price */}
                <div className="mb-6 h-[50px] flex flex-col justify-end">
                    <div className="flex items-end gap-1">
                        <span className="text-[28px] sm:text-[32px] lg:text-[36px] font-bold text-gray-900 leading-none">
                            {currencySymbols[plan.currency]}{plan.monthlyPrice}
                        </span>

                        <span className="text-[12px] sm:text-[13px] lg:text-[14px] text-gray-500 mb-1">
                            /month
                        </span>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 mb-6">
                    <div className="border border-gray-200 rounded-lg p-2 text-center flex flex-col justify-center bg-gray-50/50">
                        <span className="text-[9px] text-gray-500 uppercase font-semibold mb-1 tracking-wider">
                            Members
                        </span>

                        <span className="text-[13px] font-bold text-gray-900 leading-none">
                            {plan.maxMembers ?? (
                                <>
                                    <span className="sm:hidden">∞</span>
                                    <span className="hidden sm:inline">Unlimited</span>
                                </>
                            )}
                        </span>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-2 text-center flex flex-col justify-center bg-gray-50/50">
                        <span className="text-[9px] text-gray-500 uppercase font-semibold mb-1 tracking-wider">
                            Goals
                        </span>

                        <span className="text-[13px] font-bold text-gray-900 leading-none">
                            {plan.maxGoals ?? (
                                <>
                                    <span className="sm:hidden">∞</span>
                                    <span className="hidden sm:inline">Unlimited</span>
                                </>
                            )}
                        </span>
                    </div>

                    {/* <div className="border border-gray-200 rounded-lg p-2 text-center flex flex-col justify-center bg-gray-50/50">
                        <span className="text-[9px] text-gray-500 uppercase font-semibold mb-1 tracking-wider">
                            Checks
                        </span>

                        <span className="text-[13px] font-bold text-gray-900 leading-none">
                            <span className="sm:hidden">∞</span>
                            <span className="hidden sm:inline">Unlimited</span>
                        </span>
                    </div> */}
                </div>

                {/* Features */}
                <div className="flex-1">
                    <ul className="space-y-3.5">
                        {plan.features.map((feature) => (
                            <li
                                key={feature.key}
                                className="flex items-start gap-2.5"
                            >
                                {feature.enabled ? (
                                    <>
                                        <div className="mt-[3px] shrink-0 bg-[#1A9E6E]/10 rounded-full p-0.5">
                                            <Check
                                                className="w-3 h-3 text-[#1A9E6E]"
                                                strokeWidth={3}
                                            />
                                        </div>

                                        <span className="text-[13px] leading-snug text-gray-700 font-medium">
                                            {feature.name}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <div className="mt-[3px] shrink-0">
                                            <X
                                                className="w-4 h-4 text-gray-300"
                                                strokeWidth={2.5}
                                            />
                                        </div>

                                        <span className="text-[13px] leading-snug text-gray-400 line-through">
                                            {feature.name}
                                        </span>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                {isCurrentPlan && hasPendingChange && (
                    <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
                        <p className="text-xs text-blue-700">
                            A plan change has been scheduled.
                        </p>
                    </div>
                )}

                {isScheduledPlan && (
                    <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
                        <p className="text-xs text-amber-800">
                            This plan will become active when your current billing period ends.
                        </p>
                    </div>
                )}

                {/* Button */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                    {isCurrentPlan ? (

                        hasPendingChange ? (
                            <AppButton
                                fullWidth
                                onClick={handleResumeCurrentSubscritpion}
                                loading={loadingResumeSubscription}
                                className="w-full py-2.5 px-4 rounded-lg font-medium text-[13px]"
                            >
                                Keep {plan.name}
                            </AppButton>
                        ) : (
                            <AppButton
                                fullWidth
                                disabled
                                className="w-full py-2.5 px-4 rounded-lg font-medium text-[13px] bg-gray-100 text-gray-500"
                            >
                                Current Plan
                            </AppButton>
                        )

                    ) : isScheduledPlan ? (

                        <AppButton
                            fullWidth
                            disabled
                            className="w-full py-2.5 px-4 rounded-lg font-medium text-[13px] bg-amber-50 text-amber-700 border border-amber-200"
                        >
                            Scheduled
                        </AppButton>

                    ) : (
                        
                        <span title={isDisabled ? "Only downgrade possible after current plan ends" : undefined}>
                            <AppButton
                                fullWidth
                                disabled={isDisabled}
                                loading={isPending || loadingDowngradeToFree}
                                onClick={handleCreateCheckoutSession}
                                className="w-full py-2.5 px-4 rounded-lg font-medium text-[13px] bg-[#1A9E6E] hover:bg-[#15825f] text-white"
                            >
                                {hasPendingChange
                                    ? `Switch to ${plan.name}`
                                    : plan.tier < currentPlan.tier
                                        ? `Downgrade to ${plan.name}`
                                        : `Upgrade to ${plan.name}`
                                }
                            </AppButton>
                        </span>

                    )}

                </div>

            </div>
        </div>
    )
}

export default PlanCard


function PlanCardSkeleton() {
    return (
        <div className="w-full lg:flex-1 lg:min-w-[280px] lg:snap-center bg-white rounded-xl relative flex flex-col border-2 border-gray-200 shadow-lg animate-pulse">
            <div className="p-6 flex flex-col h-full">

                {/* Header */}
                <div className="flex items-center gap-2 mb-4">
                    <div className="h-6 w-24 rounded bg-gray-200" />
                    <div className="h-5 w-16 rounded-md bg-gray-100" />
                </div>

                {/* Price */}
                <div className="mb-6 h-[50px] flex items-end gap-2">
                    <div className="h-10 w-24 rounded bg-gray-200" />
                    <div className="h-4 w-16 rounded bg-gray-100 mb-1" />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="border border-gray-200 rounded-lg p-2 bg-gray-50"
                        >
                            <div className="h-3 w-12 mx-auto rounded bg-gray-100 mb-2" />
                            <div className="h-4 w-10 mx-auto rounded bg-gray-200" />
                        </div>
                    ))}
                </div>

                {/* Features */}
                <div className="flex-1">
                    <ul className="space-y-3.5">
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <li
                                key={item}
                                className="flex items-center gap-3"
                            >
                                <div className="w-4 h-4 rounded-full bg-gray-200 shrink-0" />
                                <div
                                    className={`h-4 rounded bg-gray-200 ${item % 2 === 0
                                        ? "w-40"
                                        : "w-32"
                                        }`}
                                />
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Button */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                    <div className="h-10 w-full rounded-lg bg-gray-200" />
                </div>

            </div>
        </div>
    );
}