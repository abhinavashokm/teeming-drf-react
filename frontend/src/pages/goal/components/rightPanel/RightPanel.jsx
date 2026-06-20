import { MessageSquare, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import MemberAvatar from "../../../../components/team/MemberAvatar";
import useAuth from "../../../../hooks/auth/useAuth";
import AIAssistant from './AIAssistant';
import GroupDiscussion from './GroupDiscussion';

const MessageStatus = ({ status = 'sent' }) => {
    if (status === 'sent') return (
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" className="inline-block">
            <path d="M1 5L4.5 8.5L10 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/80" />
        </svg>
    )

    if (status === 'delivered') return (
        <svg width="18" height="10" viewBox="0 0 18 10" fill="none" className="inline-block">
            <path d="M1 5L4.5 8.5L10 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/80" />
            <path d="M5 5L8.5 8.5L14 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/80" />
        </svg>
    )

    return null;
};

function DiscussionPanel({ onClose, isMobile }) {

    const [mode, setMode] = useState('discussion');
    const [input, setInput] = useState('');

    const { data: currentUser } = useAuth();


    const handleSend = () => {
        if (!input.trim()) return;

        sendMessage(input.trim());
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
                                    onClick={() => setMode('discussion')}
                                    className={`px-3 py-1.5 text-xs rounded-md transition ${mode === 'discussion'
                                        ? 'bg-white shadow text-gray-900'
                                        : 'text-gray-500'
                                        }`}
                                >
                                    Discussion
                                </button>

                                <button
                                    onClick={() => setMode('ai')}
                                    className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-md transition ${mode === 'ai'
                                        ? 'bg-white shadow text-gray-900'
                                        : 'text-gray-500'
                                        }`}
                                >
                                    <Sparkles className="w-3 h-3" />
                                    Assistant
                                </button>
                            </div>
                        </div>

                        {/* <p className="text-[11px] text-gray-500 mt-0.5">
                            {messages?.length || 0} messages
                        </p> */}
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

                {mode === 'discussion' ? (

                    <GroupDiscussion />

                ) : (

                    <AIAssistant />

                )}

            </div>

            {/* Composer */}
            <div className="shrink-0 px-4 py-3 bg-white border-t border-gray-200 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
                <div className="flex items-center gap-2.5">
                    <MemberAvatar
                        name={currentUser.fullName}
                        email={currentUser.email}
                        size="sm"
                    />

                    <div className="flex-1 min-w-0 flex items-start bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 gap-2 focus-within:border-[#378ADD] focus-within:ring-2 focus-within:ring-[#378ADD]/10 transition-all">
                        <textarea
                            placeholder="Share an update..."
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value);
                                e.target.style.height = 'auto';
                                e.target.style.height = e.target.scrollHeight + 'px';
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            rows={1}
                            className="flex-1 min-w-0 bg-transparent text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none resize-none overflow-hidden leading-relaxed"
                        />

                        {input.trim() && (
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
                            setMode(prev => prev === 'ai' ? 'discussion' : 'ai')
                        }
                        className={`lg:hidden shrink-0 flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-full transition-colors ${mode === 'ai'
                            ? 'bg-[#378ADD] text-white'
                            : 'bg-[#378ADD]/10 text-[#378ADD] hover:bg-[#378ADD]/15'
                            }`}
                    >
                        {mode === 'ai' ? (
                            <MessageSquare className="w-3.5 h-3.5" />
                        ) : (
                            <Sparkles className="w-3.5 h-3.5" />
                        )}

                        <span>
                            {mode === 'ai' ? 'Chat' : 'Ask AI'}
                        </span>
                    </button>

                </div>
            </div>

        </div>
    );
}

export default DiscussionPanel;