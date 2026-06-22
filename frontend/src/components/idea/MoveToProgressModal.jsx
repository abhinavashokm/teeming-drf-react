import { Command } from 'cmdk'
import { Check, ChevronRight, Lightbulb, Target, X, Zap } from 'lucide-react'
import { useState } from 'react'
import useTeamMembers from '../../hooks/team/useTeamMembers'
import MemberAvatar from '../team/MemberAvatar'
import AppButton from '../ui/buttons/AppButton'
import CancelButton from '../ui/buttons/CancelButton'
import BaseModal from '../ui/modal/BaseModal'
import useMoveIdeaToProgress from '../../hooks/idea/useMoveIdeaToProgress'


function MoveToProgressModal({ isOpen, onClose, onBack, currentIdea }) {


    const { data: availableMembers = [] } = useTeamMembers()
    const { mutate: moveToProgress, isPending } = useMoveIdeaToProgress()


    const [selectedMembers, setSelectedMembers] = useState([])
    const [deadline, setDeadline] = useState(null)


    const handleMoveToProgress = () => {

        const data =  {'assignees': selectedMembers.map(member => member.userId)}

        if(deadline){
            data.deadline = deadline
        }

        moveToProgress({data: data, ideaId: currentIdea.id}, {
            onSuccess: () => {
                setSelectedMembers([])
                setDeadline(null)
                onClose()
            }
        })
    }

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
                        {selectedMembers.length > 0 && (
                            <span className="text-[12px] text-gray-500 font-medium">{selectedMembers.length} selected</span>
                        )}
                    </div>

                    {/* Selected chips */}
                    {selectedMembers.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                            {selectedMembers.map(member => (
                                <div key={member.id} className="flex items-center gap-1.5 bg-blue-50 border border-[#378ADD]/30 rounded-md py-1 px-1.5">
                                    
                                    <MemberAvatar user={member} size="sm" />

                                    <span className="text-[12px] font-medium text-gray-700">{member.fullName}</span>
                                    <button onClick={() => setSelectedMembers(prev => prev.filter(u => u.id !== member.id))}>
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
                            {availableMembers.map(member => {
                                const isSelected = selectedMembers.some(u => u.id === member.id)
                                return (
                                    <Command.Item
                                        key={member.id}
                                        value={member.fullName}
                                        onSelect={() => {
                                            if (isSelected) {
                                                setSelectedMembers(prev => prev.filter(u => u.id !== member.id))
                                            } else {
                                                setSelectedMembers(prev => [...prev, member])
                                            }
                                        }}
                                        className={`flex items-center justify-between px-3 py-2.5 cursor-pointer transition-colors ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">

                                            <MemberAvatar
                                                user={member} size="sm"
                                            />

                                            <div>
                                                <div className="text-[13px] font-semibold text-gray-900">{member.fullName}</div>
                                                <div className="text-[11px] text-gray-500">{member.role}</div>
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
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className={`w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13px] outline-none focus:border-[#378ADD] focus:ring-1 focus:ring-[#378ADD] transition-shadow shadow-sm ${!deadline ? 'text-gray-400' : 'text-gray-900'}`}
                        />
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
                        disabled={selectedMembers.length === 0}
                        onClick={handleMoveToProgress}
                        loading={isPending}
                    >
                        Move to In Progress <ChevronRight className="w-4 h-4" />
                    </AppButton>
                </div>

            </BaseModal.Footer>

        </BaseModal>
    )
}

export default MoveToProgressModal