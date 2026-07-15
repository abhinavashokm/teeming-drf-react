import { format, isToday, isYesterday } from "date-fns";
import { MessageSquare } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';
import ChatBubble from '../../../../components/chat/ChatBubble';
import useAuth from "../../../../hooks/auth/useAuth";
import { buildChatTimeline } from '../../../../utils/chatUtils';
import { CHAT_ITEM_TYPES } from "../../../../constants/chatConstants";
import useGoalId from "../../../../hooks/params/useGoalId";
import { useGroupDiscussionWS } from "../../../../contexts/GroupDiscussionWSContext";


function GroupDiscussion() {

    const { messages, isLoading, loadMore, hasMore, isFetchingMore } = useGroupDiscussionWS()
    const { data: currentUser } = useAuth();

    const scrollRef = useRef(null)
    const prevScrollHeightRef = useRef(0)
    const isFirstLoad = useRef(true)

    const chatItems = useMemo(
        () => buildChatTimeline(messages),
        [messages]
    );

    /* ------------------------------------------------------------------ */
    /* Scroll to bottom on first load only                                 */
    /* ------------------------------------------------------------------ */
    const goalId = useGoalId()
    
    useEffect(() => {
        const el = scrollRef.current
        if (!el || !messages.length) return

        if (isFirstLoad.current) {
            el.scrollTop = el.scrollHeight
            isFirstLoad.current = false
            return
        }

        // After new live message — only scroll to bottom if already near bottom
        const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100
        if (isNearBottom) {
            el.scrollTop = el.scrollHeight
        }
    }, [messages, goalId])

    /* ------------------------------------------------------------------ */
    /* After prepend — restore scroll position so user doesn't jump        */
    /* ------------------------------------------------------------------ */
    useEffect(() => {
        const el = scrollRef.current
        if (!el || isFirstLoad.current) return

        const diff = el.scrollHeight - prevScrollHeightRef.current
        if (diff > 0 && prevScrollHeightRef.current > 0) {
            el.scrollTop = diff
            prevScrollHeightRef.current = 0  // reset after restore
        }
    }, [messages])

    /* ------------------------------------------------------------------ */
    /* Detect scroll near top → load more                                  */
    /* ------------------------------------------------------------------ */
    const handleScroll = () => {
        const el = scrollRef.current
        if (!el) return

        if (el.scrollTop < 80 && hasMore && !isFetchingMore) {
            prevScrollHeightRef.current = el.scrollHeight  // snapshot before fetch
            loadMore()
        }
    }

    return (
        // ✅ scroll container is now the outermost div
        <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex-1 h-full overflow-y-auto p-4"
        >
            {/* Load more indicator — top of list */}
            {isFetchingMore && (
                <div className="text-center py-2 text-sm text-gray-400">Loading...</div>
            )}
            {!hasMore && messages.length > 0 && (
                <div className="text-center py-2 text-sm text-gray-400">No more messages</div>
            )}

            {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                    <ChatBubble key={i} isLoading index={i} isMine={i % 3 === 1} />
                ))
            ) : messages?.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-6">
                    <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-5">
                        <MessageSquare className="w-10 h-10 text-blue-300" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900">No discussion yet</h3>
                    <p className="text-xs text-gray-500 mt-2 max-w-[240px] leading-relaxed">
                        Share updates, ask questions, and collaborate around this goal.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {chatItems?.map((item) => {
                        if (item.type === CHAT_ITEM_TYPES.DATE_DIVIDER) {
                            return (
                                <ChatDateDivider
                                    key={`${CHAT_ITEM_TYPES.DATE_DIVIDER}-${new Date(item.date).toDateString()}`}
                                    date={item.date}
                                />
                            );
                        }

                        const message = item.message
                        const isMe = message.sender.id === currentUser.id;

                        return (
                            <ChatBubble
                                key={message.id}
                                content={message.content}
                                createdAt={message.createdAt}
                                isMine={isMe}
                                sender={message.sender}
                                status={message.status}
                            />
                        );
                    })}
                </div>
            )}
        </div>
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


/* -------------------------------------------------------------------------- */
/* chat date divider */
/* -------------------------------------------------------------------------- */
const getDateLabel = (date) => {
    const d = new Date(date);

    if (isToday(d)) return "Today";
    if (isYesterday(d)) return "Yesterday";

    return format(d, "dd MMM yyyy");
};

function ChatDateDivider({ date }) {
    return (
        <div className="flex items-center justify-center my-4">
            <span className="px-3 py-1 text-xs text-gray-500 bg-gray-100 rounded-full">
                {getDateLabel(date)}
            </span>
        </div>
    )
}

