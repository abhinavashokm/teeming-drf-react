import { Lock, Sparkles } from 'lucide-react';
import { useEffect, useRef } from 'react';
import useAIAssistant from '../../../../hooks/ai/useAIAssistant';
import useAIAssistantResponses from '../../../../hooks/ai/useAIAssistantResponses';
import useClearAllAIResponses from '../../../../hooks/ai/useClearAllAIResponses';
import { formatDateTime } from '../../../../utils/timeUtils';
import ChatBubble from '../../../../components/chat/ChatBubble';
import useAuth from '../../../../hooks/auth/useAuth';
import AIResponseBubble from '../../../../components/chat/AIResponseBubble';


const quickActions = [
    {
        label: 'Suggest ideas',
        type: 'idea_suggestions',
        responseTitle: 'Idea Suggestions'
    },
    {
        label: 'Summarize progress',
        type: 'summary',
        responseTitle: 'Goal Summary'
    },
];

const actionMap = {
    idea_suggestions: {
        label: 'Suggest ideas',
        responseTitle: 'Idea Suggestions',
        requestText: "suggest some ideas",
    },
    summary: {
        label: 'Summarize progress',
        responseTitle: 'Goal Summary',
        requestText: "summarize progress",
    },
    custom_chat: {
        responseTitle: 'Custom Chat'
    },
};

function AIAssistant({ pendingAIMessage, setPendingAIMessage, isAIChatResGenerating }) {

    const { data: aiResponses, isPending: loadingResponses } = useAIAssistantResponses()
    const hasResponses = aiResponses?.length > 0;

    const { data: currentUser } = useAuth()
    const { mutate: askAI, isPending: isAIGenerating } = useAIAssistant()
    const { mutate: clearAllResponses, isPending: isClearing } = useClearAllAIResponses()

    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
        });
    }, [aiResponses?.length, isAIGenerating, pendingAIMessage]);

    /* -------------------------------------------------------------------------- */
    /* handle ask questions or suggestions to ai */
    /* -------------------------------------------------------------------------- */
    const handleAskAI = (type) => {
        setPendingAIMessage(actionMap[type].requestText)

        askAI({ type: type }, {
            onSettled: () => {
                setPendingAIMessage(null)
            }
        })
    }

    const handleClearResponses = () => {
        clearAllResponses()
    }

    return (
        <>
            {hasResponses ? (
                <AssistantToolbar
                    onAsk={handleAskAI}
                    onClear={handleClearResponses}
                    isLoading={isClearing}
                />
            ) : (
                <AssistantWelcome
                    onAsk={handleAskAI}
                />
            )}


            {loadingResponses && (
                <div className="rounded-xl border border-slate-200 bg-white p-4 animate-pulse">
                    <div className="space-y-3">
                        <div className="h-3 bg-slate-200 rounded w-3/4" />
                        <div className="h-3 bg-slate-200 rounded w-full" />
                        <div className="h-3 bg-slate-200 rounded w-5/6" />
                    </div>
                </div>
            )}

            <div className="p-4">
                {aiResponses?.map((response) => (
                    <AIResponse
                        key={response.id}
                        response={response}
                        currentUser={currentUser}
                    />
                ))}

                {
                    (pendingAIMessage) &&
                    <>

                        <ChatBubble
                            content={pendingAIMessage}
                            isMine
                            sender={currentUser}
                            createdAt={Date.now()}
                            className="mb-2"
                        />

                        <div className="rounded-xl border border-slate-200 bg-white p-4 animate-pulse mb-5">
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="w-4 h-4 text-[#378ADD]" />
                                <span className="text-sm font-medium text-gray-700">
                                    Thinking...
                                </span>
                            </div>

                            <div className="space-y-3">
                                <div className="h-3 bg-slate-200 rounded w-3/4" />
                                <div className="h-3 bg-slate-200 rounded w-full" />
                                <div className="h-3 bg-slate-200 rounded w-5/6" />
                            </div>
                        </div>
                    </>
                }


                <div ref={bottomRef} />
            </div>
        </>

    )
}

export default AIAssistant


/* -------------------------------------------------------------------------- */
/* sub components - AIResponse */
/* -------------------------------------------------------------------------- */
function AIResponse({ response, currentUser }) {
    const type = response.type

    return (
        <div className="mb-6">

            <ChatBubble
                content={type === 'custom_chat' ? response.requestText : actionMap[response.type].requestText}
                isMine
                showAvatar={false}
                showSender={false}
                className="mb-3"
            />

            {/* AI RESPONSE */}
            <AIResponseBubble
                response={response}
                actionMap={actionMap}
            />

        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* sub components - AssistantWelcome */
/* -------------------------------------------------------------------------- */

function AssistantWelcome({ onAsk }) {
    return (

        <div className='p-4'>
            <div className="mb-5">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#378ADD]" />

                    <h3 className="text-sm font-semibold text-gray-900">
                        Goal Assistant
                    </h3>
                </div>

                <p className="text-xs text-gray-500 mt-1">
                    Ask questions, generate summaries, and get recommendations for this goal.
                </p>

                <div className="mt-3 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    <Lock className="w-3.5 h-3.5 text-slate-500" />

                    <span className="text-[11px] text-slate-600">
                        Responses are visible only to you and won't appear in team discussions.
                    </span>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-5">
                {quickActions.map((item) => (
                    <button
                        key={item.type}
                        onClick={() => onAsk(item.type)}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-[#378ADD]/30 hover:bg-[#378ADD]/5 transition-colors"
                    >
                        {item.label}
                    </button>
                ))}
            </div>
        </div>

    );
}

/* -------------------------------------------------------------------------- */
/* sub components - AssistantToolbar */
/* -------------------------------------------------------------------------- */

function AssistantToolbar({ onAsk, onClear, isLoading }) {
    return (
        <div className="sticky top-0 z-10 p-4 bg-white/95 backdrop-blur-sm pb-3 mb-4 border-b border-slate-100">
            <div className="flex items-center justify-between py-2">

                <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#378ADD]" />

                    <span className="text-xs font-medium text-gray-700">
                        Goal Assistant
                    </span>
                </div>

                <div className="flex items-center">

                    <button
                        onClick={onClear}
                        className="text-[11px] font-medium text-red-500 hover:text-red-600 transition-colors"
                    >
                        {isLoading ? "Clearing.." : "Clear all"}

                    </button>
                </div>

            </div>

            <div className="flex flex-wrap gap-2">
                {quickActions.map((item) => (
                    <button
                        key={item.type}
                        onClick={() => onAsk(item.type)}
                        className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:border-[#378ADD]/30 hover:bg-[#378ADD]/5 transition-colors"
                    >
                        {item.label}
                    </button>
                ))}
            </div>
        </div>
    );
}