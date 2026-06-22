import { MessageSquare } from 'lucide-react';
import { useGroupDiscussionWS } from '../../contexts/GroupDiscussionWSContext';

function RightPanelToggleBtn({ onOpen }) {

    const { unreadCount } = useGroupDiscussionWS()

    return (
        <button
            className="fixed min-[865px]:absolute bottom-6 right-6 w-14 h-14 bg-[#378ADD] text-white rounded-full shadow-[0_4px_14px_rgba(55,138,221,0.4)] flex items-center justify-center hover:bg-[#2c71b6] transition-colors z-40"
            onClick={onOpen}
        >
            {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-red-500 text-white text-[10px] font-semibold rounded-full flex items-center justify-center border-2 border-white">
                    {unreadCount > 99 ? "99+" : unreadCount}
                </span>
            )}

            <MessageSquare className="w-6 h-6" />
        </button>
    )
}

export default RightPanelToggleBtn