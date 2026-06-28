import {
    ArrowRight,
    Loader2,
    Trash2,
    TrendingDown,
    TrendingUp
} from "lucide-react";
import { useState } from "react";

import useDeleteMetric from "../../hooks/outcome/useDeleteMetric";
import MetricFormModal from "./MetricFormModal";
import { UNIT_SHORT_LABELS } from "../../constants/outcomeConstants";
import DangerConfirmationModal from "../ui/modal/DangerConfirmationModal";

export default function MetricRow({ currentMetric, canManageMetrics }) {

    const { mutate: deleteMetric, isPending: isDeletingMetric } = useDeleteMetric();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteConfirmModalOpen, setisDeleteConfirmModalOpen] = useState(false)

    const handleDeleteMetric = () => {
        deleteMetric(currentMetric.id);
    };

    const unit = UNIT_SHORT_LABELS[currentMetric.unit] || "";

    const isIncrease =
        currentMetric.direction?.toLowerCase() === "increase";

    return (
        <>
            <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors mb-4">

                <div className="flex items-center justify-between gap-4">

                    {/* Left */}
                    <div className="min-w-0 flex-1">

                        <div className="flex items-center gap-2 flex-wrap">

                            <h4 className="text-[14px] font-semibold text-gray-900 truncate">
                                {currentMetric.name}
                            </h4>

                            <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${isIncrease
                                    ? "bg-green-50 text-green-700"
                                    : "bg-amber-50 text-amber-700"
                                    }`}
                            >
                                {isIncrease ? (
                                    <TrendingUp className="w-3 h-3" />
                                ) : (
                                    <TrendingDown className="w-3 h-3" />
                                )}

                                {isIncrease ? "Increase" : "Decrease"}
                            </span>

                        </div>

                        <div className="flex items-center gap-2 mt-2">

                            <span className="text-[15px] font-semibold text-gray-900">
                                {currentMetric.baselineValue}
                                <span className="ml-1 text-[12px] text-gray-500">
                                    {unit}
                                </span>
                            </span>

                            <ArrowRight className="w-3.5 h-3.5 text-gray-400" />

                            <span className="text-[15px] font-semibold text-green-700">
                                {currentMetric.targetValue}
                                <span className="ml-1 text-[12px] text-green-600">
                                    {unit}
                                </span>
                            </span>

                        </div>

                    </div>

                    {/* Actions */}
                    {canManageMetrics && (
                        <div className="flex items-center gap-3 shrink-0">

                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="text-[13px] font-medium text-[#378ADD] hover:text-[#2c71b6] transition-colors"
                            >
                                Edit
                            </button>

                            <button
                                onClick={() => setisDeleteConfirmModalOpen(true)}
                                disabled={isDeletingMetric}
                                className="text-gray-400 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isDeletingMetric ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Trash2 className="w-4 h-4" />
                                )}
                            </button>

                        </div>
                    )}

                </div>
            </div>

            <MetricFormModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                goalName={"Goal"}
                currentMetric={currentMetric}
            />

            <DangerConfirmationModal
                isOpen={isDeleteConfirmModalOpen}
                onClose={() => setisDeleteConfirmModalOpen(false)}
                onConfirm={handleDeleteMetric}
                title={"Delete Metric"}
                description={"This metric will be completely removed from all the checkins and metric chart."}
                confirmButtonText="Delete Metric"
            />

        </>
    );
}