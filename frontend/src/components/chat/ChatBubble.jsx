import MemberAvatar from "../team/MemberAvatar";
import {cn} from "../../utils/cn"
import { formatTimeAgo } from "../../utils/timeUtils";

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
    isLoading=false,
    index=0,
}) {
    if (isLoading) {
        return (
            <ChatBubbleSkeleton
                isMine={isMine}
                index={index}
                showAvatar={showAvatar}
                className={className}
            />
        );
    }

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
                                {formatTimeAgo(createdAt)}
                            </span>

                            {status && (
                                <MessageStatus status={status} />
                            )}
                        </div>
                    ) : (
                        <span className="text-[11px] text-gray-400 px-1">
                            {formatTimeAgo(createdAt)}
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

/* -------------------------------------------------------------------------- */
/* chat bubble skelton for loading state */
/* -------------------------------------------------------------------------- */
const WIDTHS = ['w-32', 'w-44', 'w-28', 'w-52', 'w-36', 'w-40'];

function ChatBubbleSkeleton({ isMine = false, index = 0, showAvatar = true, className }) {
    const width = WIDTHS[index % WIDTHS.length];

    return (
        <div
            className={cn(
                "flex gap-3 items-end animate-pulse",
                isMine && "flex-row-reverse",
                className
            )}
        >
            {showAvatar && (
                <div className="w-7 h-7 rounded-full bg-gray-200 shrink-0" />
            )}

            <div className={`flex flex-col gap-1 max-w-[78%] ${isMine ? 'items-end' : 'items-start'}`}>
                {!isMine && (
                    <div className="h-2.5 w-16 rounded bg-gray-200 mx-1" />
                )}

                <div
                    className={cn(
                        "h-9 rounded-2xl bg-gray-200",
                        width,
                        isMine ? 'rounded-br-md' : 'rounded-bl-md'
                    )}
                />

                <div className="h-2 w-10 rounded bg-gray-100 mx-1" />
            </div>
        </div>
    );
}