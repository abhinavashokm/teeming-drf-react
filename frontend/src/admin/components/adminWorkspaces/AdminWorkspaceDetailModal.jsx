import React, { useState } from 'react';
import { X, Search, ChevronDown, Shield } from 'lucide-react';
import WorkspaceAvatar from '../../../components/workspace/WorkspaceAvatar';

// ─── helpers ────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
    'bg-blue-500', 'bg-violet-500', 'bg-emerald-500',
    'bg-orange-500', 'bg-rose-500', 'bg-cyan-500',
    'bg-pink-500', 'bg-amber-500', 'bg-indigo-500',
];

const colorFor = (id = '') =>
    AVATAR_COLORS[
    [...String(id)].reduce((acc, c) => acc + c.charCodeAt(0), 0) % AVATAR_COLORS.length
    ];

const getInitials = (name = '') =>
    name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '??';

const formatDate = (iso) =>
    iso
        ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : '—';

// ─── component ───────────────────────────────────────────────────────────────

/**
 * AdminWorkspaceDetailModal
 *
 * Props:
 *   workspace  — transformed workspace object from the table (required)
 *   onClose    — () => void (required)
 */
export default function AdminWorkspaceDetailModal({ workspace, onClose }) {
    const [memberSearchQuery, setMemberSearchQuery] = useState('');
    const [memberRoleFilter, setMemberRoleFilter] = useState('All');

    if (!workspace) return null;

    // members come from the workspace object; adjust the source key once your
    // details endpoint is wired up (e.g. workspace.members array)
    // const allMembers = (workspace?.members ?? []).map(m => ({
    //     ...m,
    //     name: m.fullName || m.email || 'Unknown',
    //     initials: getInitials(m.fullName || m.email || ''),
    //     color: colorFor(m.id),
    // }));
    const allMembers = []

    const filteredMembers = allMembers.filter(m => {
        const matchesSearch =
            m.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
            (m.email ?? '').toLowerCase().includes(memberSearchQuery.toLowerCase());
        const matchesRole = memberRoleFilter === 'All' || m.role === memberRoleFilter;
        return matchesSearch && matchesRole;
    });

    return (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* header */}
                <div className="p-6 border-b border-slate-200 bg-slate-50/50 relative shrink-0">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors bg-white hover:bg-slate-100 p-1.5 rounded-lg border border-slate-200 shadow-sm"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex items-start gap-5">
                        <WorkspaceAvatar workspace={workspace} size='xl'  />

                        <div className="flex-1 mt-1">
                            <div className="flex items-center gap-3 mb-1">
                                <h2 className="text-2xl font-bold text-slate-900">{workspace.name}</h2>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${workspace.planColor}`}>
                                    {workspace.plan}
                                </span>
                                {workspace.status === 'Suspended' && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-red-100 text-red-700">
                                        Suspended
                                    </span>
                                )}
                            </div>

                            <div className="text-[14px] font-medium text-slate-500 mb-3">@{workspace.slug}</div>

                            <div className="flex items-center gap-6 text-sm">
                                <div className="flex flex-col">
                                    <span className="text-slate-500 font-medium">Owner</span>
                                    <span className="text-slate-900 font-bold">{workspace.owner.name}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-slate-500 font-medium">Created</span>
                                    <span className="text-slate-900 font-bold">{workspace.created}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-slate-500 font-medium">Members</span>
                                    <span className="text-slate-900 font-bold">{workspace.memberCount}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-slate-500 font-medium">Total Goals</span>
                                    <span className="text-slate-900 font-bold">{workspace.goalCount}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* members */}
                <div className="flex flex-col flex-1 overflow-hidden">
                    <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
                        <div className="flex items-center gap-2">
                            <h3 className="text-[16px] font-bold text-slate-900">Workspace Members</h3>
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[11px] font-bold rounded-full">
                                {allMembers.length}
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative w-64">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-[14px] w-[14px] text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search members..."
                                    value={memberSearchQuery}
                                    onChange={(e) => setMemberSearchQuery(e.target.value)}
                                    className="w-full h-[36px] bg-white border border-slate-200 rounded-lg pl-9 pr-4 text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                />
                            </div>

                            <div className="relative">
                                <select
                                    value={memberRoleFilter}
                                    onChange={(e) => setMemberRoleFilter(e.target.value)}
                                    className="h-[36px] appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 text-[13px] font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                                >
                                    <option value="All">All Roles</option>
                                    <option value="owner">Owner</option>
                                    <option value="admin">Admin</option>
                                    <option value="member">Member</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                                    <ChevronDown className="h-4 w-4 text-slate-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto bg-white p-6">
                        <div className="border border-slate-200 rounded-xl overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Member</th>
                                        <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Joined</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredMembers.length > 0 ? (
                                        filteredMembers.map(member => (
                                            <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-3.5">
                                                    <div className="flex items-center gap-3">
                                                        {member.avatarUrl ? (
                                                            <img
                                                                src={member.avatarUrl}
                                                                alt={member.name}
                                                                className="w-8 h-8 rounded-full object-cover shrink-0"
                                                            />
                                                        ) : (
                                                            <div className={`w-8 h-8 rounded-full ${member.color} flex items-center justify-center text-[11px] font-bold text-white shrink-0`}>
                                                                {member.initials}
                                                            </div>
                                                        )}
                                                        <span className="text-[13px] font-bold text-slate-900">{member.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3.5 text-[13px] text-slate-500">{member.email}</td>
                                                <td className="px-6 py-3.5">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold ${member.role === 'owner' ? 'bg-emerald-100 text-emerald-700' :
                                                            member.role === 'admin' ? 'bg-blue-100 text-blue-700' :
                                                                'bg-slate-100 text-slate-600'
                                                        }`}>
                                                        {member.role === 'owner' && <Shield className="w-3 h-3" />}
                                                        {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3.5 text-[13px] text-slate-500">
                                                    {formatDate(member.joinedAt)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-8 text-center text-slate-500 text-sm">
                                                No members found matching your search.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}