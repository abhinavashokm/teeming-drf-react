import { MessageSquare } from 'lucide-react';
import { useEffect, useRef } from 'react';
import MemberAvatar from "../../../../components/team/MemberAvatar";
import useAuth from "../../../../hooks/auth/useAuth";
import useDiscussion from '../../../../hooks/discussion/useDiscussion';
import { formatDateTime } from '../../../../utils/timeUtils';



function GroupDiscussion() {

    const { messages, sendMessage, isLoading } = useDiscussion();
    const { data: currentUser } = useAuth();

    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        sendMessage(input.trim());
        setInput('');
    };

    return (
        <div className="p-4">
            {messages?.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-6">
                    <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-5">
                        <MessageSquare className="w-10 h-10 text-blue-300" />
                    </div>

                    <h3 className="text-sm font-semibold text-gray-900">
                        No discussion yet
                    </h3>

                    <p className="text-xs text-gray-500 mt-2 max-w-[240px] leading-relaxed">
                        Share updates, ask questions, and collaborate around this goal.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {messages?.map((message) => {
                        const isMe = message.sender.id === currentUser.id;

                        return (
                            <div
                                key={message.id}
                                className={`flex gap-3 items-end ${isMe ? 'flex-row-reverse' : ''
                                    }`}
                            >
                                <MemberAvatar
                                    name={message.sender.fullName}
                                    email={message.sender.email}
                                    size="sm"
                                />

                                <div
                                    className={`flex flex-col gap-1 max-w-[78%] ${isMe ? 'items-end' : 'items-start'
                                        }`}
                                >
                                    {!isMe && (
                                        <span className="text-[11px] font-medium text-gray-500 px-1">
                                            {message.sender.fullName}
                                        </span>
                                    )}

                                    <div
                                        className={`px-4 py-2.5 text-[13px] leading-relaxed shadow-sm [overflow-wrap:anywhere]
                                                    ${isMe
                                                ? 'bg-[#378ADD] text-white rounded-2xl rounded-br-md'
                                                : 'bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-bl-md'
                                            }`}
                                    >
                                        {message.content}
                                    </div>

                                    {isMe ? (
                                        <div className="flex items-center gap-1 px-1">
                                            <span className="text-[11px] text-gray-400">
                                                {formatDateTime(message.createdAt)}
                                            </span>

                                            <MessageStatus status={message.status} />
                                        </div>
                                    ) : (
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
            )

            } </div>
    )
}

export default GroupDiscussion

/* -------------------------------------------------------------------------- */
/* Message status component */
/* -------------------------------------------------------------------------- */

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