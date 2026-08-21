import { Command } from "cmdk";
import {
    Activity,
    Check,
    CheckCircle2,
    Flag,
    Lightbulb,
    RefreshCw,
    TrendingDown,
    TrendingUp,
    X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { IDEA_STATUS } from "../../constants/ideaConstants";
import { CHECKIN_STATUS, CHECKIN_STATUS_LABELS } from "../../constants/outcomeConstants";
import useIdeas from "../../hooks/idea/useIdeas";
import useCreateCheckin from "../../hooks/outcome/useCreateCheckin";
import useMetrics from "../../hooks/outcome/useMetrics";
import useUpdateCheckin from "../../hooks/outcome/useUpdateCheckin";
import { formatDate } from "../../utils/timeUtils";
import AppButton from "../ui/buttons/AppButton";
import BaseModal from "../ui/modal/BaseModal";

import { useSelector, useDispatch } from 'react-redux';
import { finishTour, TOUR_STEPS, advanceTour } from '../../store/slices/tourSlice';
import { resumeStepIfActive, tourDriver } from '../../utils/tourDriver';


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

export default function CheckinFormModal({
    isOpen,
    onClose,
    goalName,
    currentCheckin = null,
}) {
    const isEdit = !!currentCheckin;

    const { data: allMetrics = [] } = useMetrics();

    // in edit mode only show metrics that were part of the original checkin
    const checkinMetrics = isEdit
        ? allMetrics.filter(m =>
            currentCheckin.metricValues?.some(mv => mv.metricId === m.id)
        )
        : allMetrics;

    const { data: ideas = [] } = useIdeas();
    const completedIdeas = ideas?.filter(idea => idea.status === IDEA_STATUS.DONE) || [];

    const {
        register,
        watch,
        setValue,
        handleSubmit,
        control,
        reset,
        formState: { isDirty },
    } = useForm({
        defaultValues: isEdit
            ? {
                status: currentCheckin.status,
                notes: currentCheckin.notes ?? '',
                contributed_ideas: currentCheckin.contributed_ideas ?? [],
                metricValues: checkinMetrics.map(metric => ({
                    metricId: metric.id,
                    value: currentCheckin.metricValues?.find(
                        mv => mv.metricId === metric.id
                    )?.value ?? '',
                })),
            }
            : {
                status: CHECKIN_STATUS.MEASURING,
                contributed_ideas: [],
            },
    });

    const { fields } = useFieldArray({
        control,
        name: "metricValues",
    });

    const selectedStatus = watch("status");
    const selectedIdeaIds = watch("contributed_ideas") ?? [];

    const [ideaSearch, setIdeaSearch] = useState("");

    const toggleIdea = (ideaId) => {
        const current = selectedIdeaIds;
        const isAdding = !current.includes(ideaId);
        const next = isAdding
            ? [...current, ideaId]
            : current.filter(id => id !== ideaId);
        setValue("contributed_ideas", next, { shouldDirty: true });
        if (isAdding) setIdeaSearch("");
    };

    const selectedIdeas = completedIdeas.filter(
        idea => selectedIdeaIds.includes(idea.id)
    );
    const unselectedIdeas = completedIdeas.filter(
        idea => !selectedIdeaIds.includes(idea.id)
    );

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

    useEffect(() => {
        if (!isOpen) return;

        setIdeaSearch("");

        if (isEdit) {
            reset({
                status: currentCheckin.status,
                notes: currentCheckin.notes ?? '',
                contributed_ideas: currentCheckin.contributed_ideas ?? [],
                metricValues: checkinMetrics.map(metric => ({
                    metricId: metric.id,
                    value: currentCheckin.metricValues?.find(
                        mv => mv.metricId === metric.id
                    )?.value ?? '',
                })),
            });
        } else {
            reset({
                status: '',
                notes: '',
                contributed_ideas: [],
                metricValues: [],
            });
        }
    }, [isOpen, currentCheckin?.id]);

    const { mutate: createCheckin, isPending: isCreatePending } = useCreateCheckin();
    const { mutate: updateCheckin, isPending: isUpdatePending } = useUpdateCheckin()



    const handleEditCheckin = (data) => {
        const payload = {
            ...data,
            metricValues: data.metricValues?.filter(
                metric => metric.value !== ""
            ) ?? [],
        };

        updateCheckin({ data: payload, checkinId: currentCheckin.id }, {
            onSuccess: () => {
                reset({
                    status: '',
                    notes: '',
                    contributed_ideas: [],
                    metricValues: [],
                })
                onClose()
            }
        })
    };

    const isSaveDisabled = isCreatePending || isUpdatePending || (isEdit ? !isDirty : !selectedStatus);

    /* -------------------------------------------------------------------------- */
    /* handle create checkin + new user walkthrogh */
    /* -------------------------------------------------------------------------- */
    const { active, stepIndex } = useSelector((state) => state.tour);
    const dispatch = useDispatch();
    const isTourTarget = active && stepIndex === TOUR_STEPS.ADD_CHECKIN;
  
    const handleCreateCheckin = (data) => {
        const payload = {
            ...data,
            metricValues: data.metricValues?.filter(
                metric => metric.value !== ""
            ) ?? [],
        };
        createCheckin(payload, {
            onSuccess: () => {
                onClose();
                reset();

                if (isTourTarget) {
                    dispatch(advanceTour()); // → TOUR_STEPS.OPEN_DISCUSSION
                }
            },
        });
    };

    const handleClose = () => {
        onClose();
        resumeStepIfActive(TOUR_STEPS.ADD_CHECKIN, '[data-tour="add-checkin-btn"]', {
            title: 'Log a check-in',
            description: "Now record how things are going — that's the whole point of Teeming.",
            showButtons: ['close'],
        });
    };

    return (
        <BaseModal isOpen={isOpen} onClose={handleClose} size="lg">
            <BaseModal.Header onClose={handleClose}>
                <span className="px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-md text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5" />
                    {isEdit ? 'Edit Check-in' : 'New Check-in'}
                </span>
            </BaseModal.Header>

            <BaseModal.Body>
                <h2 className="text-[20px] font-bold text-gray-900 mb-1">
                    {isEdit ? 'Edit outcome check-in' : 'Record outcome check-in'}
                </h2>
                <p className="text-[13px] text-gray-500 mb-8">
                    {isEdit
                        ? 'Update the status, metrics, or notes for this check-in.'
                        : 'How are things looking since the work was completed?'
                    }
                </p>

                {/* STATUS */}
                <div className="mb-8">
                    <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wider mb-3">
                        Status *
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        <StatusCard
                            selected={selectedStatus === CHECKIN_STATUS.MEASURING}
                            onClick={() => setValue("status", CHECKIN_STATUS.MEASURING, { shouldDirty: true })}
                            statusValue={CHECKIN_STATUS.MEASURING}
                            description="Collecting data, no clear impact yet"
                            icon={Activity}
                            iconClassName="text-gray-400"
                        />
                        <StatusCard
                            selected={selectedStatus === CHECKIN_STATUS.PROMISING}
                            onClick={() => setValue("status", CHECKIN_STATUS.PROMISING, { shouldDirty: true })}
                            statusValue={CHECKIN_STATUS.PROMISING}
                            description="Numbers are moving in the right direction"
                            icon={TrendingUp}
                            iconClassName="text-green-600"
                        />
                        <StatusCard
                            selected={selectedStatus === CHECKIN_STATUS.ACHIEVED}
                            onClick={() => setValue("status", CHECKIN_STATUS.ACHIEVED, { shouldDirty: true })}
                            statusValue={CHECKIN_STATUS.ACHIEVED}
                            description="Successfully reached the desired outcome"
                            icon={CheckCircle2}
                            iconClassName="text-green-600"
                        />
                        <StatusCard
                            selected={selectedStatus === CHECKIN_STATUS.NOT_WORKING}
                            onClick={() => setValue("status", CHECKIN_STATUS.NOT_WORKING, { shouldDirty: true })}
                            statusValue={CHECKIN_STATUS.NOT_WORKING}
                            description="Results are flat or negatively impacted"
                            icon={TrendingDown}
                            iconClassName="text-red-500"
                        />
                    </div>
                </div>

                {/* METRICS */}
                {checkinMetrics.length > 0 && (
                    <div className="mb-8">
                        <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                            Metrics {isEdit ? '' : '(optional)'}
                        </label>
                        <p className="text-[12px] text-gray-500 mb-3">
                            {isEdit
                                ? 'Update the values recorded in this check-in'
                                : 'Track what actually changed with numbers'
                            }
                        </p>
                        <div className="space-y-3">
                            {checkinMetrics.map((metric, index) => {
                                const currentValue = watch(`metricValues.${index}.value`);
                                const change = calculateChange(metric.baselineValue, currentValue);

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
                                                <span className={`text-[12px] font-bold ${change.isPositive ? "text-green-600"
                                                    : change.isNegative ? "text-red-500"
                                                        : "text-gray-400"
                                                    }`}>
                                                    {change.isPositive ? "↑" : change.isNegative ? "↓" : ""}
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
                                            {...register(`metricValues.${index}.value`)}
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* CONTRIBUTING IDEAS */}
                <div className="mb-8">
                    <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        What contributed to this? (optional)
                    </label>
                    <p className="text-[12px] text-gray-500 mb-3">
                        Select any completed ideas you think caused this change
                    </p>

                    {/* Selected chips */}
                    {selectedIdeas.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                            {selectedIdeas.map(idea => (
                                <div
                                    key={idea.id}
                                    className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-md py-1 px-1.5"
                                >
                                    <Lightbulb className="w-3 h-3 text-amber-500 shrink-0" />
                                    <span className="text-[12px] font-medium text-gray-700 truncate max-w-[200px]">
                                        {idea.title}
                                    </span>
                                    <button type="button" onClick={() => toggleIdea(idea.id)}>
                                        <X className="w-3 h-3 text-gray-400 hover:text-red-500" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Combobox */}
                    <Command className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <Command.Input
                            value={ideaSearch}
                            onValueChange={setIdeaSearch}
                            placeholder="Search completed ideas..."
                            className="w-full px-3.5 py-2.5 text-[13px] outline-none border-b border-gray-100"
                        />
                        <Command.List className="max-h-[108px] sm:max-h-[180px] overflow-y-auto">
                            <Command.Empty className="py-5 text-center text-[13px] text-gray-400">
                                {completedIdeas.length === 0
                                    ? "No completed ideas since the last check-in"
                                    : "No matching ideas"}
                            </Command.Empty>
                            {unselectedIdeas.map((idea) => (
                                <Command.Item
                                    key={idea.id}
                                    value={idea.title}
                                    onSelect={() => toggleIdea(idea.id)}
                                    className="flex items-center justify-between px-3 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                                        <span className="text-[13px] font-medium text-gray-900">
                                            {idea.title}
                                        </span>
                                    </div>
                                    <span className="text-[11px] text-gray-400 shrink-0">
                                        Done {formatDate(idea.movedToDoneAt)}
                                    </span>
                                </Command.Item>
                            ))}
                        </Command.List>
                    </Command>
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
                        onClick={handleClose}
                        className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-[13px]"
                    >
                        Cancel
                    </button>
                    <AppButton
                        type="button"
                        onClick={handleSubmit(isEdit ? handleEditCheckin : handleCreateCheckin)}
                        loading={isCreatePending || isUpdatePending}
                        disabled={isSaveDisabled}
                    >
                        {isEdit ? 'Save Changes' : 'Save Check-in'}
                    </AppButton>
                </div>
            </BaseModal.Footer>
        </BaseModal>
    );
}