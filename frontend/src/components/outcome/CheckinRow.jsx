import {
    CheckCircle2,
    TrendingUp,
    Ruler,
    AlertTriangle,
} from "lucide-react";
import { CHECKIN_STATUS_LABELS } from "../../constants/outcomeConstants";
import { dateToHuman } from "../../utils/timeUtils";
import MemberAvatar from "../team/MemberAvatar";
import CheckinActions from "./CheckinActions";
import CheckinFormModal from "./CheckinFormModal";
import { useState } from "react";


const STATUS_CONFIG = {
    measuring: {
        label: "Still Measuring",
        icon: Ruler,
        badgeClass:
            "bg-gray-100 text-gray-700 border border-gray-200",
        dotClass: "bg-gray-500",
    },

    promising: {
        label: "Looking Promising",
        icon: TrendingUp,
        badgeClass:
            "bg-blue-50 text-blue-700 border border-blue-200",
        dotClass: "bg-blue-500",
    },

    achieved: {
        label: "Goal Achieved",
        icon: CheckCircle2,
        badgeClass:
            "bg-green-50 text-green-700 border border-green-200",
        dotClass: "bg-green-500",
    },

    not_working: {
        label: "Not Working",
        icon: AlertTriangle,
        badgeClass:
            "bg-red-50 text-red-700 border border-red-200",
        dotClass: "bg-red-500",
    },
};

function CheckinRow({
    checkin,
    isLast,
    onEdit,
    canManageCheckins,
}) {
    const statusConfig = STATUS_CONFIG[checkin.status];
    const StatusIcon = statusConfig.icon;
    const { createdBy } = checkin;

    const [isCheckinModalOpen, setisCheckinModalOpen] = useState(false)

    return (
        <>
            <div className="relative flex gap-3 sm:gap-4 p-4 sm:p-6">
                {/* Timeline */}
                <div className="relative w-6 shrink-0 flex justify-center">
                    {!isLast && (
                        <div
                            className="
                    absolute
                    top-3
                    left-1/2
                    -translate-x-1/2
                    h-[calc(100%+2rem)]
                    w-px
                    bg-gray-200
                "
                        />
                    )}

                    <div
                        className={`relative z-10 w-3 h-3 rounded-full mt-1 ${statusConfig.dotClass}`}
                    />
                </div>


                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <MemberAvatar
                                    user={createdBy}
                                    size="sm"
                                />

                                <span className="text-[13px] font-semibold text-gray-900">
                                    {createdBy.fullName}
                                </span>

                                <span className="text-gray-300">•</span>

                                <span className="text-[12px] text-gray-500">
                                    {dateToHuman(checkin.createdAt)}
                                </span>
                            </div>

                            <div className="mt-2">
                                <span
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium ${statusConfig.badgeClass}`}
                                >
                                    <StatusIcon className="w-3.5 h-3.5" />
                                    {statusConfig.label}
                                </span>
                            </div>
                        </div>

                        {
                            canManageCheckins &&
                            <CheckinActions
                                checkin={checkin}
                                onEdit={() => setisCheckinModalOpen(true)}
                            />
                        }

                    </div>

                    {/* Metrics */}
                    {checkin.metricValues?.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {checkin.metricValues.map((metric) => (
                                <div
                                    key={metric.metricId}
                                    className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
                                >
                                    <div className="text-[11px] text-gray-500">
                                        {metric.name}
                                    </div>

                                    <div className="text-[13px] font-semibold text-gray-900">
                                        {metric.value}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Notes */}
                    {checkin.notes && (
                        <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
                            <p className="text-[13px] text-gray-700 leading-relaxed">
                                {checkin.notes}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <CheckinFormModal
                isOpen={isCheckinModalOpen}
                onClose={() => setisCheckinModalOpen(false)}
                goalName={"goal"}
                currentCheckin={checkin}
            />
        </>

    );
}

export default CheckinRow;