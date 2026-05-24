import React, { useState } from 'react';
import { Search, ChevronDown, MoreHorizontal, Shield, Clock, Mail, Users, Activity, UserMinus, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import InviteModal from '../../components/workspace/InviteModal';


function ManageTeamPage() {

    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    const members = [
        { id: 1, name: 'Arjun', email: 'arjun@acmecorp.com', role: 'Owner', isYou: true, status: 'Online now', initials: 'A', bgColor: 'bg-gradient-to-tr from-blue-600 to-blue-400', textColor: 'text-white' },
        { id: 2, name: 'Sara R.', email: 'sara.r@acmecorp.com', role: 'Admin', isYou: false, status: 'Online now', initials: 'SR', bgColor: 'bg-pink-100', textColor: 'text-pink-700' },
        { id: 3, name: 'Kiran P.', email: 'kiran@acmecorp.com', role: 'Member', isYou: false, status: '2 hours ago', initials: 'KP', bgColor: 'bg-orange-100', textColor: 'text-orange-700' },
        { id: 4, name: 'Meera J.', email: 'meera@acmecorp.com', role: 'Member', isYou: false, status: 'Yesterday', initials: 'MJ', bgColor: 'bg-teal-100', textColor: 'text-teal-700' },
        { id: 5, name: 'Dev K.', email: 'dev.k@acmecorp.com', role: 'Viewer', isYou: false, status: '3 days ago', initials: 'DK', bgColor: 'bg-amber-100', textColor: 'text-amber-700' },
    ];

    const onInviteClick = () => {
        console.log("trust me brohh")
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
                        <button
                            onClick={() => setIsInviteModalOpen(true)}
                            className="px-3 py-1.5 bg-gray-900 border border-transparent rounded-md text-[13px] font-medium text-white hover:bg-gray-800 transition-colors shadow-sm"
                        >
                            + Invite Members
                        </button>
                    </div>
                </div>

                {/* Members Section */}
                <section>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                            <h2 className="text-base font-semibold text-gray-900 tracking-tight flex items-center gap-2">
                                Team Members
                                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[10px] font-bold">12</span>
                            </h2>
                            <div className="h-4 w-px bg-gray-200 hidden sm:block"></div>
                            <div className="flex items-center gap-1.5 hidden sm:flex">
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teeming-green"></span>
                                </span>
                                <span className="text-[12px] font-medium text-gray-500">5 Active</span>
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
                            <div className="col-span-3 sm:col-span-1 text-right">Actions</div>
                        </div>

                        {/* Members List */}
                        <div className="divide-y divide-gray-100">
                            {members.map((member) => (
                                <div key={member.id} className="grid grid-cols-12 gap-4 px-5 py-3.5 items-center hover:bg-gray-50 transition-colors group cursor-pointer last:rounded-b-[11px]">
                                    <div className="col-span-6 sm:col-span-5 flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-medium shrink-0 ${member.bgColor} ${member.textColor}`}>
                                            {member.initials}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="text-[13px] font-medium text-gray-900 truncate">{member.name}</p>
                                                {member.isYou && (
                                                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 uppercase tracking-wide">You</span>
                                                )}
                                            </div>
                                            <p className="text-[12px] text-gray-500 truncate">{member.email}</p>
                                        </div>
                                    </div>

                                    <div className="col-span-3 sm:col-span-3">
                                        {member.role === 'Owner' || member.role === 'Admin' ? (
                                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-gray-50 text-gray-700 text-[12px] font-medium border border-gray-200">
                                                <Shield className="h-3 w-3 text-gray-400" /> {member.role}
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-gray-600 text-[12px]">
                                                {member.role}
                                            </span>
                                        )}
                                    </div>

                                    <div className="col-span-3 sm:col-span-3 hidden sm:flex items-center gap-2">
                                        <span className={`w-1.5 h-1.5 rounded-full ${member.status === 'Online now' ? 'bg-teeming-green' : 'bg-gray-300'}`}></span>
                                        <span className={`text-[12px] ${member.status === 'Online now' ? 'text-gray-600' : 'text-gray-500'}`}>{member.status}</span>
                                    </div>

                                    <div className="col-span-3 sm:col-span-1 flex justify-end relative">
                                        {member.isYou ? (
                                            <span className="text-gray-300">—</span>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === member.id ? null : member.id); }}
                                                    className="p-1 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </button>

                                                {activeDropdown === member.id && (
                                                    <>
                                                        <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setActiveDropdown(null); }}></div>
                                                        <div className="absolute right-2 top-8 w-52 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 z-50">
                                                            {member.role === 'Admin' ? (
                                                                <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-gray-600 hover:bg-gray-50 rounded-lg mx-1 transition-colors cursor-pointer">
                                                                    <ArrowDownCircle className="h-4 w-4 text-gray-400" />
                                                                    Change to Member
                                                                </div>
                                                            ) : (
                                                                <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-gray-600 hover:bg-gray-50 rounded-lg mx-1 transition-colors cursor-pointer">
                                                                    <ArrowUpCircle className="h-4 w-4 text-gray-400" />
                                                                    Upgrade to Admin
                                                                </div>
                                                            )}
                                                            <div className="border-t border-gray-100 my-1 pt-1 mx-1"></div>
                                                            <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-red-600 hover:bg-red-50 rounded-lg mx-1 transition-colors cursor-pointer">
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
                            ))}
                        </div>
                    </div>
                </section>

                {/* Pending Invitations */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-semibold text-gray-900 tracking-tight flex items-center gap-2">
                            Pending Invitations
                            <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-[10px] font-bold">2</span>
                        </h2>
                    </div>
                    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                        <div className="divide-y divide-gray-100">
                            {/* Invite 1 */}
                            <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                        <Mail className="h-3.5 w-3.5 text-gray-500" />
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-medium text-gray-900">dev2@acmecorp.com</p>
                                        <p className="text-[12px] text-gray-500 flex items-center gap-1 mt-0.5">
                                            <Clock className="h-3 w-3" /> Invited 2 days ago
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-[11px] font-medium text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
                                        Resend
                                    </button>
                                    <button className="px-2.5 py-1.5 border border-transparent rounded-lg text-[11px] font-medium text-red-600 hover:bg-red-50 transition-colors">
                                        Cancel
                                    </button>
                                </div>
                            </div>

                            {/* Invite 2 */}
                            <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                        <Mail className="h-3.5 w-3.5 text-gray-500" />
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-medium text-gray-900">hr@acmecorp.com</p>
                                        <p className="text-[12px] text-gray-500 flex items-center gap-1 mt-0.5">
                                            <Clock className="h-3 w-3" /> Invited 5 days ago
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-[11px] font-medium text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
                                        Resend
                                    </button>
                                    <button className="px-2.5 py-1.5 border border-transparent rounded-lg text-[11px] font-medium text-red-600 hover:bg-red-50 transition-colors">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <InviteModal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} />
        </>
    )
}

export default ManageTeamPage