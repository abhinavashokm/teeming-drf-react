import { MessageSquare, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import MemberAvatar from "../../../../components/team/MemberAvatar";
import { useGroupDiscussionWS } from '../../../../contexts/GroupDiscussionWSContext';
import useAIAssistant from '../../../../hooks/ai/useAIAssistant';
import useAuth from "../../../../hooks/auth/useAuth";
import AIAssistant from './AIAssistant';
import GroupDiscussion from './GroupDiscussion';
import useWorkspace from '../../../../hooks/workspace/useWorkspace';
import useNavigateUpgradePlan from '../../../../hooks/routes/useNavigateUpgradePlan';

const aiMode = 'ai'
const discussionMode = 'discussion'

function RightPanel({ onClose, isMobile }) {

    const [mode, setMode] = useState(discussionMode);
    const [input, setInput] = useState('');
    const [pendingAIMessage, setPendingAIMessage] = useState(null);

    const { data: currentUser } = useAuth();
    const { sendMessage, onPanelOpen, onPanelClose } = useGroupDiscussionWS()

    const { mutate: askAI, isPending: isAIChatResGenerating } = useAIAssistant()

    const { data: currentWorkspace } = useWorkspace()
    const isAiAssistantInPlan = currentWorkspace.features?.aiAssistant

    const isAiBlocked = mode === aiMode && !isAiAssistantInPlan

    const goToUpgradePlan = useNavigateUpgradePlan();

    const handleSend = () => {
        if (!input.trim()) return;
        if (isAiBlocked) return;

        if (mode === discussionMode) {

            sendMessage(input.trim());

        } else if (mode === aiMode) {
            setPendingAIMessage(input);
            askAI({ type: "custom_chat", message: input.trim() }, {
                onSettled: () => {
                    setPendingAIMessage(null)
                }
            })
        }

        setInput('');
    };

    return (
        <div className="flex flex-col flex-1 min-h-0 bg-white">
            {/* Header */}
            {!isMobile && (
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-white/90 backdrop-blur-sm shrink-0">
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center bg-gray-100 p-1 rounded-lg">
                                <button
                                    onClick={() => setMode(discussionMode)}
                                    className={`px-3 py-1.5 text-xs rounded-md transition ${mode === discussionMode
                                        ? 'bg-white shadow text-gray-900'
                                        : 'text-gray-500'
                                        }`}
                                >
                                    Discussion
                                </button>

                                <span>
                                    <button
                                        onClick={() => setMode(aiMode)}
                                        className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-md transition ${mode === aiMode
                                            ? 'bg-white shadow text-gray-900'
                                            : 'text-gray-500'
                                            }`}
                                    >
                                        <Sparkles className="w-3 h-3" />
                                        Assistant
                                    </button>
                                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Main Panel */}
            <div className="flex-1 overflow-y-auto min-h-0  bg-slate-50/60">

                {mode === discussionMode ? (

                    <GroupDiscussion />

                ) : (

                    <AIAssistant
                        pendingAIMessage={pendingAIMessage}
                        setPendingAIMessage={setPendingAIMessage}
                        isAIChatResGenerating={isAIChatResGenerating}
                    />

                )}

            </div>

            {/* Composer */}
            <div className="shrink-0 px-4 py-3 bg-white border-t border-gray-200 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
                <div className="flex items-center gap-2.5">
                    <MemberAvatar
                        user={currentUser}
                        size="sm"
                    />

                    <div className={`flex-1 min-w-0 flex items-start bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 gap-2 focus-within:border-[#378ADD] focus-within:ring-2 focus-within:ring-[#378ADD]/10 transition-all ${isAiBlocked ? 'opacity-60' : ''}`}>
                        <textarea
                            placeholder={
                                isAiBlocked
                                    ? 'Upgrade your plan to ask AI...'
                                    : mode === discussionMode
                                        ? 'Share an update...'
                                        : 'Ask AI about this goal...'
                            }
                            value={input}
                            disabled={isAiBlocked}
                            onChange={(e) => {
                                setInput(e.target.value);
                                e.target.style.height = 'auto';
                                e.target.style.height = e.target.scrollHeight + 'px';
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    if (!isAiBlocked) handleSend();
                                }
                            }}
                            rows={1}
                            className="flex-1 min-w-0 bg-transparent text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none resize-none overflow-hidden leading-relaxed disabled:cursor-not-allowed"
                        />

                        {isAiBlocked ? (
                            <button
                                onClick={goToUpgradePlan}
                                className="shrink-0 flex items-center gap-1 px-3 py-1.5 bg-amber-500 text-white rounded-lg text-xs font-medium hover:bg-amber-600 transition-colors"
                            >
                                <Sparkles className="w-3 h-3" />
                                Upgrade
                            </button>
                        ) : input.trim() && (
                            <button
                                onClick={handleSend}
                                className="shrink-0 px-3 py-1.5 bg-[#378ADD] text-white rounded-lg text-xs font-medium hover:bg-[#2c71b6] transition-colors"
                            >
                                Send
                            </button>
                        )}
                    </div>

                    <button
                        onClick={() =>
                            setMode(prev => prev === aiMode ? discussionMode : aiMode)
                        }
                        className={`lg:hidden shrink-0 flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-full transition-colors ${mode === 'ai'
                            ? 'bg-[#378ADD] text-white'
                            : 'bg-[#378ADD]/10 text-[#378ADD] hover:bg-[#378ADD]/15'
                            }`}
                    >
                        {mode === aiMode ? (
                            <MessageSquare className="w-3.5 h-3.5" />
                        ) : (
                            <Sparkles className="w-3.5 h-3.5" />
                        )}

                        <span>
                            {mode === aiMode ? 'Chat' : 'Ask AI'}
                        </span>
                    </button>

                </div>
            </div>

        </div>
    );
}

export default RightPanel;