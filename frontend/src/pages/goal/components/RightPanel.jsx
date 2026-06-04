import { Paperclip, X } from 'lucide-react';
import { useState } from 'react';

function RightPanel({ onClose }) {
    const [activeRightPanelTab, setActiveRightPanelTab] = useState('discussion');

const initialActivities = [
    { id: 'a1', type: 'completed', user: { initials: 'SM', name: 'Sara', bgClass: 'bg-purple-100', textClass: 'text-purple-700' }, target: 'Identify drop-off points', dateGroup: 'TODAY', time: '10:31 am' },
    { id: 'a2', type: 'moved', user: { initials: 'AJ', name: 'Arjun', bgClass: 'bg-blue-100', textClass: 'text-blue-700' }, target: 'Write copy for new flow', destination: 'Ongoing', dateGroup: 'TODAY', time: '9:15 am' },
    { id: 'a3', type: 'commented', user: { initials: 'KL', name: 'Kiran', bgClass: 'bg-teal-100', textClass: 'text-teal-700' }, target: 'Redesign payment step UI', dateGroup: 'YESTERDAY', time: '4:45 pm' },
    { id: 'a4', type: 'updated_outcome', user: { initials: 'SM', name: 'Sara', bgClass: 'bg-purple-100', textClass: 'text-purple-700' }, target: 'Drop-off Reduced', dateGroup: 'YESTERDAY', time: '2:30 pm' },
    { id: 'a5', type: 'added_task', user: { initials: 'AJ', name: 'Arjun', bgClass: 'bg-blue-100', textClass: 'text-blue-700' }, target: 'Deploy to production', dateGroup: 'June 1', time: '11:20 am' },
    { id: 'a6', type: 'joined', user: { initials: 'SM', name: 'Sara', bgClass: 'bg-purple-100', textClass: 'text-purple-700' }, dateGroup: 'June 1', time: '9:00 am' }
];

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Tabs */}
            <div className="flex items-center px-5 pt-4 border-b border-gray-200 bg-white shrink-0 relative pr-12">
                <button
                    onClick={onClose}
                    className="absolute right-3 top-3 p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors z-10"
                    title="Close Panel"
                >
                    <X className="w-4 h-4" />
                </button>

                <button
                    onClick={() => setActiveRightPanelTab('discussion')}
                    className={`flex-1 pb-3 text-[13px] font-semibold border-b-[2px] transition-colors ${activeRightPanelTab === 'discussion'
                            ? 'border-[#378ADD] text-[#378ADD]'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Discussion (12)
                </button>

                <button
                    onClick={() => setActiveRightPanelTab('activities')}
                    className={`flex-1 pb-3 text-[13px] font-semibold border-b-[2px] transition-colors ${activeRightPanelTab === 'activities'
                            ? 'border-[#378ADD] text-[#378ADD]'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Activities (28)
                </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 flex flex-col bg-white overflow-hidden">
                {activeRightPanelTab === 'discussion' ? (
                    <div className="flex flex-col h-full">
                        {/* Comments List */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-6">
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-[11px] font-medium shrink-0">
                                    SM
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[13px] font-semibold text-gray-900">Sarah Miller</span>
                                        <span className="text-[11px] text-gray-500">2h ago</span>
                                    </div>
                                    <div className="bg-gray-50 rounded-2xl rounded-tl-none p-3 border border-gray-100">
                                        <p className="text-[13px] text-gray-700 leading-relaxed">
                                            I've reviewed the latest session recordings. It seems a lot of users are dropping off when asked to create an account before checkout. Maybe we should introduce a guest checkout option?
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-[11px] font-medium shrink-0">
                                    TR
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[13px] font-semibold text-gray-900">Tom Riddle</span>
                                        <span className="text-[11px] text-gray-500">Yesterday</span>
                                    </div>
                                    <div className="bg-gray-50 rounded-2xl rounded-tl-none p-3 border border-gray-100">
                                        <p className="text-[13px] text-gray-700 leading-relaxed">
                                            Agreed. Guest checkout could be a quick win. I'll mock up some designs for the flow.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Comment Input */}
                        <div className="shrink-0 p-5 pt-0 bg-white">
                            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#378ADD]/20 focus-within:border-[#378ADD] transition-all shadow-sm">
                                <textarea
                                    placeholder="Write a comment..."
                                    className="w-full p-3 text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none resize-none min-h-[80px]"
                                ></textarea>
                                <div className="bg-gray-50 px-3 py-2 flex items-center justify-between border-t border-gray-100">
                                    <button className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-md hover:bg-gray-200/50">
                                        <Paperclip className="w-4 h-4" />
                                    </button>
                                    <button className="bg-[#378ADD] hover:bg-[#2c71b6] text-white px-3 py-1.5 rounded-lg text-[12px] font-medium flex items-center gap-2 transition-colors">
                                        Post
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : activeRightPanelTab === 'activities' ? (
                    <div className="flex-1 overflow-y-auto p-5">
                        <div className="space-y-7 pb-6">
                            {Object.entries(
                                initialActivities.reduce((acc, act) => {
                                    if (!acc[act.dateGroup]) acc[act.dateGroup] = [];
                                    acc[act.dateGroup].push(act);
                                    return acc;
                                }, {})
                            ).map(([dateGroup, items]) => (
                                <div key={dateGroup}>
                                    {/* Date Group Header */}
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="h-px bg-gray-100 flex-1"></div>
                                        <span className="text-[11px] font-bold text-gray-400 tracking-widest uppercase">{dateGroup}</span>
                                        <div className="h-px bg-gray-100 flex-1"></div>
                                    </div>

                                    {/* Activities Feed */}
                                    <div className="space-y-5">
                                        {items.map(activity => (
                                            <div key={activity.id} className="flex gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${activity.user.bgClass} ${activity.user.textClass}`}>
                                                    {activity.user.initials}
                                                </div>
                                                <div className="flex-1 pt-0.5">
                                                    <p className="text-[13px] text-gray-700 leading-snug">
                                                        <span className="font-semibold text-gray-900">{activity.user.name}</span>
                                                        {' '}
                                                        {activity.type === 'completed' && (
                                                            <>completed <button className="text-[#378ADD] hover:underline font-medium text-left">{activity.target}</button> ✅</>
                                                        )}
                                                        {activity.type === 'moved' && (
                                                            <>moved <button className="text-[#378ADD] hover:underline font-medium text-left">{activity.target}</button> → {activity.destination}</>
                                                        )}
                                                        {activity.type === 'commented' && (
                                                            <>commented on <button className="text-[#378ADD] hover:underline font-medium text-left">{activity.target}</button></>
                                                        )}
                                                        {activity.type === 'updated_outcome' && (
                                                            <>updated outcome metric <button className="text-[#378ADD] hover:underline font-medium text-left">{activity.target}</button></>
                                                        )}
                                                        {activity.type === 'added_task' && (
                                                            <>added task <button className="text-[#378ADD] hover:underline font-medium text-left">{activity.target}</button></>
                                                        )}
                                                        {activity.type === 'joined' && (
                                                            <>joined this goal 🚩</>
                                                        )}
                                                    </p>
                                                    <p className="text-[11px] text-gray-400 mt-0.5">{activity.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    )
}

export default RightPanel



