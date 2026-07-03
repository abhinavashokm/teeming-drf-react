import { useEffect, useRef, useState } from "react";
import MemberAvatar from "../team/MemberAvatar";
import useOnlineMembers from "../../hooks/workspace/useOnlineMembers";
import useAuth from "../../hooks/auth/useAuth";

const MAX_STACK = 4;
const MAX_VISIBLE_ROWS = 6;

export function PresenceIndicator() {

    const { data: currentUser } = useAuth()
    const { data: onlineMembers } = useOnlineMembers();

    const onlineUsers = (onlineMembers ?? []).filter(user => user.email !== currentUser.email);

    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    const onlineCount = onlineUsers.length;
    const needsScroll = onlineCount > MAX_VISIBLE_ROWS;
    const visibleStack = onlineUsers.slice(0, MAX_STACK);
    const overflowCount = onlineCount - visibleStack.length;

    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (onlineCount === 0) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={(e) => { setOpen(prev => !prev); e.stopPropagation(); }}
                className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
                <div className="flex items-center">
                    {visibleStack.map((user, i) => (
                        <div
                            key={user.id}
                            className="relative shrink-0 rounded-full"
                            style={{
                                marginLeft: i === 0 ? 0 : '-8px',
                                zIndex: visibleStack.length - i,
                            }}
                        >
                            <MemberAvatar user={user} size="xs" />
                            <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 border border-white" />
                        </div>
                    ))}
                    {overflowCount > 0 && (
                        <div
                            className="relative flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-[9px] font-semibold shrink-0"
                            style={{ marginLeft: '-8px', zIndex: visibleStack.length + 1 }}
                        >
                            +{overflowCount}
                        </div>
                    )}
                </div>
                <span className="text-[12px] font-medium text-gray-500 whitespace-nowrap">
                    {onlineCount} online
                </span>
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-[280px] bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                    <div className="px-4 py-3">
                        <h3 className="text-[11px] font-semibold text-gray-500 tracking-wider mb-2">
                            ONLINE — {onlineCount}
                        </h3>
                        <div
                            className={`space-y-2.5 ${needsScroll ? "max-h-[240px] overflow-y-auto" : ""}`}
                        >
                            {onlineUsers.map(user => (
                                <PresenceRow key={user.id} user={user} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function PresenceRow({ user }) {
    return (
        <div className="flex items-center gap-2.5">
            <div className="relative shrink-0">
                <MemberAvatar user={user} size="sm" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-medium text-gray-900 truncate leading-tight">
                    {user.fullName}
                </span>
                <span className="text-[11px] text-gray-400 truncate">
                    {user.email}
                </span>
            </div>
        </div>
    );
}