import { XCircle, RefreshCw, ArrowLeft, LifeBuoy } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AppButton from "../../components/ui/buttons/AppButton";
import useWorkspace from "../../hooks/workspace/useWorkspace";
import { ROUTE_PATHS } from "../../constants/routePaths";

function SubscriptionFailedPage() {

    const { data: currentWorkspace } = useWorkspace();
    const navigate = useNavigate();

    const handleRetry = () => {
        navigate(ROUTE_PATHS.WORKSPACE_BILLING(currentWorkspace.slug));
    };

    return (
        <>
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-10 shrink-0 px-6">

                <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
                    <XCircle
                        className="h-10 w-10 text-red-500"
                        strokeWidth={2}
                    />
                </div>

                <h1 className="text-[28px] sm:text-[36px] font-bold text-gray-900 tracking-tight mb-3">
                    Payment Failed
                </h1>

                <p className="text-[16px] text-gray-500">
                    We couldn't process your payment for{" "}
                    <span className="font-medium text-gray-900">{currentWorkspace?.name}</span>.
                    Your current plan remains unchanged.
                </p>

            </div>

            <div className="mx-auto px-6 space-y-4">

                {/* Failure Banner */}
                <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                    <h2 className="text-[14px] font-semibold text-red-700 mb-1">
                        What might have gone wrong
                    </h2>
                    <ul className="space-y-1.5 mt-3">
                        {[
                            "Insufficient funds or card limit reached",
                            "Card details entered incorrectly",
                            "Card not enabled for online transactions",
                            "Payment declined by your bank",
                        ].map((reason) => (
                            <li key={reason} className="flex items-center gap-2 text-[13px] text-red-600">
                                <span className="w-1 h-1 rounded-full bg-red-400 shrink-0" />
                                {reason}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* What to do */}
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
                        What you can do
                    </p>
                    <div className="space-y-3">
                        {[
                            "Check your card details and try again",
                            "Use a different payment method",
                            "Contact your bank to allow the transaction",
                            "Reach out to our support if the issue persists",
                        ].map((step, index) => (
                            <div key={step} className="flex items-start gap-3">
                                <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                    {index + 1}
                                </span>
                                <span className="text-[13px] text-gray-600">{step}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <Link to={ROUTE_PATHS.WORKSPACE(currentWorkspace?.slug)} className="w-full sm:w-auto">
                        <AppButton variant="outline" className="w-full">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Workspace
                        </AppButton>
                    </Link>
                    <AppButton onClick={handleRetry} className="w-full sm:w-auto">
                        <RefreshCw className="h-4 w-4" />
                        Try Again
                    </AppButton>
                </div>

                {/* Support */}
                {/* <div className="flex items-center justify-center gap-2 pt-2 pb-6">
                    <LifeBuoy className="h-3.5 w-3.5 text-gray-400" />
                    <p className="text-[12px] text-gray-400">
                        Need help?{" "}
                        <a href="mailto:support@yourapp.com" className="text-blue-500 hover:underline font-medium">
                            Contact support
                        </a>
                    </p>
                </div> */}

            </div>
        </>
    );
}

export default SubscriptionFailedPage;