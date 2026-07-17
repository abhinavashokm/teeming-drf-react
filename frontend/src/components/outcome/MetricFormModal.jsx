import { Info, Flag } from 'lucide-react';
import BaseModal from '../ui/modal/BaseModal';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import FormMetricRow from './FormMetricRow';
import useCreateMetrics from '../../hooks/outcome/useCreateMetrics';
import useUpdateMetric from '../../hooks/outcome/useUpdateMetric';
import AppButton from '../ui/buttons/AppButton';
import { useEffect } from 'react';
import { UNIT_OPTIONS } from '../../constants/outcomeConstants';


const EMPTY_METRIC = {
    name: '',
    baselineValue: null,
    targetValue: null,
    unit: UNIT_OPTIONS[0]?.value,
    direction: 'increase',
};

export default function MetricFormModal({ isOpen, onClose, goalName = 'Goal', currentMetric = null }) {

    const isEdit = !!currentMetric;

    const formMethods = useForm();
    const { control, handleSubmit, reset, watch, formState: { isDirty } } = formMethods;

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'metrics'
    });

    const metrics = watch('metrics');
    const hasEmptyName = metrics?.some((metric) => !metric?.name?.trim());

    useEffect(() => {
        if (!isOpen) return;

        if (isEdit && currentMetric) {
            reset({
                metrics: [
                    {
                        name: currentMetric.name,
                        baselineValue: currentMetric.baselineValue,
                        targetValue: currentMetric.targetValue,
                        unit: currentMetric.unit,
                        direction: currentMetric.direction,
                    }
                ]
            });
        } else {
            reset({
                metrics: [{ ...EMPTY_METRIC }]
            });
        }
    }, [isOpen, currentMetric, isEdit, reset]);

    const { mutate: createMetrics, isPending: isCreating } = useCreateMetrics();
    const { mutate: updateMetric, isPending: isUpdating } = useUpdateMetric()

    const handleCreateMetrics = (data) => {
        createMetrics(data, {
            onSuccess: () => onClose()
        });
    };

    const handleEditMetric = (data) => {
        // handle edit — data.metrics[0] has the updated values

        updateMetric({ data: data.metrics[0], "metricId": currentMetric.id }, {
            onSuccess: () => {
                onClose();
            }
        })

    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} size="lg">

            <BaseModal.Header onClose={onClose}>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-[11px] font-bold uppercase tracking-wider">
                    {isEdit ? 'Edit Metric' : 'Metrics'}
                </span>
            </BaseModal.Header>

            <BaseModal.Body>
                <h2 className="text-[20px] font-bold text-gray-900 mb-1">
                    {isEdit ? 'Edit metric' : 'Create new metrics'}
                </h2>
                <p className="text-[13px] text-gray-500 mb-5">
                    {isEdit
                        ? 'Update the values, unit, and direction for this metric.'
                        : 'Record where things stand right now. Every check-in will measure progress against these numbers.'
                    }
                </p>

                <div className="flex items-start gap-2.5 bg-blue-50/50 text-blue-800 p-3.5 rounded-xl border border-blue-100 mb-6">
                    <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-600" />
                    <span className="text-[13px] leading-relaxed">
                        {isEdit
                            ? 'Metric name is locked and cannot be changed after creation.'
                            : 'Once saved, metric names are locked. You can only update values, units, and direction.'
                        }
                    </span>
                </div>

                <FormProvider {...formMethods}>
                    <div className="space-y-3 mb-4">
                        {fields.map((field, index) => (
                            <FormMetricRow
                                key={field.id}
                                index={index}
                                onRemove={remove}
                                canRemove={!isEdit && fields.length > 1}
                                lockName={isEdit}
                            />
                        ))}
                    </div>
                </FormProvider>

                {!isEdit && (
                    <button
                        type="button"
                        onClick={() => append({ ...EMPTY_METRIC })}
                        className="w-full py-2.5 border-2 border-dashed border-gray-200 text-gray-500 font-medium rounded-xl text-[13px] hover:border-gray-300 hover:text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        + Add another metric
                    </button>
                )}

            </BaseModal.Body>

            <BaseModal.Footer className="justify-between">
                <div className="flex items-center gap-2 text-gray-500">
                    <Flag className="w-4 h-4" />
                    <span className="text-[13px] font-medium truncate max-w-[160px]">Goal: {goalName}</span>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg text-[13px] hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
                    >
                        Cancel
                    </button>
                    <AppButton
                        type="button"
                        onClick={handleSubmit(isEdit ? handleEditMetric : handleCreateMetrics)}
                        disabled={!isDirty || hasEmptyName}
                        variant='primary'
                        loading={isUpdating || isCreating}
                    >
                        {isEdit ? 'Save changes' : 'Create'}
                    </AppButton>
                </div>
            </BaseModal.Footer>
        </BaseModal>
    );
}