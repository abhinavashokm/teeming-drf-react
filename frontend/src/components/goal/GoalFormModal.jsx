import { Calendar, Target } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import useCreateGoal from '../../hooks/goal/useCreateGoal';
import useUpdateGoal from '../../hooks/goal/useUpdateGoal';
import AppButton from '../ui/buttons/AppButton';
import CancelButton from '../ui/buttons/CancelButton';
import FormField from '../ui/form/FormField';
import InputField from '../ui/form/InputField';
import BaseModal from '../ui/modal/BaseModal';

export default function GoalFormModal({ isOpen, onClose, isEditMode, goal }) {

    const { register, handleSubmit, reset, formState: { isDirty } } = useForm({
        defaultValues: {
            name: "",
            description: "",
            targetDate: "",
            status: "draft",
        }
    })

    const { mutate: createGoal } = useCreateGoal()
    const { mutate: updateGoal } = useUpdateGoal()

    useEffect(() => {
        if (isEditMode && goal) {
            reset({
                name: goal.name || "",
                description: goal.description || "",
                status: goal.status || "draft",
                targetDate: goal.targetDate || null,
            })
        }
    }, [goal, isEditMode, reset])

    const handleGoalFormSubmit = (data) => {
        const payload = {
            name: data.name,
            status: data.status,
            ...(data.description && { description: data.description }),
            ...(data.targetDate && { targetDate: data.targetDate }),
        }

        if (isEditMode) {
            updateGoal({ data: payload, goalId: goal.id }, {
                onSuccess: () => { reset(); onClose() }
            })
        } else {
            createGoal(payload, {
                onSuccess: () => { reset(); onClose() }
            })
        }
    }

    const handleCloseModal = () => {
        reset()
        onClose()
    }

    return (
        <BaseModal isOpen={isOpen} onClose={handleCloseModal} size="md">

            <BaseModal.Header onClose={handleCloseModal}>
                <div className="w-8 h-8 rounded-xl bg-[#1D9E75]/10 flex items-center justify-center shrink-0">
                    <Target className="w-4 h-4 text-[#1D9E75]" strokeWidth={2} />
                </div>
                <div>
                    <h2 className="text-[15px] font-semibold text-gray-900 tracking-tight leading-none">
                        {isEditMode ? "Update Goal" : "Create New Goal"}
                    </h2>
                    <p className="text-[12px] text-gray-500 mt-0.5">Set clear objectives for your team.</p>
                </div>
            </BaseModal.Header>

            <BaseModal.Body className="space-y-5">

                <FormField label="Goal Name">
                    <InputField size="md" {...register('name')} placeholder="e.g. Launch V2" />
                </FormField>

                <FormField label="Description" optional>
                    <textarea
                        placeholder="Add more details about this goal..."
                        rows={3}
                        className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-[10px] text-[13px] text-gray-900 focus:outline-none focus:border-[#1D9E75] focus:ring-1 focus:ring-[#1D9E75]/20 transition-colors shadow-sm placeholder:text-gray-400 resize-none"
                        {...register('description')}
                    />
                </FormField>

                <div className="grid grid-cols-2 gap-4">
                    <FormField label="Target Date" optional>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            <input
                                type="date"
                                {...register("targetDate")}
                                className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-[10px] text-[13px] text-gray-900 cursor-pointer focus:outline-none focus:border-[#1D9E75] focus:ring-1 focus:ring-[#1D9E75]/20 transition-colors shadow-sm
                                    [&::-webkit-calendar-picker-indicator]:opacity-0
                                    [&::-webkit-calendar-picker-indicator]:absolute
                                    [&::-webkit-calendar-picker-indicator]:inset-0
                                    [&::-webkit-calendar-picker-indicator]:w-full
                                    [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                            />
                        </div>
                    </FormField>

                    <FormField label="Status">
                        <select
                            {...register("status")}
                            className="w-full px-3 py-2.5 text-[13px] border border-gray-200 rounded-[10px] bg-white text-gray-900 cursor-pointer outline-none hover:bg-gray-50 transition-colors shadow-sm focus:border-[#1D9E75] focus:ring-1 focus:ring-[#1D9E75]/20"
                        >
                            <option value="draft">Draft</option>
                            <option value="active">Active</option>
                            <option value="on_hold">On Hold</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </FormField>
                </div>

            </BaseModal.Body>

            <BaseModal.Footer className={'justify-between'} >
                <CancelButton onClick={handleCloseModal} className="flex-none"  />
                <AppButton
                    onClick={handleSubmit(handleGoalFormSubmit)}
                    disabled={!isDirty}
                >
                    {isEditMode ? "Save Changes" : "Create Goal"}
                </AppButton>
            </BaseModal.Footer>

        </BaseModal>
    )
}