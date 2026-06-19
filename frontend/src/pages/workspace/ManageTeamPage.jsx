import { ChevronDown, Search, SearchX } from 'lucide-react';
import { useState } from 'react';
import EmptyPendingInvitations from '../../components/team/EmptyPendingInvitation';
import PendingInvitation from '../../components/team/PendingInvitation';
import AppButton from '../../components/ui/buttons/AppButton';
import InviteModal from '../../components/workspace/InviteModal';
import MemberRow from '../../components/workspace/MemberRow';
import MemberRowSkelton from '../../components/workspace/MemberRowSkelton';
import { PERMISSIONS } from '../../constants/permissions';
import usePendingInvitations from '../../hooks/invite/usePendingInvitations';
import { useCan } from '../../hooks/permissions/useCan';
import useTeamMembers from '../../hooks/team/useTeamMembers';
import useWorkspace from '../../hooks/workspace/useWorkspace';
import UpgradePlanModal from '../../components/subscription/UpgradePlanModal';


function ManageTeamPage() {

    const { data: teamMembers, isSuccess, isPending } = useTeamMembers()

    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    const filteredMembers = (teamMembers ?? []).filter((member) => {

        const matchesSearch =
            member.fullName
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            member.email
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesRole =
            roleFilter === 'all' ||
            member.role === roleFilter;

        return matchesSearch && matchesRole;
    });

    const canInviteMembers = useCan(PERMISSIONS.INVITE_MEMBERS)
    const canManageTeam = useCan(PERMISSIONS.MANAGE_TEAM)



    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [isUpgradePlanModalOpen, setIsUpgradePlanModalOpen] = useState(false)

    const { data: currentWorkspace } = useWorkspace()
    const { data: pendingInvitations } = usePendingInvitations()

    //enforce max member limit in ui according to current plan
    const currentPlan = currentWorkspace?.subscription?.plan
    const memberCountLimit = currentWorkspace?.limits?.members
    const memberLimitReached = (memberCountLimit.used === memberCountLimit.max) ?? false

    const handleInviteMember = () => {
        setIsInviteModalOpen(true)
    }

    return (
        <>
            <div className="max-w-5xl mx-auto space-y-14 pb-20">

                {/* Workspace Header Minimal */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 border-b border-gray-200 pb-6">
                    <div>
                        <h1 className="text-[22px] font-semibold text-gray-900 tracking-tight leading-none mb-1">Manage Team</h1>
                        <p className="text-[13px] text-gray-500">Manage roles and access for your workspace members</p>
                    </div>
                    {canInviteMembers && (
                        <AppButton onClick={handleInviteMember}>
                            + Invite Members
                        </AppButton>
                    )}
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
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full sm:w-64 pl-9 pr-4 py-1.5 bg-white border border-gray-200 rounded-lg text-[13px] text-gray-900 placeholder:text-gray-500 transition-colors focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
                                />
                            </div>
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[13px] font-medium text-gray-600 focus:outline-none"
                            >
                                <option value="all">Role: All</option>
                                <option value="owner">Owner</option>
                                <option value="admin">Admin</option>
                                <option value="member">Member</option>
                            </select>
                        </div>

                    </div>
                    <div className="border border-gray-200 rounded-xl bg-white">
                        {/* Header */}
                        <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 border-b border-gray-100 bg-gray-50 text-[11px] font-semibold text-gray-500 uppercase tracking-wider rounded-t-[11px]">
                            <div className="col-span-5">Member</div>
                            <div className="col-span-3">Role</div>
                            <div className="col-span-3">Status</div>
                            {canManageTeam && <div className="col-span-1 text-right">Actions</div>}
                        </div>
                        {/* Mobile header */}
                        <div className="flex sm:hidden items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50 text-[11px] font-semibold text-gray-500 uppercase tracking-wider rounded-t-[11px]">
                            <div>Member</div>
                            {canManageTeam && <div>Actions</div>}
                        </div>

                        {/* Members List */}
                        <div className="divide-y divide-gray-100">
                            {isPending
                                ? Array.from({ length: 5 }).map((_, i) => <MemberRowSkelton key={i} />)
                                : filteredMembers.length > 0
                                    ? filteredMembers.map(member => <MemberRow key={member.id} member={member} />)
                                    : (
                                        <div className="py-12 px-6 flex flex-col items-center text-center">
                                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                                                <SearchX className="w-5 h-5 text-gray-400" />
                                            </div>

                                            <h3 className="text-sm font-medium text-gray-900">
                                                No members found
                                            </h3>

                                            <p className="mt-1 text-[13px] text-gray-500 max-w-sm">
                                                Try adjusting your search or role filter to find matching team members.
                                            </p>
                                        </div>
                                    )
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

            <InviteModal
                isOpen={isInviteModalOpen}
                onUpgrade={() => setIsUpgradePlanModalOpen(true)}
                onClose={() => setIsInviteModalOpen(false)}
                memberLimit={memberCountLimit}
            />
            <UpgradePlanModal
                isOpen={isUpgradePlanModalOpen}
                onClose={() => setIsUpgradePlanModalOpen(false)}
                limitName='member'
                currentLimit={memberCountLimit.max}
                currentUsage={memberCountLimit.used}
                currentPlan={currentPlan.name}
            />
        </>
    )
}

export default ManageTeamPage