import { Activity, Calendar, MessageSquare, Target, Users } from 'lucide-react'
import useGoal from '../../hooks/goal/useGoal'
import { formatDate } from '../../utils/timeUtils'
import BaseModal from '../ui/modal/BaseModal'

function GoalInfoModal({ isOpen, onClose }) {

    const { data: currentGoal } = useGoal()

    if (!currentGoal) return null

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} size="md">

            <BaseModal.Header onClose={onClose}>
                <div className="w-10 h-10 rounded-lg bg-[#378ADD] flex items-center justify-center text-white shadow-sm shrink-0">
                    <Target className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 truncate">{currentGoal.name}</h2>
            </BaseModal.Header>

            <BaseModal.Body>
                <h3 className="text-[13px] font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-[14px] text-gray-600 leading-relaxed mb-6">
                    {currentGoal.description || 'No description provided.'}
                </p>

                <h3 className="text-[13px] font-semibold text-gray-900 mb-3">Details</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2.5 text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                        <div className="flex flex-col min-w-0">
                            <span className="text-[11px] text-gray-500 font-medium">Due Date</span>
                            <span className="text-[13px] font-semibold truncate">
                                {currentGoal.targetDate ? formatDate(currentGoal.targetDate) : 'No Due Date'}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5 text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <Users className="w-4 h-4 text-gray-400 shrink-0" />
                        <div className="flex flex-col min-w-0">
                            <span className="text-[11px] text-gray-500 font-medium">Contributors</span>
                            <span className="text-[13px] font-semibold">0 Members</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5 text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <MessageSquare className="w-4 h-4 text-gray-400 shrink-0" />
                        <div className="flex flex-col min-w-0">
                            <span className="text-[11px] text-gray-500 font-medium">Discussions</span>
                            <span className="text-[13px] font-semibold">0 Topics</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5 text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <Activity className="w-4 h-4 text-gray-400 shrink-0" />
                        <div className="flex flex-col min-w-0">
                            <span className="text-[11px] text-gray-500 font-medium">Status</span>
                            <span className="text-[13px] font-semibold text-green-600">In Progress</span>
                        </div>
                    </div>
                </div>
            </BaseModal.Body>

            <BaseModal.Footer>
                <button
                    className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg text-[13px] hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
                    onClick={onClose}
                >
                    Close
                </button>
            </BaseModal.Footer>

        </BaseModal>
    )
}

export default GoalInfoModal