import { ChevronDown, Clock, Mail, Search } from 'lucide-react';
import { useState } from 'react';
import AppButton from '../../components/ui/buttons/AppButton';
import InviteModal from '../../components/workspace/InviteModal';
import MemberRow from '../../components/workspace/MemberRow';
import MemberRowSkelton from '../../components/workspace/MemberRowSkelton';
import { PERMISSIONS } from '../../constants/permissions';
import { useCan } from '../../hooks/permissions/useCan';
import useTeamMembers from '../../hooks/team/useTeamMembers';
import useWorkspace from '../../hooks/workspace/useWorkspace';
import usePendingInvitations from '../../hooks/invite/usePendingInvitations';
import PendingInvitation from '../../components/team/PendingInvitation';
import EmptyPendingInvitations from '../../components/team/EmptyPendingInvitation';


function ManageTeamPage() {

    const { data: teamMembers, isSuccess, isPending } = useTeamMembers()

    const canInviteMembers = useCan(PERMISSIONS.INVITE_MEMBERS)
    const canManageTeam = useCan(PERMISSIONS.MANAGE_TEAM)



    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const { data: currentWorkspace } = useWorkspace()
    const { data: pendingInvitations } = usePendingInvitations()

    const onInviteClick = () => {

    }

    return (
        <>
            <div className="max-w-5xl mx-auto space-y-14 pb-20">

                {/* Workspace Header Minimal */}
                <div className="flex items-end justify-between border-b border-gray-200 pb-6">
                    <div className="flex items-center gap-5">
                        <div>
                            <div className="relative">
                                <div className="flex items-center gap-2 mb-1">
                                    <h1 className="text-[22px] font-semibold text-gray-900 tracking-tight leading-none">Manage Team</h1>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-[13px]">
                                <span className="text-gray-500">Manage roles and access for your workspace members</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        {
                            canInviteMembers &&
                            <AppButton onClick={() => setIsInviteModalOpen(true)} >
                                + Invite Members
                            </AppButton>
                        }

                    </div>
                </div>

                {/* Members Section */}
                <section>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                            <h2 className="text-base font-semibold text-gray-900 tracking-tight flex items-center gap-2">
                                Team Members
                                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[10px] font-bold">{teamMembers?.length ?? ""}</span>
                            </h2>
                            <div className="h-4 w-px bg-gray-200 hidden sm:block"></div>
                            <div className="flex items-center gap-1.5 hidden sm:flex">
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teeming-green"></span>
                                </span>
                                <span className="text-[12px] font-medium text-gray-500">1 Active</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search members..."
                                    className="w-full sm:w-64 pl-9 pr-4 py-1.5 bg-white border border-gray-200 rounded-lg text-[13px] text-gray-900 placeholder:text-gray-500 transition-colors focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
                                />
                            </div>
                            <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[13px] font-medium text-gray-600 hover:bg-gray-50 flex items-center gap-2 transition-colors">
                                Role: All <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                            </button>
                        </div>

                    </div>

                    <div className="border border-gray-200 rounded-xl bg-white">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-gray-100 bg-gray-50 text-[11px] font-semibold text-gray-500 uppercase tracking-wider rounded-t-[11px]">
                            <div className="col-span-6 sm:col-span-5">Member</div>
                            <div className="col-span-3 sm:col-span-3">Role</div>
                            <div className="col-span-3 sm:col-span-3 hidden sm:block">Status</div>
                            {
                                canManageTeam &&
                                <div className="col-span-3 sm:col-span-1 text-right">Actions</div>
                            }

                        </div>

                        {/* Members List */}
                        <div className="divide-y divide-gray-100">

                            {isPending
                                ? Array.from({ length: 5 }).map((_, i) => <MemberRowSkelton key={i} />)
                                : teamMembers.map(member => <MemberRow key={member.id} member={member} />)
                            }

                        </div>
                    </div>
                </section>

                {/* Pending Invitations */}
                {
                    canInviteMembers &&
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base font-semibold text-gray-900 tracking-tight flex items-center gap-2">
                                Pending Invitations
                                <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-[10px] font-bold">{pendingInvitations?.length ?? "0"}</span>
                            </h2>
                        </div>
                        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                            <div className="divide-y divide-gray-100">

                                {
                                    pendingInvitations?.length > 0
                                        ? pendingInvitations.map(invitation =>
                                            (<PendingInvitation key={invitation.id} invitation={invitation} />))
                                        : <EmptyPendingInvitations />
                                }

                            </div>
                        </div>

                        <div className="flex items-center gap-2 mt-1">
                            <div className="w-1 h-1 rounded-full bg-gray-300"></div>

                            <p className="text-[12px] text-gray-500">
                                Invitations automatically expire after{" "}
                                <span className="font-medium text-gray-700">
                                    7 days
                                </span>
                            </p>
                        </div>
                    </section>
                }

            </div>

            <InviteModal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} />
        </>
    )
}

export default ManageTeamPage