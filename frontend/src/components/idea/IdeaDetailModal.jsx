import { Activity, AlertCircle, Check, CheckCircle2, ChevronDown, ChevronRight, Flag, ThumbsUp } from 'lucide-react';
import { useState } from 'react';
import { IDEA_STATUS } from '../../constants/ideaConstants.js';
import { PERMISSIONS } from '../../constants/permissions.js';
import useAuth from '../../hooks/auth/useAuth.js';
import useDeleteIdea from '../../hooks/idea/useDeleteIdea.js';
import { useCan } from '../../hooks/permissions/useCan.js';
import { dateToHuman } from '../../utils/timeUtils.js';
import MemberAvatar from '../team/MemberAvatar.jsx';
import AppButton from '../ui/buttons/AppButton.jsx';
import BaseModal from '../ui/modal/BaseModal';


// ─── Config ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
    [IDEA_STATUS.DRAFT]: {
        badge: { label: 'IDEA', icon: <span className="text-[12px]">✋</span>, className: 'bg-amber-50 text-amber-700 border-amber-200' },
        statusPill: { label: 'Idea', className: 'bg-amber-100 text-amber-700' },
        descriptionWrapper: 'border border-dashed border-gray-300 bg-gray-50/50',
        metaWrapper: 'border-dashed border-gray-300 bg-gray-50/50',
        subtitleAccent: null,
    },
    [IDEA_STATUS.IN_PROGRESS]: {
        badge: { label: 'IN PROGRESS', icon: <Activity className="w-3.5 h-3.5" />, className: 'bg-blue-50 text-[#378ADD] border-[#378ADD]/30' },
        statusPill: { label: 'In Progress', className: 'bg-blue-100 text-blue-700' },
        descriptionWrapper: '',
        metaWrapper: 'border-gray-200 bg-white',
        subtitleAccent: 'text-[#378ADD]  ',
    },
    [IDEA_STATUS.DONE]: {
        badge: { label: 'DONE', icon: <CheckCircle2 className="w-3.5 h-3.5" />, className: 'bg-green-50 text-green-700 border-green-200' },
        statusPill: { label: 'Done', className: 'bg-green-100 text-green-700' },
        descriptionWrapper: '',
        metaWrapper: 'border-gray-200 bg-white',
        subtitleAccent: 'text-green-600  ',
    },
};

// ─── Small reusable components ────────────────────────────────────────────────

const MetaField = ({ label, children }) => (
    <div>
        <div className="text-[11px] font-semibold text-gray-500 tracking-wider uppercase mb-1.5">{label}</div>
        {children}
    </div>
);



// ─── Main Component ───────────────────────────────────────────────────────────

function IdeaDetailModal({ currentIdea, isOpen, onClose, onMove }) {
    if (!currentIdea) return null;

    const { status: ideaStatus, createdBy, moveToProgressBy, movedToDoneBy, deadline, assignees, thumbsUp = 0 } = currentIdea;
    const config = STATUS_CONFIG[ideaStatus];
    const { badge, statusPill, descriptionWrapper, metaWrapper, subtitleAccent } = config;
    const isInProgress = ideaStatus === IDEA_STATUS.IN_PROGRESS;
    const isDone = ideaStatus === IDEA_STATUS.DONE;
    const isDraft = ideaStatus === IDEA_STATUS.DRAFT;

    const { mutate: deleteIdea, isPending } = useDeleteIdea();
    const handleDeleteIdea = () => deleteIdea(currentIdea.id, { onSuccess: onClose });

    const formattedDate = new Date(currentIdea.createdAt).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
    });

    const [showActivity, setShowActivity] = useState(false);
    const [showAssignees, setShowAssignees] = useState(false);

    const { data: currentUser } = useAuth()

    const isIdeaCreator = currentUser.id === createdBy.id
    const isAssignedToIdea = isDraft ? false : assignees.some(member => member.id === currentUser.id)

    const canMoveIdeaToProgress = useCan(PERMISSIONS.MOVE_IDEA_PROGRESS)
    const canMoveIdeaToDone = useCan(PERMISSIONS.MOVE_IDEA_DONE) || isAssignedToIdea
    const canDeleteOthersIdea = useCan(PERMISSIONS.DELETE_OTHERS_IDEA)
    const canDropIdea = useCan(PERMISSIONS.DROP_IDEA)


    return (
        <BaseModal isOpen={isOpen} onClose={onClose}>

            {/* Header */}
            <BaseModal.Header onClose={onClose}>
                <span className={`px-2.5 py-1 border rounded-md text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5 ${badge.className}`}>
                    {badge.icon} {badge.label}
                </span>
            </BaseModal.Header>

            {/* Body */}
            <BaseModal.Body className="space-y-5">

                {/* Hero */}
                <section className="space-y-3">

                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-700 leading-tight">
                                {currentIdea.title}
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                Added by {createdBy?.fullName} · {formattedDate}
                            </p>
                        </div>

                        <div className=" items-center gap-2">
                            <span className="text-[13px] text-gray-500 flex items-center gap-1.5">
                                <ThumbsUp className="w-4 h-4" /> {thumbsUp}
                            </span>
                            {/* thumbsUp avatars — map from real data if available */}
                        </div>
                    </div>

                    {/* Summary Row */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">

                        {/* Goal - 60% */}
                        <div className="md:col-span-3 rounded-lg bg-gray-50/70 px-3 py-3">
                            <div className="flex items-start gap-2">

                                <Flag className="w-4 h-4 text-gray-400 mt-0.5 shrink-0 mt-1" />

                                <p className="text-sm font-small text-gray-600 leading-relaxed">
                                    {currentIdea.goal.name}
                                </p>

                            </div>
                        </div>

                        {/* Deadline - 40% */}
                        <div className="md:col-span-2 rounded-lg bg-gray-50/70 px-3 py-3">
                            <div className="flex items-start gap-2">

                                <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />

                                <div>
                                    <p className="text-[11px] uppercase tracking-wide text-gray-500">
                                        Deadline
                                    </p>

                                    <p className="text-sm   text-gray-700">
                                        {deadline || '—'}
                                    </p>

                                    {/* {isInProgress && (
                                        <p className="text-xs text-amber-600   mt-0.5">
                                            6 days left
                                        </p>
                                    )} */}
                                </div>

                            </div>
                        </div>

                    </div>

                </section>

                {/* Description */}
                <section>

                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                        Description
                    </h3>

                    <p className="text-sm leading-6 text-gray-700">
                        {currentIdea.description ||
                            'No description provided for this idea yet.'}
                    </p>

                </section>

                {isDone && currentIdea.completionNote && (
                    <section>

                        <div className="rounded-xl bg-amber-50 border border-amber-100 p-4">

                            <div className="flex items-start gap-2">

                                <div className="text-amber-500 mt-0.5">
                                    📝
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-amber-900 mb-2">
                                        Completion Note
                                    </h3>

                                    <p className="text-sm text-amber-800 leading-6">
                                        {currentIdea.completionNote}
                                    </p>
                                </div>

                            </div>

                        </div>

                    </section>
                )}

                {/* Team */}
                {assignees?.length > 0 && (
                    <section className="rounded-xl bg-gray-50 p-4">

                        <button
                            type="button"
                            onClick={() => setShowAssignees(prev => !prev)}
                            className="w-full flex items-center justify-between text-left"
                        >
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700">
                                    Assignees
                                </h3>

                                <p className="text-xs text-gray-500 mt-0.5">
                                    {assignees.length} member{assignees.length > 1 ? 's' : ''}
                                </p>
                            </div>

                            <div className="flex items-center gap-3">

                                <div className="flex -space-x-2">
                                    {assignees.slice(0, 3).map(member => (
                                        <MemberAvatar
                                            key={member.id}
                                            name={member.fullName}
                                            email={member.email}
                                            className="ring-2 ring-gray-50"
                                        />
                                    ))}

                                    {assignees.length > 3 && (
                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs   text-gray-600 ring-2 ring-gray-50">
                                            +{assignees.length - 3}
                                        </div>
                                    )}
                                </div>

                                <ChevronDown
                                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${showAssignees ? 'rotate-180' : ''
                                        }`}
                                />
                            </div>
                        </button>

                        <div
                            className={`overflow-hidden transition-all duration-300 ${showAssignees
                                ? 'max-h-[400px] opacity-100 mt-4'
                                : 'max-h-0 opacity-0'
                                }`}
                        >
                            <div className="space-y-2">

                                {assignees.map(member => (
                                    <div
                                        key={member.id}
                                        className="flex items-center gap-3 rounded-lg bg-gray-100/70 px-3 py-2.5"
                                    >
                                        <MemberAvatar
                                            name={member.fullName}
                                            email={member.email}
                                        />

                                        <div className="min-w-0">
                                            <p className="text-sm  text-gray-700 truncate">
                                                {member.fullName}
                                            </p>

                                            <p className="text-xs text-gray-500 truncate">
                                                {member.email}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                            </div>
                        </div>

                    </section>
                )}

                {/* Activity */}
                {
                    ideaStatus !== IDEA_STATUS.DRAFT &&

                    <section className="mt-5 rounded-xl bg-gray-50 p-4">

                        <button
                            type="button"
                            onClick={() => setShowActivity(prev => !prev)}
                            className="w-full flex items-center justify-between text-left"
                        >
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700">
                                    Activity
                                </h3>

                                <p className="text-xs text-gray-500 mt-0.5">
                                    {[
                                        true,
                                        (isInProgress || isDone) && moveToProgressBy,
                                        isDone && movedToDoneBy
                                    ].filter(Boolean).length} events
                                </p>
                            </div>

                            <ChevronDown
                                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${showActivity ? 'rotate-180' : ''
                                    }`}
                            />
                        </button>

                        <div
                            className={`overflow-hidden transition-all duration-300 ${showActivity
                                ? 'max-h-[500px] opacity-100 mt-4'
                                : 'max-h-0 opacity-0'
                                }`}
                        >
                            <div className="space-y-4">

                                {/* Created */}
                                <div className="rounded-lg bg-white px-3 py-2.5">
                                    <p className="text-sm   text-gray-700">
                                        Created by {createdBy?.fullName}
                                    </p>

                                    <p className="text-xs text-gray-500 mt-1">
                                        {formattedDate}
                                    </p>
                                </div>

                                {/* Moved to Progress */}
                                {(isInProgress || isDone) && moveToProgressBy && (
                                    <div className="rounded-lg bg-white px-3 py-2.5">
                                        <p className="text-sm   text-gray-700">
                                            Moved to In Progress by {moveToProgressBy.fullName}
                                        </p>

                                        <p className="text-xs text-gray-500 mt-1">
                                            {dateToHuman(currentIdea.movedAt)}
                                        </p>
                                    </div>
                                )}

                                {/* Done */}
                                {isDone && movedToDoneBy && (
                                    <div className="rounded-lg bg-white px-3 py-2.5">
                                        <p className="text-sm   text-gray-700">
                                            Marked Done by {movedToDoneBy.fullName}
                                        </p>

                                        <p className="text-xs text-gray-500 mt-1">
                                            {dateToHuman(currentIdea.movedToDoneAt)}
                                        </p>
                                    </div>
                                )}

                            </div>
                        </div>

                    </section>
                }

            </BaseModal.Body>

            {/* Footer */}
            {!isDone && (
                <BaseModal.Footer className="flex items-center gap-2">
                    {
                        isDraft && (canDeleteOthersIdea || isIdeaCreator) &&
                        <AppButton variant="danger" onClick={handleDeleteIdea} loading={isDraft && isPending}>
                            Delete
                        </AppButton>
                    }
                    {
                        isInProgress && canDropIdea &&
                        <AppButton variant="danger" onClick={undefined} loading={isDraft && isPending}>
                            Drop Idea
                        </AppButton>
                    }


                    {isIdeaCreator && isDraft && (
                        <AppButton variant="secondary" >
                            Edit
                        </AppButton>
                    )}

                    <div className="ml-auto">
                        {isDraft && canMoveIdeaToProgress && (
                            <AppButton variant="primary" onClick={onMove}>
                                <ChevronRight className="w-4 h-4" /> Move to In Progress
                            </AppButton>
                        )}
                        {isInProgress && canMoveIdeaToDone && (
                            <AppButton variant="primary" onClick={onMove}>
                                <Check className="w-4 h-4" /> Mark as Done
                            </AppButton>
                        )}
                    </div>
                </BaseModal.Footer>
            )}

        </BaseModal>
    );
}

export default IdeaDetailModal;