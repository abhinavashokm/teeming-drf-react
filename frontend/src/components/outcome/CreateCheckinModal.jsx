import {
    Activity,
    Check,
    CheckCircle2,
    Flag,
    RefreshCw,
    TrendingDown,
    TrendingUp,
} from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import BaseModal from "../ui/modal/BaseModal";
import useMetrics from "../../hooks/outcome/useMetrics";
import useCreateCheckin from "../../hooks/outcome/useCreateCheckin";
import { CHECKIN_STATUS, CHECKIN_STATUS_LABELS } from "../../constants/outcomeConstants";
import AppButton from "../ui/buttons/AppButton";

function StatusCard({
    selected,
    onClick,
    title,
    description,
    icon: Icon,
    iconClassName,
    statusValue,
}) {

    return (
        <button
            type="button"
            onClick={onClick}
            className={`relative p-4 rounded-xl border text-left transition-all ${selected
                ? "border-green-600 bg-green-50 ring-1 ring-green-600"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
        >
            {selected && (
                <div className="absolute top-3 right-3 w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                </div>
            )}

            <Icon className={`w-5 h-5 mb-2.5 ${iconClassName}`} />

            <h3 className="text-[14px] font-semibold text-gray-900 mb-1">
                {CHECKIN_STATUS_LABELS[statusValue]}
            </h3>

            <p className="text-[12px] text-gray-500 leading-snug">
                {description}
            </p>
        </button>
    );
}

export default function CreateCheckinModal({
    isOpen,
    onClose,
    goalName,
}) {

    const { data: checkinMetrics = [] } = useMetrics()

    const {
        register,
        watch,
        setValue,
        handleSubmit,
        control,
        reset
    } = useForm();

    const { fields } = useFieldArray({
        control,
        name: "metricValues",
    });



    const selectedStatus = watch("status");

    const calculateChange = (baseline, current) => {
        if (!current || isNaN(current)) return null;

        const b = parseFloat(baseline);
        const c = parseFloat(current);

        if (b === 0) return null;

        const pct = ((c - b) / b) * 100;

        return {
            val: Math.abs(pct).toFixed(1),
            isPositive: pct > 0,
            isNegative: pct < 0,
        };
    };

    const { mutate: createCheckin } = useCreateCheckin()

    const handleCreateCheckin = (data) => {

        const payload = {
            ...data,
            metricValues: data.metricValues.filter(
                metric => metric.value !== ""
            ),
        };

        createCheckin(payload, {
            onSuccess: () => {
                onClose();
                reset();
            } 
        })
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            size="lg"
        >
            <BaseModal.Header onClose={onClose}>
                <span className="px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-md text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5" />
                    New Check-in
                </span>
            </BaseModal.Header>

            <BaseModal.Body>
                <h2 className="text-[20px] font-bold text-gray-900 mb-1">
                    Record outcome check-in
                </h2>

                <p className="text-[13px] text-gray-500 mb-8">
                    How are things looking since the work was completed?
                </p>

                {/* STATUS */}

                <div className="mb-8">
                    <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wider mb-3">
                        Status *
                    </label>

                    <div className="grid grid-cols-2 gap-4">
                        <StatusCard
                            selected={selectedStatus === CHECKIN_STATUS.MEASURING}
                            onClick={() =>
                                setValue("status", CHECKIN_STATUS.MEASURING)
                            }
                            statusValue={CHECKIN_STATUS.MEASURING}
                            description="Collecting data, no clear impact yet"
                            icon={Activity}
                            iconClassName="text-gray-400"
                        />

                        <StatusCard
                            selected={selectedStatus === CHECKIN_STATUS.PROMISING}
                            onClick={() =>
                                setValue("status", CHECKIN_STATUS.PROMISING)
                            }
                            statusValue={CHECKIN_STATUS.PROMISING}
                            description="Numbers are moving in the right direction"
                            icon={TrendingUp}
                            iconClassName="text-green-600"
                        />

                        <StatusCard
                            selected={selectedStatus === CHECKIN_STATUS.ACHIEVED}
                            onClick={() =>
                                setValue("status", CHECKIN_STATUS.ACHIEVED)
                            }
                            statusValue={CHECKIN_STATUS.ACHIEVED}
                            description="Successfully reached the desired outcome"
                            icon={CheckCircle2}
                            iconClassName="text-green-600"
                        />

                        <StatusCard
                            selected={selectedStatus === CHECKIN_STATUS.NOT_WORKING}
                            onClick={() =>
                                setValue("status", CHECKIN_STATUS.NOT_WORKING)
                            }
                            statusValue={CHECKIN_STATUS.NOT_WORKING}
                            description="Results are flat or negatively impacted"
                            icon={TrendingDown}
                            iconClassName="text-red-500"
                        />
                    </div>
                </div>

                {/* METRICS */}

                <div className="mb-8">
                    <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Metrics (optional)
                    </label>

                    <p className="text-[12px] text-gray-500 mb-3">
                        Track what actually changed with numbers
                    </p>

                    <div className="space-y-3">
                        {checkinMetrics.map((metric, index) => {
                            const currentValue = watch(
                                `metricValues.${index}.value`
                            );

                            const change = calculateChange(
                                metric.baselineValue,
                                currentValue
                            );

                            return (
                                <div
                                    key={metric.id}
                                    className="bg-gray-50 border border-gray-200 rounded-xl p-4"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <h4 className="text-[13px] font-semibold text-gray-900">
                                                {metric.name}
                                            </h4>

                                            <p className="text-[12px] text-gray-500">
                                                Baseline: {metric.baselineValue}
                                            </p>
                                        </div>

                                        {change ? (
                                            <span
                                                className={`text-[12px] font-bold ${change.isPositive
                                                    ? "text-green-600"
                                                    : change.isNegative
                                                        ? "text-red-500"
                                                        : "text-gray-400"
                                                    }`}
                                            >
                                                {change.isPositive
                                                    ? "↑"
                                                    : change.isNegative
                                                        ? "↓"
                                                        : ""}
                                                {change.val}%
                                            </span>
                                        ) : null}
                                    </div>

                                    <input
                                        type="hidden"
                                        value={metric.id}
                                        {...register(`metricValues.${index}.metricId`)}
                                    />

                                    <input
                                        type="number"
                                        placeholder="Enter current value"
                                        {...register(
                                            `metricValues.${index}.value`
                                        )}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* NOTES */}

                <div>
                    <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wider mb-3">
                        Notes (optional)
                    </label>

                    <textarea
                        {...register("notes")}
                        placeholder="What did you learn?"
                        className="w-full border border-gray-200 rounded-xl p-4 min-h-[120px] text-[13px] outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                    />
                </div>
            </BaseModal.Body>

            <BaseModal.Footer className="justify-between">
                <div className="flex items-center gap-2 text-gray-500">
                    <Flag className="w-4 h-4" />
                    <span className="text-[13px] font-medium">
                        Goal: {goalName}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-[13px]"
                    >
                        Cancel
                    </button>

                    <AppButton
                        type="button"
                        onClick={handleSubmit(handleCreateCheckin)}
                    >
                        Save Check-in
                    </AppButton>
                </div>
            </BaseModal.Footer>
        </BaseModal>
    );
}