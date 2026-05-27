import { Calendar, Target, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import useCreateGoal from '../../hooks/goal/useCreateGoal';
import { useEffect } from 'react';
import useUpdateGoal from '../../hooks/goal/useUpdateGoal';

export default function GoalFormModal({ isOpen, onClose, isEditMode, goal }) {

    const { register, handleSubmit, reset } = useForm({
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
                onSuccess: () => {
                    reset()
                    onClose()
                }
            })
        } else {
            createGoal(payload, {
                onSuccess: () => {
                    reset()
                    onClose()
                }
            })
        }
    }

    const handleCloseModal = () => {
        reset()
        onClose()
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
            <div
                className="fixed inset-0 bg-gray-900/40 backdrop-blur-[2px] transition-opacity"
                onClick={handleCloseModal}
            />

            <div className="bg-white rounded-[16px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] w-full max-w-[520px] overflow-hidden relative z-10 border border-gray-100 animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#1D9E75]/10 flex items-center justify-center">
                            <Target className="w-5 h-5 text-[#1D9E75]" strokeWidth={2} />
                        </div>
                        <div>
                            <h2 className="text-[16px] font-semibold text-gray-900 tracking-tight leading-none">{isEditMode ? "Update Goal" : "Create New Goal"}</h2>
                            <p className="text-[13px] text-gray-500 mt-1">Set clear objectives for your team.</p>
                        </div>
                    </div>
                    <button
                        onClick={handleCloseModal}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                        <X className="h-5 w-5" strokeWidth={2} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5">
                    {/* Goal Name */}
                    <div>
                        <label className="text-[13px] font-medium text-gray-900 mb-1.5 block">Goal Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Launch V2 Platform"
                            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-[10px] text-[13px] text-gray-900 focus:outline-none focus:border-[#1D9E75] focus:ring-1 focus:ring-[#1D9E75]/20 transition-colors shadow-sm placeholder:text-gray-400"
                            {...register('name')}
                            autoFocus
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-[13px] font-medium text-gray-900 mb-1.5 flex items-center justify-between">
                            Description
                            <span className="text-gray-400 font-normal text-[12px]">Optional</span>
                        </label>
                        <textarea
                            placeholder="Add more details about this goal..."
                            rows={3}
                            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-[10px] text-[13px] text-gray-900 focus:outline-none focus:border-[#1D9E75] focus:ring-1 focus:ring-[#1D9E75]/20 transition-colors shadow-sm placeholder:text-gray-400 resize-none"
                            {...register('description')}
                        />
                    </div>

                    {/* Target Date and Status (Row) */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[13px] font-medium text-gray-900 mb-1.5 flex items-center justify-between">
                                Target Date
                                <span className="text-gray-400 font-normal text-[12px]">Optional</span>
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                <input
                                    type="date"
                                    {...register("targetDate")}
                                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-[10px] text-[13px] text-gray-900 cursor-pointer focus:outline-none focus:border-[#1D9E75] focus:ring-1 focus:ring-[#1D9E75]/20 transition-colors shadow-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-[13px] font-medium text-gray-900 mb-1.5 block">Status</label>
                            <select {...register("status")} className="w-full px-3 py-2.5 text-[13px] border border-gray-200 rounded-[10px] bg-white text-gray-900 cursor-pointer outline-none hover:bg-gray-50 transition-colors shadow-sm focus:border-[#1D9E75] focus:ring-1 focus:ring-[#1D9E75]/20">
                                <option value="draft">Draft</option>
                                <option value="active">Active</option>
                                <option value="on_hold">On Hold</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-3 rounded-b-[16px]">
                    <button
                        onClick={handleCloseModal}
                        className="px-4 py-2 text-[13px] font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-[10px] transition-colors shadow-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit(handleGoalFormSubmit)}
                        className="px-4 py-2 text-[13px] font-medium text-white bg-[#1D9E75] hover:bg-[#15825f] rounded-[10px] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={false}
                    >
                        {isEditMode ? "Save Changes" : "Create Goal"}
                    </button>
                </div>

            </div>
        </div>
    );
}
