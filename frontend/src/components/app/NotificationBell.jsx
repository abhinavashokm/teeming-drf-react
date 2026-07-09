import { Bell, CheckCheck, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from "react";
import { useNotificationSocket } from "../../hooks/notification/useNotificationSocket";
import useNotifications from '../../hooks/notification/useNotifications';
import useMarkAllNotificationAsRead from '../../hooks/notification/useMarkAllNotificationAsRead';
import useClearAllNotifications from '../../hooks/notification/useClearAllNotifications';
import { useWorkspaceSocketContext } from '../../contexts/WorkspaceSocketContext';
import { resolveNotificationLink } from '../../utils/notificationUtils';
import useWorkspace from '../../hooks/workspace/useWorkspace'
import { useNavigate } from 'react-router-dom';
import useMarkNotificationAsRead from '../../hooks/notification/useMarkNotificationAsRead';

export function NotificationBell() {

    //web socket connection
    const { notifications: wsNotifications } = useWorkspaceSocketContext();

    const { data: allNotifications } = useNotifications();
    const { mutate: markAllAsRead } = useMarkAllNotificationAsRead();
    const { mutate: clearAll } = useClearAllNotifications();

    const [open, setOpen] = useState(false);
    const [localNotifications, setLocalNotifications] = useState([]);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (allNotifications) {
            setLocalNotifications(allNotifications);
        }
    }, [allNotifications]);

    useEffect(() => {
        if (!wsNotifications?.length) return;
        setLocalNotifications(prev => {
            const existingIds = new Set(prev.map(n => n.id));
            const newOnes = wsNotifications.filter(n => !existingIds.has(n.id));
            return newOnes.length ? [newOnes[0], ...prev] : prev;
        });
    }, [wsNotifications]);

    const unread = localNotifications.filter(n => !n.isRead);
    const read = localNotifications.filter(n => n.isRead);
    const unreadCount = unread.length;

    const handleMarkAllRead = () => {
        setLocalNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        markAllAsRead();
    };

    const handleClearAll = () => {
        setLocalNotifications([]);
        clearAll();
    };

    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative z-50" ref={dropdownRef}>
            <button
                onClick={(e) => { setOpen(prev => !prev); e.stopPropagation(); }}
                className="relative p-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors z-40"
            >
                <Bell className="h-[17px] w-[17px]" strokeWidth={1.5} />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-[340px] bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">

                    {/* Header */}
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h3 className="text-[13px] font-semibold text-gray-900">Notifications</h3>
                            {unreadCount > 0 && (
                                <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[11px] font-semibold rounded-md">
                                    {unreadCount} new
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllRead}
                                    className="flex items-center gap-1 text-[12px] text-blue-500 hover:text-blue-600 font-medium transition-colors"
                                >
                                    <CheckCheck className="w-3.5 h-3.5" />
                                    Mark all read
                                </button>
                            )}
                            {localNotifications.length > 0 && (
                                <button
                                    onClick={handleClearAll}
                                    className="flex items-center gap-1 text-[12px] text-gray-400 hover:text-red-500 font-medium transition-colors"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Clear all
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="max-h-[360px] overflow-y-auto">
                        {localNotifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-2">
                                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                                    <Bell className="h-4 w-4 text-gray-400" strokeWidth={1.5} />
                                </div>
                                <p className="text-[13px] text-gray-400 font-medium">No notifications</p>
                                <p className="text-[12px] text-gray-300">You're all caught up</p>
                            </div>
                        ) : (
                            <>
                                {/* Unread */}
                                {unread.length > 0 && (
                                    <div>
                                        {unread.map((n, i) => (
                                            <NotificationRow key={n.id ?? i} n={n} onNavigate={() => setOpen(false)} />
                                        ))}
                                    </div>
                                )}

                                {/* Divider between unread and read */}
                                {unread.length > 0 && read.length > 0 && (
                                    <div className="flex items-center gap-3 px-4 py-2">
                                        <div className="flex-1 h-px bg-gray-100" />
                                        <span className="text-[11px] text-gray-400 font-medium">Earlier</span>
                                        <div className="flex-1 h-px bg-gray-100" />
                                    </div>
                                )}

                                {/* Read */}
                                {read.length > 0 && (
                                    <div>
                                        {read.map((n, i) => (
                                            <NotificationRow key={n.id ?? i} n={n} onNavigate={() => setOpen(false)} />
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function NotificationRow({ n, onNavigate }) {

    /* -------------------------------------------------------------------------- */
    /* handle click notification item */
    /* -------------------------------------------------------------------------- */
    const { data: currentWorkspace } = useWorkspace()
    const { mutate: markAsRead } = useMarkNotificationAsRead()
    const navigate = useNavigate()

    const handleClickItem = () => {
        const link = currentWorkspace ? resolveNotificationLink(n, currentWorkspace.slug) : null;
        if (link) {
            navigate(link);
            onNavigate?.();
        }
        if (!n.isRead) {
            markAsRead(n.id)
        }
    };

    const timeAgo = formatTimeAgo(n.createdAt);

    return (
        <div
            onClick={handleClickItem}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClickItem(); }}
            className={`px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 cursor-pointer ${!n.isRead ? 'bg-blue-50/40' : ''}`}
        >
            <div className="flex items-start gap-2.5">
                <div className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${!n.isRead ? 'bg-blue-500' : 'bg-transparent'}`} />
                <div className="flex-1 min-w-0">
                    <p className={`text-[13px] leading-snug ${!n.isRead ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                        {n.message}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] text-gray-400">{n.workspace}</span>
                        {timeAgo && (
                            <>
                                <span className="text-gray-200">·</span>
                                <span className="text-[11px] text-gray-400">{timeAgo}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function formatTimeAgo(date) {
    if (!date) return null;
    const now = new Date();
    const d = new Date(date);
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}