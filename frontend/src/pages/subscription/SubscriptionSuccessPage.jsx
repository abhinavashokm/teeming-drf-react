import { CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import AppButton from "../../components/ui/buttons/AppButton";
import useWorkspace from "../../hooks/workspace/useWorkspace";
import usePlans from "../../hooks/subscription/usePlans";
import CurrentSubscriptionCard from "../../components/subscription/CurrentSubscriptionCard";
import { ROUTE_PATHS } from "../../constants/routePaths";

function SubscriptionSuccessPage() {

    const { data: currentWorkspace } = useWorkspace()

    const currentPlan = currentWorkspace?.subscription?.plan

    return (
        <>
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-10 shrink-0 px-6">

                <div className="w-20 h-20 rounded-full bg-[#1A9E6E]/10 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2
                        className="h-10 w-10 text-[#1A9E6E]"
                        strokeWidth={2}
                    />
                </div>

                <h1 className="text-[28px] sm:text-[36px] font-bold text-gray-900 tracking-tight mb-3">
                    Welcome to {currentPlan.name}
                </h1>

                <p className="text-[16px] text-gray-500">
                    {currentPlan.name} is now active for <span className="font-medium text-gray-900">{currentWorkspace.name}</span>.
                    Your workspace has been upgraded successfully and all premium
                    features are ready to use.
                </p>

            </div>

            <div className="max-w-[1100px] mx-auto px-6">

                {/* Success Banner */}
                <div className="bg-[#1A9E6E]/5 border border-[#1A9E6E]/20 rounded-xl p-5 mb-6">

                    <div className="flex items-start gap-4">

                        <div className="bg-[#1A9E6E]/10 rounded-full p-2 shrink-0">
                            <Sparkles
                                className="h-5 w-5 text-[#1A9E6E]"
                                strokeWidth={2}
                            />
                        </div>

                        <div>
                            <h2 className="text-base font-semibold text-gray-900 mb-1">
                                Upgrade Successful
                            </h2>

                            <p className="text-sm text-gray-600">
                                Your subscription has been activated and the new limits
                                and features are available immediately.
                            </p>
                        </div>

                    </div>

                </div>

                <CurrentSubscriptionCard subscription={currentWorkspace?.subscription} className="mb-6" />


                {/* Benefits */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 mb-8">

                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                        You Now Have Access To
                    </p>

                    <h3 className="text-lg font-semibold text-gray-900 mb-5">
                        Premium Features & Higher Limits
                    </h3>

                    <div className="grid sm:grid-cols-2 gap-4">

                        <Feature text={currentWorkspace.limits.goals.max ? `Up to ${currentWorkspace.limits.goals.max}  goals` : "Unlimited goals"} />
                        <Feature text={currentWorkspace.limits.members.max ? `Up to ${currentWorkspace.limits.members.max}  members` : "Unlimited members"} />
                        {
                            currentWorkspace.features.aiEnhancements &&
                            <Feature text="AI Enhancements" />
                        }
                        {
                            currentWorkspace.features.aiAssistant &&
                            <Feature text="AI Assistant" />
                        }
                    </div>

                </div>

                {/* CTA */}
                <div className="flex justify-center">
                    <Link to={ROUTE_PATHS.WORKSPACE(currentWorkspace.slug)}>
                        <AppButton>
                            Go to Workspace
                            <ArrowRight className="h-4 w-4" />
                        </AppButton>
                    </Link>
                </div>

            </div>
        </>
    );
}

function Feature({ text }) {
    return (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">

            <div className="bg-[#1A9E6E]/10 rounded-full p-1 shrink-0">
                <CheckCircle2
                    className="h-3.5 w-3.5 text-[#1A9E6E]"
                    strokeWidth={2.5}
                />
            </div>

            <span className="text-sm font-medium text-gray-700">
                {text}
            </span>

        </div>
    );
}

export default SubscriptionSuccessPage;