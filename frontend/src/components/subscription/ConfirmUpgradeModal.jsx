import { useEffect } from "react";
import { currencySymbols } from "../../constants/subscriptionConstants";
import usePreviewUpgrade from "../../hooks/subscription/usePreviewUpgrade";

/**
 * Confirmation modal for upgrading to a higher plan. On open, fetches the
 * prorated amount due via `onLoadPreview`, then lets the user confirm the
 * charge via `onConfirm`.
 */
export default function ConfirmUpgradeModal({
    isOpen,
    onClose,
    onConfirm,
    plan,                 // { name, monthlyPrice, currency }
    preview,               // { amountDue, currency } | null
    isPreviewLoading = false,
    isConfirmLoading = false,
    previewError = null,
}) {
    if (!isOpen) return null;

    const handleClose = () => {
        if (isConfirmLoading) return;
        onClose();
    };

    const formattedAmountDue =
        preview && preview.amountDue != null
            ? `${currencySymbols[preview.currency] || ""}${(
                  preview.amountDue / 100
              ).toFixed(2)}`
            : null;

    

    return (
        <div className="fixed inset-0 z-78 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
                {/* Header */}
                <div className="px-6 pt-6 pb-4">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-green-50">
                            <svg
                                className="w-5 h-5 text-green-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.8}
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.563.563 0 0 0-.586 0L6.982 21.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.563.563 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-[15px] font-semibold text-gray-900">
                            Upgrade to {plan?.name}
                        </h2>
                    </div>
                    <p className="text-[13px] text-gray-500 ml-12">
                        Your card on file will be charged immediately for the
                        remaining time in your current billing period.
                    </p>
                </div>

                {/* Preview details */}
                <div className="px-6 pb-4">
                    {isPreviewLoading && (
                        <div className="flex items-center justify-center py-6">
                            <div className="h-5 w-5 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin" />
                        </div>
                    )}

                    {!isPreviewLoading && previewError && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-3">
                            <p className="text-[13px] text-red-600">
                                Couldn't calculate the upgrade amount. Please
                                try again.
                            </p>
                        </div>
                    )}

                    {!isPreviewLoading && !previewError && preview && (
                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[13px] text-gray-500">
                                    Due today (prorated)
                                </span>
                                <span className="text-[15px] font-semibold text-gray-900">
                                    {formattedAmountDue}
                                </span>
                            </div>

                            <div className="h-px bg-gray-200" />

                            <div className="flex items-center justify-between">
                                <span className="text-[13px] text-gray-500">
                                    Then billed monthly at
                                </span>
                                <span className="text-[13px] font-medium text-gray-700">
                                    {currencySymbols[plan?.currency]}
                                    {plan?.monthlyPrice}/month
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3 rounded-b-[16px]">
                    <button
                        onClick={handleClose}
                        disabled={isConfirmLoading}
                        className="px-4 py-2 text-[13px] font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-[10px] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isPreviewLoading || isConfirmLoading || !!previewError}
                        className="px-4 py-2 text-[13px] font-medium text-white bg-green-600 hover:bg-green-700 rounded-[10px] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isConfirmLoading
                            ? "Upgrading..."
                            : formattedAmountDue
                            ? `Pay ${formattedAmountDue} & Upgrade`
                            : "Confirm Upgrade"}
                    </button>
                </div>
            </div>
        </div>
    );
}