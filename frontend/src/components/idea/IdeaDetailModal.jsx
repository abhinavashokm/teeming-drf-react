import { Activity, AlertCircle, Check, CheckCircle2, ChevronRight, Flag, ThumbsUp } from 'lucide-react';
import { IDEA_STATUS } from '../../constants/ideaConstants.js';
import BaseModal from '../ui/modal/BaseModal';
import AppButton from '../ui/buttons/AppButton.jsx';
import useDeleteIdea from '../../hooks/idea/useDeleteIdea.js';


function IdeaDetailModal({ currentIdea, isOpen, onClose, onMove }) {
    if (!currentIdea) return null

    const ideaStatus = currentIdea.status

    const { mutate: deleteIdea, isPending } = useDeleteIdea()

    const handleDeleteIdea = () => {
        deleteIdea(currentIdea.id, {
            onSuccess: onClose
        })
    }


    return (
        <BaseModal isOpen={isOpen} onClose={onClose} >

            <BaseModal.Header onClose={onClose}>
                <div className="flex items-center gap-3">
                    {ideaStatus === IDEA_STATUS.DRAFT && (
                        <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-md text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                            <span className="text-[12px]">✋</span> IDEA
                        </span>
                    )}
                    {ideaStatus === IDEA_STATUS.IN_PROGRESS && (
                        <span className="px-2.5 py-1 bg-blue-50 text-[#378ADD] border border-[#378ADD]/30 rounded-md text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5" /> IN PROGRESS
                        </span>
                    )}
                    {ideaStatus === IDEA_STATUS.DONE && (
                        <span className="px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-md text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" /> DONE
                        </span>
                    )}
                </div>
            </BaseModal.Header>

            {/* Body */}
            <BaseModal.Body>
                <div className="mb-6">
                    <h2 className="text-[22px] font-bold text-gray-900 leading-tight mb-2">{currentIdea.title}</h2>
                    <div className="text-[13px] text-gray-500">
                        {ideaStatus === IDEA_STATUS.DRAFT && (
                            <>Added by {currentIdea.createdBy?.fullName || 'User'} · {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · Updated 2h ago</>
                        )}
                        {ideaStatus === IDEA_STATUS.IN_PROGRESS && (
                            <>Added by {currentIdea.createdBy?.fullName || 'User'} · {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · <span className="text-[#378ADD] font-medium">Updated 2h ago</span></>
                        )}
                        {ideaStatus === IDEA_STATUS.DONE && (
                            <>Added by <span className="font-medium text-gray-900">{currentIdea.createdBy?.fullName || 'User'}</span> · {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · <span className="text-green-600 font-medium">Completed Oct 15</span></>
                        )}
                    </div>
                </div>

                {/* Description Section */}
                <div className={`mb-6 p-4 rounded-xl ${ideaStatus === IDEA_STATUS.DRAFT ? 'border border-dashed border-gray-300 bg-gray-50/50' : ''}`}>
                    {ideaStatus === IDEA_STATUS.DRAFT && (
                        <div className="text-[11px] font-bold text-gray-400 tracking-widest uppercase mb-2">Description</div>
                    )}
                    <p className="text-[13px] text-gray-700 leading-relaxed">
                        {currentIdea.description || 'No description provided for this idea yet.'}
                    </p>
                </div>

                {/* Meta Section */}
                <div className={`border rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-6 ${ideaStatus === IDEA_STATUS.DRAFT ? 'border-dashed border-gray-300 bg-gray-50/50' : 'border-gray-200 bg-white'}`}>
                    {/* Meta Left */}
                    <div className="space-y-4">
                        <div>
                            <div className="text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-1.5">Created By</div>
                            <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-full ${currentIdea.assignee?.bgClass || 'bg-gray-100'} flex items-center justify-center text-[10px] font-bold ${currentIdea.assignee?.textClass || 'text-gray-600'}`}>
                                    {currentIdea.assignee?.initials || 'U'}
                                </div>
                                <span className="text-[13px] font-medium text-gray-900">{currentIdea.createdBy?.fullName || 'User'}</span>
                            </div>
                        </div>
                        <div>
                            <div className="text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-1.5">Created At</div>
                            <div className="text-[13px] text-gray-700">Oct 12, 2025 at 10:30 AM</div>
                        </div>
                        {ideaStatus === IDEA_STATUS.DRAFT && (
                            <div>
                                <div className="text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-1.5">Last Updated</div>
                                <div className="text-[13px] text-gray-700">2 hours ago</div>
                            </div>
                        )}
                        {(ideaStatus === IDEA_STATUS.IN_PROGRESS || ideaStatus === IDEA_STATUS.DONE) && (
                            <div>
                                <div className="text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-1.5">
                                    {ideaStatus === IDEA_STATUS.IN_PROGRESS ? 'Moved to In Progress By' : 'In Progress By'}
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-700">
                                        AJ
                                    </div>
                                    <span className="text-[13px] font-medium text-gray-900">Arjun</span>
                                </div>
                            </div>
                        )}
                        {ideaStatus === IDEA_STATUS.IN_PROGRESS && (
                            <div>
                                <div className="text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-1.5">Moved At</div>
                                <div className="text-[13px] text-gray-700">Oct 14, 2025 at 2:15 PM</div>
                            </div>
                        )}
                        {ideaStatus === IDEA_STATUS.DONE && (
                            <div>
                                <div className="text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-1.5">Marked as Done By</div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-[10px] font-bold text-purple-700">
                                        SM
                                    </div>
                                    <span className="text-[13px] font-medium text-gray-900">Sarah</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Meta Right */}
                    <div className="space-y-4">
                        <div>
                            <div className="text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-1.5">Status</div>
                            {ideaStatus === IDEA_STATUS.DRAFT && <span className="inline-block px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[12px] font-medium">Idea</span>}
                            {ideaStatus === IDEA_STATUS.IN_PROGRESS && <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[12px] font-medium">In Progress</span>}
                            {ideaStatus === IDEA_STATUS.DONE && <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 rounded text-[12px] font-medium">Done</span>}
                        </div>
                        {(ideaStatus === IDEA_STATUS.IN_PROGRESS || ideaStatus === IDEA_STATUS.DONE) && (
                            <div>
                                <div className="text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-1.5">Deadline</div>
                                {ideaStatus === IDEA_STATUS.IN_PROGRESS ? (
                                    <div className="flex items-center gap-2">
                                        <span className="text-[13px] text-gray-900">Oct 20, 2025</span>
                                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 border border-amber-100 px-1.5 py-0.5 rounded text-[11px] font-medium">
                                            <AlertCircle className="w-3 h-3" />
                                            6 days left
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span className="text-[13px] text-gray-900">Oct 20, 2025</span>
                                        <span className="inline-flex items-center gap-1 text-green-600 text-[12px] font-medium">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            Completed on time
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                        <div>
                            <div className="text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-1.5">Goal</div>
                            <div className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-[12px] font-medium">
                                <Flag className="w-3.5 h-3.5" />
                                {'Checkout Drop-off'}
                            </div>
                        </div>
                        {(ideaStatus === IDEA_STATUS.IN_PROGRESS || ideaStatus === IDEA_STATUS.DONE) && (
                            <div>
                                <div className="text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-1.5">Assigned To</div>
                                <div className="flex items-center gap-1.5">
                                    <div className="flex -space-x-1.5">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 ring-2 ring-white flex items-center justify-center text-[10px] font-bold text-blue-700 z-20">AJ</div>
                                        <div className="w-6 h-6 rounded-full bg-teal-100 ring-2 ring-white flex items-center justify-center text-[10px] font-bold text-teal-700 z-10">KL</div>
                                        {ideaStatus === IDEA_STATUS.DONE && (
                                            <div className="w-6 h-6 rounded-full bg-gray-100 ring-2 ring-white flex items-center justify-center text-[10px] font-bold text-gray-600 z-0">+1</div>
                                        )}
                                    </div>
                                    <span className="text-[13px] text-gray-600 ml-1">
                                        {ideaStatus === IDEA_STATUS.DONE ? 'Arjun, Kevin, +1' : 'Arjun, Kevin'}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </BaseModal.Body>

            <BaseModal.Footer className="justify-between flex-wrap gap-3">
                {ideaStatus !== IDEA_STATUS.DONE && (
                    <>
                        {/* Left — Delete/Drop */}
                        <div className="flex items-center gap-3">
                            {ideaStatus === IDEA_STATUS.DRAFT && (
                                <AppButton variant="danger" onClick={handleDeleteIdea} loading={isPending} >
                                    Delete
                                </AppButton>
                            )}
                            {ideaStatus === IDEA_STATUS.IN_PROGRESS && (
                                <AppButton variant="danger">
                                    Drop Idea
                                </AppButton>
                            )}
                        </div>

                        {/* Middle — Likes (hidden on mobile) */}
                        <div className="hidden sm:flex items-center gap-2">
                            <span className="text-[13px] font-medium text-gray-500 flex items-center gap-1.5">
                                <ThumbsUp className="w-4 h-4" /> {currentIdea.thumbsUp || 5}
                            </span>
                            <div className="flex -space-x-1.5">
                                <div className="w-5 h-5 rounded-full bg-purple-100 ring-2 ring-gray-50 flex items-center justify-center text-[8px] font-bold text-purple-700 z-30">SM</div>
                                <div className="w-5 h-5 rounded-full bg-amber-100 ring-2 ring-gray-50 flex items-center justify-center text-[8px] font-bold text-amber-700 z-20">TR</div>
                                <div className="w-5 h-5 rounded-full bg-gray-200 ring-2 ring-gray-50 flex items-center justify-center text-[8px] font-bold text-gray-600 z-10">+3</div>
                            </div>
                        </div>

                        {/* Right — Move/Done */}
                        <div className="flex items-center gap-3 ml-auto sm:ml-0">
                            {ideaStatus === IDEA_STATUS.DRAFT && (
                                <AppButton variant="primary" onClick={onMove}>
                                    Move to In Progress <ChevronRight className="w-4 h-4" />
                                </AppButton>
                            )}
                            {ideaStatus === IDEA_STATUS.IN_PROGRESS && (
                                <AppButton variant="primary" >
                                    Mark as Done <Check className="w-4 h-4" />
                                </AppButton>
                            )}
                        </div>
                    </>
                )}
            </BaseModal.Footer>
        </BaseModal >
    )
}

export default IdeaDetailModal