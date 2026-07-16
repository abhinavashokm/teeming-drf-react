import { Sparkles, Target, X, TriangleAlert } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import AppButton from "../ui/buttons/AppButton";
import CancelButton from "../ui/buttons/CancelButton";
import FormField from "../ui/form/FormField";
import InputField from '../ui/form/InputField';
import TextareaField from '../ui/form/TextAreaField';
import BaseModal from '../ui/modal/BaseModal';

import useImproveIdea from '../../hooks/ai/useImproveIdea';
import useAddIdea from '../../hooks/idea/useAddIdea';
import useUpdateIdea from '../../hooks/idea/useUpdateIdea';
import useGoalId from "../../hooks/params/useGoalId";
import { errorCodes } from '../../constants/errorCodes';
import useWorkspace from "../../hooks/workspace/useWorkspace"
import useNavigateUpgradePlan from '../../hooks/routes/useNavigateUpgradePlan';


function IdeaFormModal({
    isOpen,
    onClose,
    currentIdea = null
}) {

    const isEditMode = !!currentIdea;

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { isDirty }
    } = useForm({
        defaultValues: {
            title: '',
            description: '',
        },
    });

    const { mutate: addIdea, isPending: isCreating } = useAddIdea();
    const { mutate: updateIdea, isPending: isUpdating } = useUpdateIdea()
    const goalId = useGoalId();

    const title = watch('title', '');
    const description = watch('description', '');

    useEffect(() => {
        if (currentIdea) {
            reset({
                title: currentIdea.title || '',
                description: currentIdea.description || '',
            });
        } else {
            reset({
                title: '',
                description: '',
            });
        }
    }, [currentIdea, reset]);



    const handleEditIdea = (data) => {
        updateIdea({ data: data, ideaId: currentIdea.id }, {
            onSuccess: handleClose
        })
    }

    const handleFormSubmit = (data) => {

        if (isEditMode) {
            handleEditIdea(data);
            return;
        }

        addIdea(
            { data, goalId },
            {
                onSuccess: handleClose,
            }
        );
    };

    //---------------------AI FEATURE--------------------------

    const { data: currentWorkspace } = useWorkspace()
    const isAiEnhacementsAvailable = currentWorkspace?.features?.aiEnhancements

    const { mutate: improveIdeaWithAI } = useImproveIdea()

    const [isEnhancingIdea, setIsEnhancingIdea] = useState(false);
    const [showAiBanner, setShowAiBanner] = useState(false);
    const [originalIdea, setOriginalIdea] = useState(null);
    const [highlightAIFields, setHighlightAIFields] = useState(false);
    const [aiError, setAiError] = useState(false);

    const resetAIStates = () => {
        setIsEnhancingIdea(false)
        setShowAiBanner(false)
        setHighlightAIFields(false)
        setOriginalIdea(null)
        setAiError(false)
    }

    const goToUpgradePlan = useNavigateUpgradePlan();

    const handleImproveIdea = async (data) => {

        if (!isAiEnhacementsAvailable) {
            return goToUpgradePlan()
        }

        setIsEnhancingIdea(true);

        setOriginalIdea({
            title: data.title,
            description: data.description,
        });

        improveIdeaWithAI({ goalId: goalId, data: data }, {
            onSuccess: ({ data: { improvedTitle, improvedDescription } }) => {

                resetAIStates()

                setValue("title",
                    improvedTitle,
                    {
                        shouldDirty: true,
                    })

                setValue(
                    "description",
                    improvedDescription,
                    {
                        shouldDirty: true,
                    }
                );

                setHighlightAIFields(true);
                setShowAiBanner(true);
            },

            onError: (error) => {

                resetAIStates()

                const errorRes = error?.response?.data?.error
                if (errorRes?.code === errorCodes.AI_UNAVILABLE) {
                    setAiError("Teeming AI is currently busy. Please try again in a minute.")
                }
            }
        })
    };

    const handleUndoAIChanges = () => {

        if (!originalIdea) return;

        setValue(
            "title",
            originalIdea.title,
            {
                shouldDirty: true,
            }
        );

        setValue(
            "description",
            originalIdea.description,
            {
                shouldDirty: true,
            }
        );

        setShowAiBanner(false);
        setHighlightAIFields(false);
        setOriginalIdea(null);
    };
    const handleKeepAIChanges = () => {

        setShowAiBanner(false);
        setHighlightAIFields(false);
        setOriginalIdea(null);
    };


    const handleClose = () => {
        reset();
        onClose();
        resetAIStates()
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={handleClose}
        >

            {/* Header */}
            <BaseModal.Header onClose={handleClose}>
                <span className="px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-md text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    {isEditMode ? 'Edit Idea' : 'New Idea'}
                </span>
            </BaseModal.Header>

            {/* Body */}
            <BaseModal.Body>

                <h2 className="hidden sm:block text-[20px] font-bold text-gray-900 mb-6">
                    {isEditMode ? 'Edit idea' : 'Add a new idea'}
                </h2>

                {/* Title */}
                <FormField
                    label={
                        <div className="flex items-center gap-2">
                            <span>Title *</span>

                            {showAiBanner && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold">
                                    <Sparkles className="w-3 h-3" />
                                    AI
                                </span>
                            )}
                        </div>
                    }
                    className="uppercase mb-5"
                >
                    <InputField
                        type="text"
                        placeholder="What's the idea? Keep it short..."
                        size="lg"
                        shadow
                        className={
                            highlightAIFields
                                ? "bg-indigo-50 border-indigo-300 ring-2 ring-indigo-100"
                                : ""
                        }
                        {...register('title')}
                    />
                </FormField>

                {/* Description */}
                <FormField
                    label={
                        <div className="flex items-center gap-2">
                            <span>Description</span>

                            {showAiBanner && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold">
                                    <Sparkles className="w-3 h-3" />
                                    AI
                                </span>
                            )}
                        </div>
                    }
                    optional
                    className="mb-6 relative uppercase"
                >
                    <TextareaField
                        maxLength={300}
                        placeholder="Add more context about this idea..."
                        shadow
                        className={
                            highlightAIFields
                                ? "bg-indigo-50 border-indigo-300 ring-2 ring-indigo-100"
                                : ""
                        }
                        {...register('description')}
                    />

                    <span className="absolute bottom-3 right-3 text-[11px] text-gray-400 font-medium">
                        {description.length} / 300
                    </span>
                </FormField>

                {showAiBanner && (
                    <div className="mb-6 rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-violet-50 p-3">

                        <div className="flex items-center justify-between">

                            <div className="flex items-center gap-2">

                                <Sparkles className="w-4 h-4 text-indigo-600" />

                                <span className="text-[13px] font-medium text-indigo-900">
                                    AI enhanced your idea
                                </span>

                            </div>

                            <div className="flex items-center gap-4">

                                <button
                                    type="button"
                                    onClick={handleUndoAIChanges}
                                    className="text-[12px] font-semibold text-gray-600 hover:text-gray-900"
                                >
                                    Undo
                                </button>

                                <button
                                    type="button"
                                    onClick={handleKeepAIChanges}
                                    className="text-[12px] font-semibold text-indigo-600 hover:text-indigo-800"
                                >
                                    Keep
                                </button>

                            </div>

                        </div>

                    </div>
                )}

                {/* AI Enhancements only for create */}
                {!isEditMode && (

                    <div className="flex justify-end mb-4">

                        <AppButton
                            type="button"
                            size="sm"
                            variant="secondary"
                            disabled={!isAiEnhacementsAvailable || !title.trim()}
                            onClick={handleSubmit(handleImproveIdea)}
                            loading={isEnhancingIdea}
                            title={!title.trim() ? "Add a title first" : undefined}
                        >
                            <Sparkles className="w-4 h-4" />
                            Enhance Idea
                            {
                                !isAiEnhacementsAvailable &&
                                <span className="ml-1 rounded-full bg-violet-100 px-1.5 py-0.5 text-[10px] font-bold text-violet-700">
                                    Upgrade
                                </span>
                            }

                        </AppButton>

                    </div>

                )}

                {aiError && (
                    <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3">

                        <div className="flex items-start justify-between gap-3">

                            <div className="flex items-center gap-2">

                                <span className="text-amber-600 text-sm">
                                    <TriangleAlert />
                                </span>

                                <span className="text-[13px] text-amber-800">
                                    AI is currently busy. Please try again in a minute.
                                </span>

                            </div>

                            <button
                                type="button"
                                onClick={() => setAiError(null)}
                                className="text-amber-500 hover:text-amber-700 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>

                        </div>

                    </div>
                )}

            </BaseModal.Body>

            {/* Footer */}
            <BaseModal.Footer className="flex-col gap-3 sm:flex-row sm:justify-between">

                <div className="flex items-center gap-2 text-gray-500">
                    <Target className="w-4 h-4" />

                    <span className="text-[13px] font-medium truncate max-w-[200px]">
                        Adding to: Checkout Drop-off
                    </span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">

                    <CancelButton
                        shadow
                        onClick={handleClose}
                    />

                    <AppButton
                        shadow
                        variant="primary"
                        className="flex-1 sm:flex-none"
                        onClick={handleSubmit(handleFormSubmit)}
                        loading={isCreating || isUpdating}
                        disabled={!isDirty}
                    >
                        {isEditMode ? 'Save Changes' : 'Add Idea'}
                    </AppButton>

                </div>

            </BaseModal.Footer>

        </BaseModal>
    );
}

export default IdeaFormModal;