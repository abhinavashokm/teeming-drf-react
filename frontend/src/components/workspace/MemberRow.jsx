import { ArrowDownCircle, ArrowUpCircle, MoreHorizontal, Shield, UserMinus } from 'lucide-react';
import { useState } from 'react';
import useAuth from '../../hooks/auth/useAuth';
import { getAvatarColor } from '../../utils/styleUtils';
import useUpdateMemberRole from '../../hooks/team/useUpdateMemberRole';
import useRemoveMember from '../../hooks/team/useRemoveMember';
import useWorkspace from '../../hooks/workspace/useWorkspace';
import { useCan } from '../../hooks/permissions/useCan';
import { PERMISSIONS } from '../../constants/permissions';
import RoleBadge from '../team/RoleBadge';


function MemberRow({ member }) {

    const [activeDropdown, setActiveDropdown] = useState(null);
    const { data: currentUser } = useAuth()
    const { mutate: updateRole } = useUpdateMemberRole()
    const { mutate: removeMember } = useRemoveMember()
    const { data: currentWorkspace } = useWorkspace()

    const canManageTeam = useCan(PERMISSIONS.MANAGE_TEAM)

    const { bg, text } = getAvatarColor(member.email)

    const handleUpdateRole = (role) => {
        updateRole({ 'role': role, memberId: member.id })
        setActiveDropdown(false)
    }

    const handleRemoveMember = () => {
        removeMember(member.id)
    }

    return (
        <div key={member.id} className="grid grid-cols-12 gap-4 px-5 py-3.5 items-center hover:bg-gray-50 transition-colors group cursor-pointer last:rounded-b-[11px]">
            <div className="col-span-6 sm:col-span-5 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-medium shrink-0 ${getAvatarColor(member.email)}`}>
                    {member.fullName[0]}
                </div>
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <p className="text-[13px] font-medium text-gray-900 truncate">{member.fullName}</p>
                        {member.email === currentUser.email && (
                            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 uppercase tracking-wide">You</span>
                        )}
                    </div>
                    <p className="text-[12px] text-gray-500 truncate">{member.email}</p>
                </div>
            </div>


            <div className="col-span-3 sm:col-span-3">

                <RoleBadge role={member.role} />

            </div>



            <div className="col-span-3 sm:col-span-3 hidden sm:flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${member.status === 'Online now' ? 'bg-teeming-green' : 'bg-gray-300'}`}></span>
                <span className={`text-[12px] ${member.status === 'Online now' ? 'text-gray-600' : 'text-gray-500'}`}>{member.status ?? "unknown"}</span>
            </div>

            <div className="col-span-3 sm:col-span-1 flex justify-end relative">
                {member.isYou ? (
                    <span className="text-gray-300">—</span>
                ) : (
                    <>
                        {
                            canManageTeam && member.role !== 'owner' && member.email !== currentUser.email &&
                            <button
                                onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === member.id ? null : member.id); }}
                                className="p-1 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </button>
                        }


                        {activeDropdown === member.id && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setActiveDropdown(null); }}></div>
                                <div className="absolute right-2 top-8 w-52 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 z-50">
                                    {member.role === 'admin' && (
                                        <div onClick={() => handleUpdateRole("member")} className="flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-gray-600 hover:bg-gray-50 rounded-lg mx-1 transition-colors cursor-pointer">
                                            <ArrowDownCircle className="h-4 w-4 text-gray-400" />
                                            Change to Member
                                        </div>
                                    )} {member.role === 'member' && (
                                        <div onClick={() => handleUpdateRole("admin")} className="flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-gray-600 hover:bg-gray-50 rounded-lg mx-1 transition-colors cursor-pointer">
                                            <ArrowUpCircle className="h-4 w-4 text-gray-400" />
                                            Upgrade to Admin
                                        </div>
                                    )}
                                    <div className="border-t border-gray-100 my-1 pt-1 mx-1"></div>
                                    <div onClick={handleRemoveMember} className="flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-red-600 hover:bg-red-50 rounded-lg mx-1 transition-colors cursor-pointer">
                                        <UserMinus className="h-4 w-4" />
                                        Remove from workspace
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>

        </div>
    )
}

export default MemberRow