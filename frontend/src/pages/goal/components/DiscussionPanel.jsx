import { Sparkles, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import MemberAvatar from "../../../components/team/MemberAvatar";
import useAuth from "../../../hooks/auth/useAuth";
import useDiscussion from '../../../hooks/discussion/useDiscussion';
import { formatDateTime } from '../../../utils/timeUtils';

const MessageStatus = ({ status='sent' }) => {
    if (status === 'sent') return (
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" className="inline-block">
            <path d="M1 5L4.5 8.5L10 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400" />
        </svg>
    )
    if (status === 'delivered') return (
        <svg width="18" height="10" viewBox="0 0 18 10" fill="none" className="inline-block">
            <path d="M1 5L4.5 8.5L10 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400" />
            <path d="M5 5L8.5 8.5L14 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400" />
        </svg>
    )
    return null;
}

function DiscussionPanel({ onClose, isMobile }) {

    const [input, setInput] = useState('')

    const { messages, sendMessage, isLoading } = useDiscussion()
    const { data: currentUser } = useAuth()


    const bottomRef = useRef(null);

    //automatically scroll to bottom
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;
        sendMessage(input.trim());
        setInput('');
    };


    if (isLoading) return <div className="p-4 text-sm text-gray-400">Loading...</div>;

    return (
        <div className="flex flex-col flex-1 min-h-0 bg-white">
            {/* Header — desktop only */}
            {!isMobile && (
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 shrink-0">
                    <h3 className="text-[13px] font-semibold text-gray-900">Discussion</h3>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
                        title="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* messages */}
            <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-3">
                {messages?.map(message => {
                    const isMe = message.sender.id === currentUser.id;
                    return (
                        <div key={message.id} className={`flex gap-2 items-end ${isMe ? 'flex-row-reverse' : ''}`}>

                            {/* Avatar */}
                            <MemberAvatar
                                name={message.sender.fullName}
                                email={message.sender.email}
                                size='sm'
                            />

                            {/* Bubble */}
                            <div className={`flex flex-col gap-1 max-w-[72%] ${isMe ? 'items-end' : 'items-start'}`}>

                                {/* Show sender name only for others */}
                                {!isMe && (
                                    <span className="text-[11px] text-gray-400 px-1">
                                        {message.sender.fullName}
                                    </span>
                                )}

                                <div className={`px-3 py-2 text-[13px] leading-relaxed break-words
                        ${isMe
                                        ? 'bg-blue-50 text-blue-950 rounded-2xl rounded-br-sm'
                                        : 'bg-gray-100 text-gray-800 rounded-2xl rounded-bl-sm border border-gray-100'
                                    }`}
                                >
                                    {message.content}
                                </div>
                                {isMe && (
                                    <div className="flex items-center gap-1 px-1">
                                        <span className="text-[11px] text-gray-400">
                                            {formatDateTime(message.createdAt)}
                                        </span>
                                        <MessageStatus status={message.status} />
                                    </div>
                                )}
                                {!isMe && (
                                    <span className="text-[11px] text-gray-400 px-1">
                                        {formatDateTime(message.createdAt)}
                                    </span>
                                )}


                            </div>
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            {/* Fixed input */}
            <div className="shrink-0 px-4 py-3 bg-white border-t border-gray-100">
                <div className="flex items-center gap-2.5">

                    <MemberAvatar name={currentUser.fullName} email={currentUser.email} size='sm' />

                    {/* Input */}
                    <div className="flex-1 flex items-start bg-gray-100 rounded-2xl px-4 py-2.5 gap-2">
                        <textarea
                            placeholder="Add a input..."
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value)
                                e.target.style.height = 'auto'
                                e.target.style.height = e.target.scrollHeight + 'px'
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            rows={1}
                            className="flex-1 bg-transparent text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none resize-none overflow-hidden leading-relaxed"
                        />
                        {input.trim() && (
                            <button onClick={handleSend} className="text-[#378ADD] text-[13px] font-semibold shrink-0 hover:text-[#2c71b6] transition-colors mt-0.5">
                                Post
                            </button>
                        )}
                    </div>

                    {/* AI toggle */}
                    <button className="p-1.5 text-gray-400 hover:text-[#378ADD] rounded-full hover:bg-[#378ADD]/8 transition-colors shrink-0" title="AI assist">
                        <Sparkles className="w-4 h-4" />
                    </button>
                </div>
            </div>

        </div>
    )
}

export default DiscussionPanel