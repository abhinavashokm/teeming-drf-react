import React from 'react'
import { Target, Calendar, Users, X, MessageSquare, Activity } from 'lucide-react'
import useGoal from '../../hooks/goal/useGoal'
import { dateToHuman } from '../../utils/timeUtils'

function GoalInfoModal({onClose}) {

    const { data: currentGoal } = useGoal()

    console.log(currentGoal)

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/50 p-0 md:p-4" onClick={() => setIsGoalInfoModalOpen(false)}>
            <div className="bg-white rounded-t-2xl md:rounded-2xl shadow-xl w-full md:max-w-lg overflow-hidden flex flex-col fixed md:relative bottom-0 md:bottom-auto inset-x-0 md:inset-x-auto h-[85vh] md:h-auto md:max-h-[90vh]" onClick={e => e.stopPropagation()}>
                {/* Mobile Drag Handle */}
                <div className="md:hidden w-full flex justify-center pt-3 pb-1 shrink-0 bg-white" onClick={() => setIsGoalInfoModalOpen(false)}>
                    <div className="w-10 h-1.5 bg-gray-300 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#378ADD] flex items-center justify-center text-white shadow-sm shrink-0">
                            <Target className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">{currentGoal.name}</h2>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100" onClick={onClose}>
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto scrollbar-hide">
                    <h3 className="text-[13px] font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-[14px] text-gray-600 leading-relaxed mb-6">
                        {currentGoal.description}
                    </p>

                    <h3 className="text-[13px] font-semibold text-gray-900 mb-3">Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2.5 text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <div className="flex flex-col">
                                <span className="text-[11px] text-gray-500 font-medium">Due Date</span>
                                <span className="text-[13px] font-semibold">{ currentGoal.targetDate ? dateToHuman(currentGoal.targetDate) : "No Due Date"}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2.5 text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <Users className="w-4 h-4 text-gray-400" />
                            <div className="flex flex-col">
                                <span className="text-[11px] text-gray-500 font-medium">Contributors</span>
                                <span className="text-[13px] font-semibold">0 Members</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2.5 text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <MessageSquare className="w-4 h-4 text-gray-400" />
                            <div className="flex flex-col">
                                <span className="text-[11px] text-gray-500 font-medium">Discussions</span>
                                <span className="text-[13px] font-semibold">0 Topics</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2.5 text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <Activity className="w-4 h-4 text-gray-400" />
                            <div className="flex flex-col">
                                <span className="text-[11px] text-gray-500 font-medium">Status</span>
                                <span className="text-[13px] font-semibold text-green-600">In Progress</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end mt-auto shrink-0">
                    <button
                        className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg text-[13px] hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}

export default GoalInfoModal