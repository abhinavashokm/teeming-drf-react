import { RefreshCw, Sparkles, Target, Wand2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import BaseModal from '../ui/modal/BaseModal';
import FormField from "../ui/form/FormField";
import InputField from '../ui/form/InputField';
import TextareaField from '../ui/form/TextAreaField';
import AppButton from "../ui/buttons/AppButton";
import CancelButton from "../ui/buttons/CancelButton";

import useAddIdea from '../../hooks/idea/useAddIdea';
import useGoalId from "../../hooks/params/useGoalId";
import useUpdateIdea from '../../hooks/idea/useUpdateIdea';

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
        formState: {isDirty}
    } = useForm({
        defaultValues: {
            title: '',
            description: '',
        },
    });

    const { mutate: addIdea, isPending: isCreating } = useAddIdea();
    const { mutate: updateIdea, isPending: isUpdating } = useUpdateIdea()
    const goalId = useGoalId();

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
            onSuccess: () => {
                reset();
                onClose();
            }
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
                onSuccess: () => {
                    reset();
                    onClose();
                },
            }
        );
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const [suggestWithAi, setSuggestWithAi] = useState(false);
    const [aiSuggestions, setAiSuggestions] = useState([]);
    const [isAiLoading, setIsAiLoading] = useState(false);

    const fetchAISuggestions = async () => {
        setIsAiLoading(true);
        setAiSuggestions([]);

        return new Promise(resolve => {
            setTimeout(() => {
                const suggestions = [
                    "Add guest checkout option",
                    "Implement one-click Apple Pay",
                    "Show progress indicator during checkout",
                    "Auto-fill address via Google Maps",
                    "Offer Buy Now, Pay Later options"
                ];

                setAiSuggestions(suggestions);
                setIsAiLoading(false);

                resolve(suggestions);
            }, 1500);
        });
    };

    useEffect(() => {
        if (suggestWithAi && aiSuggestions.length === 0 && !isAiLoading) {
            fetchAISuggestions();
        }
    }, [suggestWithAi]);

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
                    label="Title *"
                    className="uppercase mb-5"
                >
                    <InputField
                        type="text"
                        placeholder="What's the idea? Keep it short..."
                        size="lg"
                        shadow
                        {...register('title')}
                    />
                </FormField>

                {/* Description */}
                <FormField
                    label="Description"
                    optional
                    className="mb-6 relative uppercase"
                >
                    <TextareaField
                        maxLength={300}
                        placeholder="Add more context about this idea..."
                        shadow
                        {...register('description')}
                    />

                    <span className="absolute bottom-3 right-3 text-[11px] text-gray-400 font-medium">
                        {description.length} / 300
                    </span>
                </FormField>

                {/* AI Suggestions only for create */}
                {!isEditMode && (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">

                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
                                    <Wand2 className="w-4 h-4 text-indigo-600" />
                                </div>

                                <span className="text-[13px] font-bold text-gray-900">
                                    Suggest ideas with AI
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={() => setSuggestWithAi(!suggestWithAi)}
                                className={`relative w-10 h-5 rounded-full transition-colors ${suggestWithAi
                                    ? 'bg-green-500'
                                    : 'bg-gray-300'
                                    }`}
                            >
                                <div
                                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${suggestWithAi
                                        ? 'translate-x-5'
                                        : ''
                                        }`}
                                />
                            </button>
                        </div>

                        {suggestWithAi && (
                            <div className="p-4 pt-0 border-t border-gray-100 bg-white">

                                <div className="flex items-center gap-3 mb-4 mt-4">
                                    <div className="h-px bg-gray-100 flex-1" />

                                    <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                                        AI Suggestions Based On Your Goal
                                    </span>

                                    <div className="h-px bg-gray-100 flex-1" />
                                </div>

                                {isAiLoading ? (
                                    <div className="flex items-center justify-center py-6 gap-2 text-indigo-600">
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                        <span className="text-[13px] font-medium animate-pulse">
                                            Generating suggestions...
                                        </span>
                                    </div>
                                ) : (
                                    <div className="space-y-1.5">

                                        {aiSuggestions.map((sug, i) => (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() =>
                                                    setValue('title', sug, {
                                                        shouldDirty: true,
                                                    })
                                                }
                                                className={`w-full text-left px-3 py-2 rounded-lg text-[13px] transition-colors flex items-center gap-2 ${i === 0
                                                    ? 'bg-green-50 text-green-700 font-medium hover:bg-green-100'
                                                    : 'text-gray-700 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <span
                                                    className={
                                                        i === 0
                                                            ? 'text-green-500 font-bold text-[14px]'
                                                            : 'text-gray-400 font-bold text-[14px]'
                                                    }
                                                >
                                                    +
                                                </span>

                                                {sug}
                                            </button>
                                        ))}

                                    </div>
                                )}
                            </div>
                        )}
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