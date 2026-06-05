import { Calendar, ChevronRight, Lightbulb, Target, X, Zap, Check } from 'lucide-react'
import BaseModal from '../ui/modal/BaseModal'
import CancelButton from '../ui/buttons/CancelButton'
import AppButton from '../ui/buttons/AppButton'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Command } from 'cmdk'


function MoveToProgressModal({ isOpen, onClose, onMove, onBack, currentIdea }) {

    const { register, handleSubmit } = useForm()
    const [memberSearch, setMemberSearch] = useState('')

    const [selectedAssignees, setSelectedAssignees] = useState([])
    const [isAssigneeDropdownOpen, setIsAssigneeDropdownOpen] = useState(false)
    const [moveDeadline, setMoveDeadline] = useState('')

    const availableMembers = [
        { id: 1, name: 'Arjun', initials: 'AJ', role: 'Designer', bgClass: 'bg-blue-100', textClass: 'text-blue-700' },
        { id: 2, name: 'Sarah', initials: 'SM', role: 'Developer', bgClass: 'bg-purple-100', textClass: 'text-purple-700' },
        { id: 3, name: 'Kevin', initials: 'KL', role: 'PM', bgClass: 'bg-teal-100', textClass: 'text-teal-700' },
        { id: 4, name: 'Tom', initials: 'TR', role: 'Developer', bgClass: 'bg-amber-100', textClass: 'text-amber-700' },
    ]

    return (
        <BaseModal isOpen={isOpen} onClose={onClose}>

            <BaseModal.Header onClose={onClose}>
                <span className="px-2.5 py-1 bg-blue-50 text-[#378ADD] border border-[#378ADD]/20 rounded-md text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    Starting idea
                </span>
            </BaseModal.Header>

            <BaseModal.Body>
                <h2 className="hidden sm:block text-[20px] font-bold text-gray-900 mb-1">Move to In Progress</h2>
                <p className="hidden sm:block text-[13px] text-gray-500 mb-6">Assign this idea to team members and set a deadline</p>

                {/* Idea Preview */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                    <div className="bg-white border border-gray-200 rounded-lg p-1.5 mt-0.5 shrink-0">
                        <Lightbulb className="w-4 h-4 text-amber-500" />
                    </div>
                    <div>
                        <h3 className="text-[14px] font-bold text-gray-900 mb-0.5">{currentIdea?.title}</h3>
                        <p className="text-[12px] text-gray-500">Ideas · Added by {currentIdea?.createdBy?.fullName}</p>
                    </div>
                </div>

                {/* Assign To */}
<div className="mb-6">
    <div className="flex items-center justify-between mb-2">
        <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wider">Assign to *</label>
        {selectedAssignees.length > 0 && (
            <span className="text-[12px] text-gray-500 font-medium">{selectedAssignees.length} selected</span>
        )}
    </div>

    {/* Selected chips */}
    {selectedAssignees.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
            {selectedAssignees.map(user => (
                <div key={user.id} className="flex items-center gap-1.5 bg-blue-50 border border-[#378ADD]/30 rounded-md py-1 px-1.5">
                    <div className={`w-4 h-4 rounded-full ${user.bgClass} flex items-center justify-center text-[8px] font-bold ${user.textClass}`}>
                        {user.initials}
                    </div>
                    <span className="text-[12px] font-medium text-gray-700">{user.name}</span>
                    <button onClick={() => setSelectedAssignees(prev => prev.filter(u => u.id !== user.id))}>
                        <X className="w-3 h-3 text-gray-400 hover:text-red-500" />
                    </button>
                </div>
            ))}
        </div>
    )}

    {/* Combobox */}
    <Command className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <Command.Input
            placeholder="Search members..."
            className="w-full px-3.5 py-2.5 text-[13px] outline-none border-b border-gray-100"
        />
        <Command.List className="max-h-[108px] sm:max-h-[180px] overflow-y-auto">
            <Command.Empty className="py-6 text-center text-[13px] text-gray-400">
                No members found
            </Command.Empty>
            {availableMembers.map(user => {
                const isSelected = selectedAssignees.some(u => u.id === user.id)
                return (
                    <Command.Item
                        key={user.id}
                        value={user.name}
                        onSelect={() => {
                            if (isSelected) {
                                setSelectedAssignees(prev => prev.filter(u => u.id !== user.id))
                            } else {
                                setSelectedAssignees(prev => [...prev, user])
                            }
                        }}
                        className={`flex items-center justify-between px-3 py-2.5 cursor-pointer transition-colors ${
                            isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-7 h-7 rounded-full ${user.bgClass} flex items-center justify-center text-[10px] font-bold ${user.textClass}`}>
                                {user.initials}
                            </div>
                            <div>
                                <div className="text-[13px] font-semibold text-gray-900">{user.name}</div>
                                <div className="text-[11px] text-gray-500">{user.role}</div>
                            </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#378ADD]" />}
                    </Command.Item>
                )
            })}
        </Command.List>
    </Command>
</div>

                {/* Deadline */}
                <div>
                    <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wider mb-2">
                        Deadline <span className="text-gray-400 normal-case font-medium">(optional)</span>
                    </label>
                    <div className="relative">
                        <input
                            type="date"
                            value={moveDeadline}
                            onChange={(e) => setMoveDeadline(e.target.value)}
                            className={`w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13px] outline-none focus:border-[#378ADD] focus:ring-1 focus:ring-[#378ADD] transition-shadow shadow-sm ${!moveDeadline ? 'text-gray-400' : 'text-gray-900'}`}
                        />
                        <Calendar className={`w-4 h-4 absolute right-3.5 top-3 pointer-events-none ${moveDeadline ? 'text-[#378ADD]' : 'text-gray-400'}`} />
                    </div>
                </div>
            </BaseModal.Body>

            <BaseModal.Footer className="flex-col gap-3 sm:flex-row sm:justify-between">

                <div className="flex items-center gap-2 text-gray-500">
                    <Target className="w-4 h-4" />
                    <span className="text-[13px] font-medium truncate max-w-[200px]">
                        Checkout Drop-off
                    </span>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">

                    <CancelButton shadow onClick={onBack} text={"← Back"} />

                    <AppButton
                        shadow
                        variant="primary"
                        disabled={selectedAssignees.length === 0}
                        onClick={onMove}
                    >
                       Move to In Progress <ChevronRight className="w-4 h-4" />
                    </AppButton>
                </div>

            </BaseModal.Footer>

        </BaseModal>
    )
}

export default MoveToProgressModal