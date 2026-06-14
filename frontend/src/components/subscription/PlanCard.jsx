import { Check, X } from 'lucide-react';
import { currencySymbols } from '../../constants/subscriptionConstants';
import useCreateCheckoutSession from '../../hooks/subscription/useCreateCheckoutSession';
import AppButton from "../../components/ui/buttons/AppButton"
import useWorkspace from '../../hooks/workspace/useWorkspace';


function PlanCard({ plan }) {

    const { data: currentWorkspace } = useWorkspace()

    const currentPlanCode =
        currentWorkspace?.subscription?.plan?.code

    const isCurrentPlan =
        currentPlanCode === plan.code


    const { mutate: createCheckoutSession, isPending } = useCreateCheckoutSession()

    const handleCreateCheckoutSession = () => {
        createCheckoutSession({ plan_id: plan.id })
    }

    return (
        <div
            className={`flex-1 min-w-[280px] snap-center bg-white rounded-xl relative flex flex-col border-2 shadow-md 
                ${isCurrentPlan
                    ? 'border-[#1A9E6E] ring-2 ring-[#1A9E6E]/10'
                    : 'border-gray-200'
                }

                `}
        >
            {/* Badge */}
            <div className="absolute -top-3 right-4 flex gap-2">

                {isCurrentPlan && (
                    <span className="bg-[#1A9E6E] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                        Current Plan
                    </span>
                )}

            </div>

            <div className="p-6 flex-1 flex flex-col">

                {/* Plan Header */}
                <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-[18px] font-bold text-gray-900">
                        {plan.name}
                    </h3>

                    {
                        plan.code === "PRO" && (
                            <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md uppercase">
                                Popular
                            </span>
                        )
                    }

                </div>

                {/* Price */}
                <div className="mb-6 h-[50px] flex flex-col justify-end">
                    <div className="flex items-end gap-1">
                        <span className="text-[36px] font-bold text-gray-900 leading-none">
                            {currencySymbols[plan.currency]}{plan.monthlyPrice}
                        </span>

                        <span className="text-[14px] text-gray-500 mb-1">
                            /month
                        </span>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                    <div className="border border-gray-200 rounded-lg p-2 text-center flex flex-col justify-center bg-gray-50/50">
                        <span className="text-[9px] text-gray-500 uppercase font-semibold mb-1 tracking-wider">
                            Members
                        </span>

                        <span className="text-[13px] font-bold text-gray-900 leading-none">
                            {plan.maxMembers ?? "Unlimited"}
                        </span>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-2 text-center flex flex-col justify-center bg-gray-50/50">
                        <span className="text-[9px] text-gray-500 uppercase font-semibold mb-1 tracking-wider">
                            Goals
                        </span>

                        <span className="text-[13px] font-bold text-gray-900 leading-none">
                            {plan.maxGoals ?? "Unlimited"}
                        </span>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-2 text-center flex flex-col justify-center bg-gray-50/50">
                        <span className="text-[9px] text-gray-500 uppercase font-semibold mb-1 tracking-wider">
                            Checks
                        </span>

                        <span className="text-[13px] font-bold text-gray-900 leading-none">
                            Unlimited
                        </span>
                    </div>
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

                {/* Button */}
                <div className="mt-8 pt-6 border-t border-gray-100">

                    {isCurrentPlan ? (
                        <AppButton
                            fullWidth
                            disabled
                            className="w-full py-2.5 px-4 rounded-lg font-medium text-[13px] bg-gray-100 text-gray-500 cursor-not-allowed"
                        >
                            Current Plan
                        </AppButton>
                    ) : (
                        <AppButton
                            fullWidth
                            loading={isPending}
                            onClick={handleCreateCheckoutSession}
                            className="w-full py-2.5 px-4 rounded-lg font-medium text-[13px] bg-[#1A9E6E] hover:bg-[#15825f] text-white shadow-sm"
                        >
                            {plan.tier < currentWorkspace.subscription.plan.tier ? `Downgrade to ${plan.name}` :
                                `Upgrade to ${plan.name}`}
                        </AppButton>
                    )}

                </div>

            </div>
        </div>
    )
}

export default PlanCard