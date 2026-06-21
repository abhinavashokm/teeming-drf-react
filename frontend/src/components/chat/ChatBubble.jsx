import MemberAvatar from "../team/MemberAvatar";
import {cn} from "../../utils/cn"
import { formatDateTime } from "../../utils/timeUtils";

function ChatBubble({
    content,
    createdAt,
    isMine = false,
    sender,
    status,
    showAvatar = true,
    showSender = true,
    children,
    className,
}) {
    return (
        <div
            className={cn(
                "flex gap-3 items-end",
                isMine && "flex-row-reverse",
                className
            )}
        >

            {showAvatar && sender && (
                <MemberAvatar
                    user={sender}
                    size="sm"
                />
            )}

            <div
                className={`flex flex-col gap-1 max-w-[78%] ${isMine ? 'items-end' : 'items-start'
                    }`}
            >
                {!isMine && showSender && sender && (
                    <span className="text-[11px] font-medium text-gray-500 px-1">
                        {sender.fullName}
                    </span>
                )}

                <div
                    className={`px-4 py-2.5 text-[13px] leading-relaxed shadow-sm [overflow-wrap:anywhere]
                    ${isMine
                            ? 'bg-[#378ADD] text-white rounded-2xl rounded-br-md'
                            : 'bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-bl-md'
                        }`}
                >
                    {content}
                </div>

                {children}

                {createdAt && (
                    isMine ? (
                        <div className="flex items-center gap-1 px-1">
                            <span className="text-[11px] text-gray-400">
                                {formatDateTime(createdAt)}
                            </span>

                            {status && (
                                <MessageStatus status={status} />
                            )}
                        </div>
                    ) : (
                        <span className="text-[11px] text-gray-400 px-1">
                            {formatDateTime(createdAt)}
                        </span>
                    )
                )}
            </div>
        </div>
    );
}

export default ChatBubble


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