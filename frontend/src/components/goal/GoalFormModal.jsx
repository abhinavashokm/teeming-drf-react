import { Target } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATHS } from '../../constants/routePaths';
import useCreateGoal from '../../hooks/goal/useCreateGoal';
import useUpdateGoal from '../../hooks/goal/useUpdateGoal';
import useWorkspaceSlug from '../../hooks/params/useWorkspaceSlug';
import { advanceTour, setTourGoalId, TOUR_STEPS } from '../../store/slices/tourSlice';
import { driveWhenReady, resumeStepIfActive } from '../../utils/tourDriver';
import AppButton from '../ui/buttons/AppButton';
import CancelButton from '../ui/buttons/CancelButton';
import DateField from '../ui/form/DateField';
import FormField from '../ui/form/FormField';
import InputField from '../ui/form/InputField';
import TextareaField from '../ui/form/TextAreaField';
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

    const { mutate: createGoal, isPending: creatingGoal } = useCreateGoal()
    const { mutate: updateGoal, isPending: updaingGoal } = useUpdateGoal()

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

    /* -------------------------------------------------------------------------- */
    /* Goal submit + New user walkthrough guide */
    /* -------------------------------------------------------------------------- */
    const { active, stepIndex } = useSelector((state) => state.tour);
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const workspaceSlug = useWorkspaceSlug()

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
                onSuccess: (res) => {
                    reset();
                    onClose();

                    const createdGoal = res.data

                    if (active && stepIndex === TOUR_STEPS.CREATE_GOAL) {
                        dispatch(setTourGoalId(createdGoal.id));
                        dispatch(advanceTour());
                        navigate(ROUTE_PATHS.GOAL_DASHBOARD(workspaceSlug, createdGoal.id))
                    }

                }
            })
        }
    }

    const handleCloseModal = () => {
        reset()
        onClose()

        resumeStepIfActive(TOUR_STEPS.CREATE_GOAL, '[data-tour="new-goal-btn"]', {
            title: 'Create your first goal',
            description: 'Click here to get started.',
            showButtons: ['close'],
        });
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
                    <InputField size="md" {...register('name')} placeholder="e.g. Reduce Checkout Drop-off" />
                </FormField>

                <FormField label="Description" optional>
                    <TextareaField {...register('description')} placeholder="Add more details about this goal..." rows={3} />
                </FormField>

                <FormField label="Deadline" optional>
                    <DateField
                        disablePast
                        {...register("targetDate")}
                    />
                </FormField>

            </BaseModal.Body>

            <BaseModal.Footer className={'justify-between'} >
                <CancelButton onClick={handleCloseModal} className="flex-none" />
                <AppButton
                    onClick={handleSubmit(handleGoalFormSubmit)}
                    disabled={!isDirty || creatingGoal || updaingGoal}
                    loading={creatingGoal || updaingGoal}
                >
                    {isEditMode ? "Save Changes" : "Create Goal"}
                </AppButton>
            </BaseModal.Footer>

        </BaseModal>
    )
}