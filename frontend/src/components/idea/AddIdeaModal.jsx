import { RefreshCw, Sparkles, Target, Wand2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import BaseModal from '../ui/modal/BaseModal';
import { useForm } from 'react-hook-form';
import FormField from "../ui/form/FormField"
import InputField from '../ui/form/InputField';
import TextareaField from '../ui/form/TextAreaField';
import AppButton from "../ui/buttons/AppButton"
import CancelButton from "../ui/buttons/CancelButton"
import useAddIdea from '../../hooks/idea/useAddIdea';
import useGoalId from "../../hooks/params/useGoalId"

function AddIdeaModal({ isOpen, onClose }) {

    const { register, handleSubmit, reset } = useForm()
    const { mutate: addIdea, isPending } = useAddIdea()
    const goalId = useGoalId()

    const handleAddIdea = (data) => {

        addIdea({data, goalId}, {
            onSuccess: () => {
                reset()
                onClose()
            }
        })
    }

    const [ideaTitle, setIdeaTitle] = useState('');
    const [ideaDesc, setIdeaDesc] = useState('');
    const [suggestWithAi, setSuggestWithAi] = useState(false);
    const [aiSuggestions, setAiSuggestions] = useState([]);
    const [isAiLoading, setIsAiLoading] = useState(false);


    // Mock function to simulate calling the Anthropic API
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
        <BaseModal isOpen={isOpen} onClose={onClose} >

            {/* Header */}
            <BaseModal.Header onClose={onClose} >
                <span className="px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-md text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    New Idea
                </span>
            </BaseModal.Header>

            {/* Body */}
            <BaseModal.Body>
                <h2 className="hidden sm:block text-[20px] font-bold text-gray-900 mb-6">Add a new idea</h2>

                {/* Title */}

                <FormField label={"Title *"} className='uppercase mb-5' >
                    <InputField 
                        type="text" placeholder="What's the idea? Keep it short..." size='lg' shadow
                        {...register('title')}
                    />
                </FormField>


                {/* Description */}
                <FormField label={"Description"} optional className="mb-6 relative uppercase">
                    <TextareaField
                        maxLength={300}
                        placeholder="Add more context about this idea..."
                        shadow
                        {...register("description")}
                    />
                    <span className="absolute bottom-3 right-3 text-[11px] text-gray-400 font-medium">
                        {ideaDesc.length} / 300
                    </span>
                </FormField>

                {/* AI Section */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                    <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
                                <Wand2 className="w-4 h-4 text-indigo-600" />
                            </div>
                            <span className="text-[13px] font-bold text-gray-900">Suggest ideas with AI</span>
                        </div>
                        {/* Toggle Switch */}
                        <button
                            onClick={() => setSuggestWithAi(!suggestWithAi)}
                            className={`relative w-10 h-5 rounded-full transition-colors ${suggestWithAi ? 'bg-green-500' : 'bg-gray-300'}`}
                        >
                            <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${suggestWithAi ? 'transform translate-x-5' : ''}`}></div>
                        </button>
                    </div>

                    {suggestWithAi && (
                        <div className="p-4 pt-0 border-t border-gray-100 bg-white">
                            <div className="flex items-center gap-3 mb-4 mt-4">
                                <div className="h-px bg-gray-100 flex-1"></div>
                                <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">AI SUGGESTIONS BASED ON YOUR GOAL:</span>
                                <div className="h-px bg-gray-100 flex-1"></div>
                            </div>

                            {isAiLoading ? (
                                <div className="flex items-center justify-center py-6 gap-2 text-indigo-600">
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    <span className="text-[13px] font-medium animate-pulse">Generating suggestions...</span>
                                </div>
                            ) : (
                                <div className="space-y-1.5">
                                    {aiSuggestions.map((sug, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setIdeaTitle(sug)}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-[13px] transition-colors flex items-center gap-2 ${i === 0 ? 'bg-green-50 text-green-700 font-medium hover:bg-green-100' : 'text-gray-700 hover:bg-gray-50'}`}
                                        >
                                            <span className={i === 0 ? 'text-green-500 font-bold text-[14px]' : 'text-gray-400 font-bold text-[14px]'}>+</span> {sug}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </BaseModal.Body>

            {/* Footer */}
            <BaseModal.Footer className="flex-col gap-3 sm:flex-row sm:justify-between">
                <div className="flex items-center gap-2 text-gray-500">
                    <Target className="w-4 h-4" />
                    <span className="text-[13px] font-medium truncate max-w-[200px]">
                        Adding to: {'Checkout Drop-off'}
                    </span>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">

                    <CancelButton shadow onClick={onClose} />

                    <AppButton 
                        shadow
                        variant="primary"
                        className="flex-1 sm:flex-none"
                        onClick={handleSubmit(handleAddIdea)}
                        loading={isPending}
                    >
                        Add idea
                    </AppButton>
                </div>
            </BaseModal.Footer>

        </BaseModal>
    )
}

export default AddIdeaModal