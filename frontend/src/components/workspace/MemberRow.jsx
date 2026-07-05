import { ArrowDownCircle, ArrowUpCircle, MoreHorizontal, UserMinus } from 'lucide-react';
import { useState } from 'react';
import { PERMISSIONS } from '../../constants/permissions';
import useAuth from '../../hooks/auth/useAuth';
import { useCan } from '../../hooks/permissions/useCan';
import useRemoveMember from '../../hooks/team/useRemoveMember';
import useUpdateMemberRole from '../../hooks/team/useUpdateMemberRole';
import useWorkspace from '../../hooks/workspace/useWorkspace';
import MemberAvatar from '../team/MemberAvatar';
import RoleBadge from '../team/RoleBadge';

function MemberRow({ member }) {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const { data: currentUser } = useAuth()
    const { mutate: updateRole } = useUpdateMemberRole()
    const { mutate: removeMember } = useRemoveMember()
    const { data: currentWorkspace } = useWorkspace()
    const canManageTeam = useCan(PERMISSIONS.MANAGE_TEAM)

    const handleUpdateRole = (role) => {
        updateRole({ role, memberId: member.id })
        setActiveDropdown(false)
    }

    const handleRemoveMember = () => {
        removeMember(member.id)
    }

    const isCurrentUser = member.email === currentUser.email
    const canManage = canManageTeam && member.role !== 'owner' && !isCurrentUser

    return (
        <div className="
    flex items-center justify-between gap-3 sm:grid sm:grid-cols-12 sm:gap-4
    px-5 py-3.5 hover:bg-gray-50 transition-colors group cursor-pointer last:rounded-b-[11px]
">
            {/* Name — full width on mobile, 5 cols on desktop */}
            <div className="sm:col-span-5 flex items-center gap-3 min-w-0">
                <MemberAvatar user={member} showYou={isCurrentUser} />
                <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-[13px] font-medium text-gray-900 truncate">{member.fullName}</p>
                        {isCurrentUser && (
                            <span className="hidden sm:inline text-[9px] font-semibold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 uppercase tracking-wide shrink-0">You</span>
                        )}
                        {/* Role inline on mobile */}
                        <div className="sm:hidden">
                            <RoleBadge role={member.role} size="sm" />
                        </div>
                    </div>
                    <p className="text-[12px] text-gray-500 truncate">{member.email}</p>
                </div>
            </div>

            {/* Role — desktop only */}
            <div className="hidden sm:flex sm:col-span-3 items-center">
                <RoleBadge role={member.role} />
            </div>

            {/* Status — desktop only */}
            <div className="hidden sm:flex sm:col-span-3 items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${member.isOnline ? 'bg-teeming-green' : 'bg-gray-300'}`} />
                <span className={`text-[12px] ${member.isOnline ? 'text-gray-600' : 'text-gray-500'}`}>
                    {member.isOnline ? "online" : 'offline'}
                </span>
            </div>

            {/* Actions */}
            <div className="sm:col-span-1 relative shrink-0 flex justify-end">
                {canManage ? (
                    <>
                        <button
                            onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === member.id ? null : member.id); }}
                            className="p-1 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                        >
                            <MoreHorizontal className="h-4 w-4" />
                        </button>
                        {activeDropdown === member.id && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setActiveDropdown(null); }} />
                                <div className="absolute right-0 top-8 w-44 sm:w-52 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 z-50">
                                    {member.role === 'admin' && (
                                        <div onClick={() => handleUpdateRole('member')} className="flex items-center gap-2 px-2.5 py-1.5 sm:gap-2.5 sm:px-3 sm:py-2 text-[12px] sm:text-[13px] font-medium text-gray-600 hover:bg-gray-50 rounded-lg mx-1 transition-colors cursor-pointer">
                                            <ArrowDownCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 shrink-0" />
                                            Change to Member
                                        </div>
                                    )}
                                    {member.role === 'member' && (
                                        <div onClick={() => handleUpdateRole('admin')} className="flex items-center gap-2 px-2.5 py-1.5 sm:gap-2.5 sm:px-3 sm:py-2 text-[12px] sm:text-[13px] font-medium text-gray-600 hover:bg-gray-50 rounded-lg mx-1 transition-colors cursor-pointer">
                                            <ArrowUpCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 shrink-0" />
                                            Upgrade to Admin
                                        </div>
                                    )}
                                    <div className="border-t border-gray-100 my-1 mx-1" />
                                    <div onClick={handleRemoveMember} className="flex items-center gap-2 px-2.5 py-1.5 sm:gap-2.5 sm:px-3 sm:py-2 text-[12px] sm:text-[13px] font-medium text-red-600 hover:bg-red-50 rounded-lg mx-1 transition-colors cursor-pointer">
                                        <UserMinus className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                                        Remove from workspace
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <span className="text-gray-300">—</span>
                )}
            </div>
        </div>
    )
}

export default MemberRow