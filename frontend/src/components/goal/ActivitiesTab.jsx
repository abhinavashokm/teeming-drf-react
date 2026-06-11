
const initialActivities = [
    { id: 'a1', type: 'completed', user: { initials: 'SM', name: 'Sara', bgClass: 'bg-purple-100', textClass: 'text-purple-700' }, target: 'Identify drop-off points', dateGroup: 'TODAY', time: '10:31 am' },
    { id: 'a2', type: 'moved', user: { initials: 'AJ', name: 'Arjun', bgClass: 'bg-blue-100', textClass: 'text-blue-700' }, target: 'Write copy for new flow', destination: 'Ongoing', dateGroup: 'TODAY', time: '9:15 am' },
    { id: 'a3', type: 'commented', user: { initials: 'KL', name: 'Kiran', bgClass: 'bg-teal-100', textClass: 'text-teal-700' }, target: 'Redesign payment step UI', dateGroup: 'YESTERDAY', time: '4:45 pm' },
    { id: 'a4', type: 'updated_outcome', user: { initials: 'SM', name: 'Sara', bgClass: 'bg-purple-100', textClass: 'text-purple-700' }, target: 'Drop-off Reduced', dateGroup: 'YESTERDAY', time: '2:30 pm' },
    { id: 'a5', type: 'added_task', user: { initials: 'AJ', name: 'Arjun', bgClass: 'bg-blue-100', textClass: 'text-blue-700' }, target: 'Deploy to production', dateGroup: 'June 1', time: '11:20 am' },
    { id: 'a6', type: 'joined', user: { initials: 'SM', name: 'Sara', bgClass: 'bg-purple-100', textClass: 'text-purple-700' }, dateGroup: 'June 1', time: '9:00 am' }
];

function ActivitiesTab() {
    return (
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
    )
}

export default ActivitiesTab