import { AlertCircle, CheckCircle2, MoreHorizontal, Pencil, ThumbsUp, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { IDEA_STATUS } from '../../constants/ideaConstants.js'
import { PERMISSIONS } from '../../constants/permissions.js'
import useAuth from '../../hooks/auth/useAuth.js'
import useDeleteIdea from '../../hooks/idea/useDeleteIdea.js'
import { useCan } from '../../hooks/permissions/useCan.js'
import { formatDateTime } from "../../utils/timeUtils"
import MemberAvatar from '../team/MemberAvatar.jsx'
import DangerConfirmationModal from '../ui/modal/DangerConfirmationModal.jsx'
import IdeaDetailModal from './IdeaDetailModal'
import IdeaFormModal from './IdeaFormModal.jsx'
import MoveToDoneModal from './MoveToDoneModal'
import MoveToPlannedModal from './MoveToPlannedModal.jsx'


const STATE_STYLES = {
    draft: {
        wrapper: 'bg-white',
        titleClass: 'text-gray-900 group-hover:text-teeming-green',
    },
    planned: {
        wrapper: 'bg-white',
        titleClass: 'text-gray-900 group-hover:text-indigo-600',
    },
    in_progress: {
        wrapper: 'bg-white overflow-hidden',
        titleClass: 'text-gray-900 group-hover:text-[#378ADD]',
    },
    done: {
        wrapper: 'bg-white/80',
        titleClass: 'text-gray-500 line-through decoration-gray-400',
    },
}

export default function IdeaCard({ currentIdea, state, theme }) {
    const base = `border rounded-xl p-4 shadow-sm hover:border-gray-300 hover:shadow transition-all cursor-pointer relative group ${theme.cardBorder || 'border-gray-200'}`
    const { wrapper, titleClass } = STATE_STYLES[state]

    const [isEditIdeaModalOpen, setIsEditIdeaModalOpen] = useState(false)
    const [isDeleteConfirmModalOpen, setisDeleteConfirmModalOpen] = useState(false)

    const [activeModal, setActiveModal] = useState(null)
    const [menuOpen, setMenuOpen] = useState(false)
    const menuRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleKebabClick = (e) => {
        e.stopPropagation()
        setMenuOpen(o => !o)
    }

    const { mutate: deleteIdea, isPending: isDeleting } = useDeleteIdea();
    const handleDeleteIdea = () => deleteIdea(currentIdea.id, { onSuccess: () => setMenuOpen(false) })

    const { data: currentUser } = useAuth()
    const isIdeaCreator = currentUser.id === currentIdea.createdBy.id

    const canDeleteOthersIdea = useCan(PERMISSIONS.DELETE_OTHERS_IDEA)

    return (
        <>
            <div onClick={() => setActiveModal('detail')} className={`${wrapper} ${base}`}>

                {state === IDEA_STATUS.PLANNED && (
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-indigo-500 rounded-l-xl" />
                )}

                {state === 'in_progress' && (
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#378ADD]" />
                )}

                <div className={`flex items-start gap-2.5 ${state === 'in_progress' ? 'mb-4' : 'mb-3'}`}>
                    {state === 'draft' && (
                        <MemberAvatar user={currentIdea.createdBy} size='sm' />
                    )}
                    <div className="flex-1 min-w-0 pr-1">
                        <p className={`text-[14px] font-medium transition-colors leading-snug ${titleClass}`}>
                            {currentIdea.title}
                        </p>
                    </div>

                    {/* Kebab */}
                    {
                        state === IDEA_STATUS.DRAFT && (isIdeaCreator || canDeleteOthersIdea) &&

                        <div ref={menuRef} className="relative shrink-0" onClick={e => e.stopPropagation()}>
                            <button
                                onClick={handleKebabClick}
                                className="text-gray-400 hover:text-gray-600 p-0.5 rounded transition-opacity"
                            >
                                <MoreHorizontal className="w-4 h-4" />
                            </button>

                            {menuOpen && (
                                <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-20">
                                    {isIdeaCreator && (
                                        <button
                                            onClick={() => setIsEditIdeaModalOpen(true)}
                                            className="w-full text-left px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                        >
                                            <Pencil className="w-3.5 h-3.5" /> Edit
                                        </button>
                                    )}


                                    {(isIdeaCreator || canDeleteOthersIdea) && (
                                        <div className="border-t border-gray-100 mt-1 pt-1">
                                            <button
                                                onClick={() => setisDeleteConfirmModalOpen(true)}
                                                className="w-full text-left px-3 py-2 text-[13px] text-red-600 hover:bg-red-50 flex items-center gap-2"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    }

                </div>

                {/* Footer row — unchanged */}
                <div className="flex items-center justify-between">
                    {state === IDEA_STATUS.DRAFT && (
                        <>
                            <div className="flex items-center gap-1.5 text-gray-400 text-[12px] font-medium">
                                <ThumbsUp className="w-3.5 h-3.5" /> {0}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-[11.5px] font-medium text-gray-600">{isIdeaCreator ? "You" : currentIdea.createdBy.fullName}</span>
                                <span className="text-[11px] text-gray-400">· {formatDateTime(currentIdea.createdAt)}</span>
                            </div>
                        </>
                    )}
                    {state === IDEA_STATUS.PLANNED && (
                        <>
                            <div className="flex -space-x-1.5">
                                {currentIdea.assignees?.map((assignee) => (
                                    <MemberAvatar
                                        key={assignee.id}
                                        user={assignee}
                                        size="xs"
                                    />
                                ))}
                            </div>

                            <span className="text-[11px] text-gray-400">
                                Assigned {formatDateTime(currentIdea.updatedAt)}
                            </span>
                        </>
                    )}
                    {state === IDEA_STATUS.IN_PROGRESS && (
                        <>
                            <div className="flex -space-x-1.5">
                                {currentIdea.assignees?.map((assignee, i) => (
                                    <MemberAvatar key={assignee.id} user={assignee} size='xs' />
                                ))}
                            </div>
                            <div className="flex items-center gap-1 text-amber-600 text-[11.5px] font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                                <AlertCircle className="w-3.5 h-3.5" />
                                Due Jun 5
                            </div>
                        </>
                    )}
                    {state === IDEA_STATUS.DONE && (
                        <>
                            <div className="flex items-center gap-1.5 opacity-75 group-hover:opacity-100 transition-opacity">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                <div className="flex -space-x-1.5">
                                    {currentIdea.assignees?.map((assignee, i) => (
                                        <MemberAvatar key={assignee.id} user={assignee} size='xs' />
                                    ))}
                                </div>
                            </div>
                            <span className="text-[11px] text-gray-400">{formatDateTime(currentIdea.updatedAt)}</span>
                        </>
                    )}
                </div>
            </div>

            <IdeaDetailModal
                currentIdea={currentIdea}
                isOpen={activeModal === 'detail'}
                onClose={() => setActiveModal(null)}
                onMove={() => setActiveModal(
                    state === IDEA_STATUS.DRAFT ? 'moveToPlanned'
                        : state === IDEA_STATUS.PLANNED ? 'moveToProgress'
                            : state === IDEA_STATUS.IN_PROGRESS ? 'moveToDone' : 'detail')}
            />
            <MoveToPlannedModal
                currentIdea={currentIdea}
                isOpen={activeModal === 'moveToPlanned'}
                onClose={() => setActiveModal(null)}
                onBack={() => setActiveModal('detail')}
            />

            <MoveToDoneModal
                currentIdea={currentIdea}
                isOpen={activeModal === 'moveToDone'}
                onClose={() => setActiveModal(null)}
                onBack={() => setActiveModal('detail')}
            />

            <IdeaFormModal
                isOpen={isEditIdeaModalOpen}
                onClose={() => setIsEditIdeaModalOpen(false)}
                currentIdea={currentIdea}
            />

            <DangerConfirmationModal
                isOpen={isDeleteConfirmModalOpen}
                onClose={() => setisDeleteConfirmModalOpen(false)}
                isLoading={isDeleting}
                onConfirm={handleDeleteIdea}
                title={isIdeaCreator ? "Delete Idea" : `Delete ${currentIdea.createdBy.fullName}'s Idea`}
                description={
                    isIdeaCreator
                        ? "This idea will be completely removed from this goal."
                        : `You are deleting an idea submitted by ${currentIdea.createdBy.fullName}. This cannot be undone.`
                }
                confirmButtonText="Delete Idea"
            />
        </>
    )
}

function Avatar({ assignee, size = 'md', ring = false, className = '' }) {
    const sizes = { sm: 'w-5 h-5 text-[9px]', md: 'w-6 h-6 text-[10px]' }
    return (
        <div className={`rounded-full flex items-center justify-center font-medium shrink-0 ${sizes[size]} ${assignee?.bgClass || 'bg-gray-100'} ${assignee?.textClass || 'text-gray-600'} ${ring ? 'ring-2 ring-white' : ''} ${className}`}>
            {assignee?.initials}
        </div>
    )
}