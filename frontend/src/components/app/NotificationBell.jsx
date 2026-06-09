import {
    Bell
} from 'lucide-react';
import { useEffect, useRef, useState } from "react";
import { useNotifications } from "../../hooks/notification/useNotifications";


const DUMMY = [
    { id: 1, message: "Abhinav created a new idea: Launch dark mode", workspace: "manu-world", is_read: false, created_at: new Date() },
    { id: 2, message: "Abhinav created a new idea: Add kanban board", workspace: "manu-world", is_read: false, created_at: new Date() },
    { id: 3, message: "Abhinav created a new idea: Improve onboarding flow", workspace: "manu-world", is_read: true, created_at: new Date() },
];


export function NotificationBell() {
    
    const { notifications: wsNotifications } = useNotifications();

    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    const notifications = wsNotifications.length > 0 ? wsNotifications : DUMMY; // use dummy if no real data

    const unreadCount = notifications.length;

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
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={(e) => { setOpen((prev) => !prev); console.log("clicked", open); e.stopPropagation(); }}
                className="relative p-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
            >
                <Bell className="h-[17px] w-[17px]" strokeWidth={1.5} />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                        {notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10">
                                <Bell className="h-[17px] w-[17px]" strokeWidth={1.5} />
                                <p className="text-sm text-gray-400">No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map((n, i) => (
                                <div key={n.id ?? i} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                                    <p className="text-sm text-gray-800">{n.message}</p>
                                    <p className="text-xs text-gray-400 mt-1">{n.workspace}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}