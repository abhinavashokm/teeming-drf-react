import { Activity, AlertCircle, Check, CheckCircle2, ChevronRight, Flag, ThumbsUp } from 'lucide-react';
import { IDEA_STATUS } from '../../constants/ideaConstants.js';
import BaseModal from '../ui/modal/BaseModal';
import AppButton from '../ui/buttons/AppButton.jsx';
import useDeleteIdea from '../../hooks/idea/useDeleteIdea.js';
import { dateToHuman } from '../../utils/timeUtils.js';
import MemberAvatar from '../team/MemberAvatar.jsx';

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
        subtitleAccent: 'text-[#378ADD] font-medium',
    },
    [IDEA_STATUS.DONE]: {
        badge: { label: 'DONE', icon: <CheckCircle2 className="w-3.5 h-3.5" />, className: 'bg-green-50 text-green-700 border-green-200' },
        statusPill: { label: 'Done', className: 'bg-green-100 text-green-700' },
        descriptionWrapper: '',
        metaWrapper: 'border-gray-200 bg-white',
        subtitleAccent: 'text-green-600 font-medium',
    },
};

// ─── Small reusable components ────────────────────────────────────────────────

const MetaField = ({ label, children }) => (
    <div>
        <div className="text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-1.5">{label}</div>
        {children}
    </div>
);

const UserAvatar = ({ initials, colorClass = 'bg-gray-100 text-gray-600' }) => (
    <div className={`w-6 h-6 rounded-full ${colorClass} flex items-center justify-center text-[10px] font-bold`}>
        {initials}
    </div>
);

const UserField = ({ label, user }) => (
    <MetaField label={label}>
        <div className="flex items-center gap-2">
            <MemberAvatar name={user?.fullName} email={user?.email}/>
            <span className="text-[13px] font-medium text-gray-900">{user?.fullName}</span>
        </div>
    </MetaField>
);

// ─── Main Component ───────────────────────────────────────────────────────────

function IdeaDetailModal({ currentIdea, isOpen, onClose, onMove }) {
    if (!currentIdea) return null;

    const { status: ideaStatus, createdBy, moveToProgressBy, movedToDoneBy, deadline, assignees = [], thumbsUp = 0 } = currentIdea;
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

    return (
        <BaseModal isOpen={isOpen} onClose={onClose}>

            {/* Header */}
            <BaseModal.Header onClose={onClose}>
                <span className={`px-2.5 py-1 border rounded-md text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${badge.className}`}>
                    {badge.icon} {badge.label}
                </span>
            </BaseModal.Header>

            {/* Body */}
            <BaseModal.Body>

                {/* Title + Subtitle */}
                <div className="mb-6">
                    <h2 className="text-[22px] font-bold text-gray-900 leading-tight mb-2">{currentIdea.title}</h2>
                    <div className="text-[13px] text-gray-500">
                        Added by {createdBy?.fullName} · {formattedDate}
                        {isDone
                            ? <> · <span className={subtitleAccent}>Completed at { dateToHuman(currentIdea.movedToDoneAt)}</span></>
                            : <> · <span className={subtitleAccent || ''}>Updated 2h ago</span></>
                        }
                    </div>
                </div>

                {/* Description */}
                <div className={`mb-6 p-4 rounded-xl ${descriptionWrapper}`}>
                    {isDraft && <div className="text-[11px] font-bold text-gray-400 tracking-widest uppercase mb-2">Description</div>}
                    <p className="text-[13px] text-gray-700 leading-relaxed">
                        {currentIdea.description || 'No description provided for this idea yet.'}
                    </p>
                </div>

                {/* Meta Grid */}
                <div className={`border rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-6 ${metaWrapper}`}>

                    {/* Left Column */}
                    <div className="space-y-4">
                        <UserField
                            label="Created By"
                            user={createdBy}
                        />
                        <MetaField label="Created At">
                            <div className="text-[13px] text-gray-700">{formattedDate}</div>
                        </MetaField>

                        {isDraft && (
                            <MetaField label="Last Updated">
                                <div className="text-[13px] text-gray-700">2 hours ago</div>
                            </MetaField>
                        )}

                        {(isInProgress || isDone) && (
                            <UserField
                                label={isInProgress ? 'Moved to In Progress By' : 'In Progress By'}
                                user={moveToProgressBy}
                            />
                        )}

                        {isInProgress && (
                            <MetaField label="Moved At">
                                <div className="text-[13px] text-gray-700">{currentIdea.movedAt || 'Oct 14, 2025 at 2:15 PM'}</div>
                            </MetaField>
                        )}

                        {isDone && (
                            <UserField
                                label="Marked as Done By"
                                user={movedToDoneBy}
                            />
                        )}
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                        <MetaField label="Status">
                            <span className={`inline-block px-2 py-0.5 rounded text-[12px] font-medium ${statusPill.className}`}>
                                {statusPill.label}
                            </span>
                        </MetaField>

                        {(isInProgress || isDone) && deadline && (
                            
                            <MetaField label="Deadline">
                                <div className="flex items-center gap-2">
                                    <span className="text-[13px] text-gray-900">{deadline}</span>
                                    {isInProgress
                                        ? <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 border border-amber-100 px-1.5 py-0.5 rounded text-[11px] font-medium">
                                            <AlertCircle className="w-3 h-3" /> 6 days left
                                        </span>
                                        : <span className="inline-flex items-center gap-1 text-green-600 text-[12px] font-medium">
                                            <CheckCircle2 className="w-3.5 h-3.5" /> Completed on time
                                        </span>
                                    }
                                </div>
                            </MetaField>
                        )}

                        <MetaField label="Goal">
                            <div className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-[12px] font-medium">
                                <Flag className="w-3.5 h-3.5" />
                                {currentIdea.goal || 'Checkout Drop-off'}
                            </div>
                        </MetaField>

                        {(isInProgress || isDone) && assignees.length > 0 && (
                            <MetaField label="Assigned To">
                                <div className="flex items-center gap-1.5">
                                    <div className="flex -space-x-1.5">
                                        {assignees.slice(0, 2).map((a, i) => (
                                            <UserAvatar
                                                key={a.id}
                                                initials={a.initials}
                                                colorClass={`${a.colorClass} ring-2 ring-white`}
                                            />
                                        ))}
                                        {assignees.length > 2 && (
                                            <UserAvatar
                                                initials={`+${assignees.length - 2}`}
                                                colorClass="bg-gray-100 text-gray-600 ring-2 ring-white"
                                            />
                                        )}
                                    </div>
                                    <span className="text-[13px] text-gray-600 ml-1">
                                        {assignees.slice(0, 2).map(a => a.fullName).join(', ')}
                                        {assignees.length > 2 && `, +${assignees.length - 2}`}
                                    </span>
                                </div>
                            </MetaField>
                        )}
                    </div>
                </div>
            </BaseModal.Body>

            {/* Footer */}
            {!isDone && (
                <BaseModal.Footer className="justify-between flex-wrap gap-3">
                    <AppButton variant="danger" onClick={isDraft ? handleDeleteIdea : undefined} loading={isDraft && isPending}>
                        {isDraft ? 'Delete' : 'Drop Idea'}
                    </AppButton>

                    <div className="hidden sm:flex items-center gap-2">
                        <span className="text-[13px] font-medium text-gray-500 flex items-center gap-1.5">
                            <ThumbsUp className="w-4 h-4" /> {thumbsUp}
                        </span>
                        {/* thumbsUp avatars — map from real data if available */}
                    </div>

                    <div className="flex items-center gap-3 ml-auto sm:ml-0">
                        <AppButton variant="primary" onClick={onMove}>
                            {isDraft
                                ? <><ChevronRight className="w-4 h-4" /> Move to In Progress</>
                                : <><Check className="w-4 h-4" /> Mark as Done</>
                            }
                        </AppButton>
                    </div>
                </BaseModal.Footer>
            )}

        </BaseModal>
    );
}

export default IdeaDetailModal;