import { Trash2, Loader2 } from "lucide-react";
import useDeleteMetric from "../../hooks/outcome/useDeleteMetric";

export default function MetricRow({ currentMetric }) {

    const { mutate: deleteMetric, isPending: isDeletingMetric } = useDeleteMetric()

    const handleDeleteMetric = () => {
        deleteMetric(currentMetric.id)
    }

    return (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-[14px] font-semibold text-gray-900">
                            {currentMetric.name}
                        </h4>

                        <span className="text-[12px] text-gray-400">•</span>

                        <span className="text-[12px] text-gray-500">
                            {currentMetric.unit}
                        </span>

                        <span className="text-[12px] text-gray-400">•</span>

                        <span className="text-[12px] font-medium text-green-600">
                            {currentMetric.direction}
                        </span>
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-[13px]">
                        <span className="text-gray-500">
                            Current:
                            <span className="ml-1 font-medium text-gray-900">
                                {currentMetric.baselineValue}
                            </span>
                        </span>

                        <span className="text-gray-500">
                            Target:
                            <span className="ml-1 font-medium text-gray-900">
                                {currentMetric.targetValue}
                            </span>
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    <button
                        className="text-[13px] font-medium text-[#378ADD] hover:text-[#2c71b6] transition-colors"
                    >
                        Edit
                    </button>

                    <button
                        onClick={handleDeleteMetric}
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
            </div>
        </div>
    );
}