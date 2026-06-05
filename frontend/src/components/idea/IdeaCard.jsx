import { AlertCircle, CheckCircle2, MoreHorizontal, ThumbsUp } from 'lucide-react'
import { formatDateTime } from "../../utils/timeUtils"
import IdeaDetailModal from './IdeaDetailModal'
import { useState } from 'react'
import MoveToProgressModal from './MoveToProgressModal'

const STATE_STYLES = {
    draft: {
        wrapper: 'bg-white',
        titleClass: 'text-gray-900 group-hover:text-teeming-green',
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

    const [activeModal, setActiveModal] = useState(null)

    const openDetailModal = () => {
        setActiveModal('detail')
    }

    const closeAll = () => {
        setActiveModal(null)

    }

    return (
        <>
            <div onClick={openDetailModal} className={`${wrapper} ${base}`}>

                {/* In Progress accent bar */}
                {state === 'in_progress' && (
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#378ADD]" />
                )}

                {/* Title row */}
                <div className={`flex items-start gap-2.5 mb-3 ${state === 'in_progress' ? 'mb-4' : 'mb-3'}`}>
                    {state === 'draft' && (
                        <Avatar assignee={currentIdea.createdBy} size="md" className="mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0 pr-1">
                        <p className={`text-[14px] font-medium transition-colors leading-snug ${titleClass}`}>
                            {currentIdea.title}
                        </p>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                </div>

                {/* Footer row */}
                <div className="flex items-center justify-between">
                    {state === 'draft' && (
                        <>
                            <div className="flex items-center gap-1.5 text-gray-400 text-[12px] font-medium">
                                <ThumbsUp className="w-3.5 h-3.5" /> {0}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-[11.5px] font-medium text-gray-600">{currentIdea.createdBy.fullName}</span>
                                <span className="text-[11px] text-gray-400">· {formatDateTime(currentIdea.createdAt)}</span>
                            </div>
                        </>
                    )}

                    {state === 'in_progress' && (
                        <>
                            <div className="flex -space-x-1.5">
                                {currentIdea.assignees?.map((a, i) => (
                                    <Avatar key={i} assignee={a} size="md" ring />
                                ))}
                            </div>
                            <div className="flex items-center gap-1 text-amber-600 text-[11.5px] font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                                <AlertCircle className="w-3.5 h-3.5" />
                                Due Jun 5
                            </div>
                        </>
                    )}

                    {state === 'done' && (
                        <>
                            <div className="flex items-center gap-1.5 opacity-75 group-hover:opacity-100 transition-opacity">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                <Avatar assignee={currentIdea.createdBy} size="sm" />
                                <span className="text-[11.5px] font-medium text-gray-600">{currentIdea.createdBy?.fullName}</span>
                            </div>
                            <span className="text-[11px] text-gray-400">{formatDateTime(currentIdea.updatedAt)}</span>
                        </>
                    )}
                </div>
            </div>
            
            <IdeaDetailModal
                currentIdea={currentIdea}
                isOpen={activeModal === 'detail'}
                onClose={closeAll}
                onMove={() => setActiveModal('moveToProgress')}
            />
            <MoveToProgressModal
                currentIdea={currentIdea}
                isOpen={activeModal === 'moveToProgress'}
                onClose={closeAll}
                onBack={() => setActiveModal('detail')}
            />
        </>
    )
}

function Avatar({ assignee, size = 'md', ring = false, className = '' }) {
    const sizes = {
        sm: 'w-5 h-5 text-[9px]',
        md: 'w-6 h-6 text-[10px]',
    }
    return (
        <div className={`
            rounded-full flex items-center justify-center font-medium shrink-0
            ${sizes[size]}
            ${assignee?.bgClass || 'bg-gray-100'}
            ${assignee?.textClass || 'text-gray-600'}
            ${ring ? 'ring-2 ring-white' : ''}
            ${className}
        `}>
            {assignee?.initials}
        </div>
    )
}