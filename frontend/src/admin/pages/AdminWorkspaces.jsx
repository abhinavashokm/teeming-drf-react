import React, { useState, useMemo } from 'react';
import {
  Search, ChevronDown, SlidersHorizontal, Download, MoreHorizontal,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { adminWorkspaceService } from '../services/adminWorkspaceService';
import { ADMIN_QUERY_KEYS } from '../constants/queryKeys';
import WorkspaceAvatar from "../../components/workspace/WorkspaceAvatar"
import { dateToHuman } from "../../utils/timeUtils"
import AdminWorkspaceDetailModal from '../components/adminWorkspaces/AdminWorkspaceDetailModal';
import DangerConfirmationModal from "../../components/ui/modal/DangerConfirmationModal"

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

const getPlanColor = (code = '') => {
  const map = {
    FREE: 'bg-slate-100 text-slate-700',
    PRO: 'bg-amber-100 text-amber-700',
    ENTERPRISE: 'bg-purple-100 text-purple-700',
  };
  return map[code?.toUpperCase()] ?? 'bg-slate-100 text-slate-600';
};

// camelCase keys from middleware: activeSubscription, memberCount, goalCount, logoKey, isSuspended, createdAt
const transformWorkspace = (ws) => ({
  ...ws,
  initials: getInitials(ws.name),
  color: colorFor(ws.id),
  status: ws.isSuspended ? 'Suspended' : 'Active',
  plan: ws.activeSubscription?.plan?.name ?? 'Free',
  planCode: ws.activeSubscription?.plan?.code ?? 'FREE',
  planColor: getPlanColor(ws.activeSubscription?.plan?.code),
  members: ws.memberCount,
  goals: ws.goalCount,
  created: dateToHuman(ws.createdAt),
  owner: {
    ...ws.owner,
    name: ws.owner?.fullName || ws.owner?.email || 'Unknown',
    initials: getInitials(ws.owner?.fullName || ws.owner?.email || ''),
    color: colorFor(ws.owner?.id),
  },
});

// ─── skeleton row ────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {[200, 140, 60, 60, 100, 40].map((w, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-slate-100 rounded" style={{ width: w }} />
        </td>
      ))}
    </tr>
  );
}

// ─── main component ──────────────────────────────────────────────────────────

export default function AdminWorkspaces() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [planFilter, setPlanFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [dropdownOpenId, setDropdownOpenId] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: [...ADMIN_QUERY_KEYS.WORKSPACES, { search: searchQuery, status: statusFilter, plan: planFilter, page }],
    queryFn: () =>
      adminWorkspaceService.adminListWorkspaces({ search: searchQuery, status: statusFilter, plan: planFilter, page })
        .then(res => res.data),
    keepPreviousData: true,
  });

  const workspacesList = useMemo(
    () => (data?.workspaces ?? []).map(transformWorkspace),
    [data]
  );

  const toggleDropdown = (e, id) => {
    e.stopPropagation();
    setDropdownOpenId(prev => (prev === id ? null : id));
  };

  React.useEffect(() => {
    const close = () => setDropdownOpenId(null);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  const [workspaceDetails, setWorkspaceDetails] = useState(null)
  const [isConfirmSuspendOpen, setIsConfirmSuspendOpen] = useState(false)

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">

      {/* toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative w-[320px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-[14px] w-[14px] text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search workspaces..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              className="w-full h-[36px] bg-white border border-slate-200 rounded-lg pl-9 pr-4 text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="h-[36px] appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 text-[13px] font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div className="relative">
            <select
              value={planFilter}
              onChange={(e) => { setPlanFilter(e.target.value); setPage(1); }}
              className="h-[36px] appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 text-[13px] font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
            >
              <option value="All">All Plans</option>
              <option value="Free">Free</option>
              <option value="Pro">Pro</option>
              <option value="Enterprise">Enterprise</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="w-[36px] h-[36px] flex items-center justify-center bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors shadow-sm">
            <SlidersHorizontal className="h-[15px] w-[15px]" />
          </button>
          <button className="w-[36px] h-[36px] flex items-center justify-center bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors shadow-sm">
            <Download className="h-[15px] w-[15px]" />
          </button>
        </div>
      </div>

      {/* table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-3.5 text-[12px] font-bold text-slate-500 uppercase tracking-wider">Workspace</th>
                <th className="px-6 py-3.5 text-[12px] font-bold text-slate-500 uppercase tracking-wider">Owner</th>
                <th className="px-6 py-3.5 text-[12px] font-bold text-slate-500 uppercase tracking-wider">Members</th>
                <th className="px-6 py-3.5 text-[12px] font-bold text-slate-500 uppercase tracking-wider">Goals</th>
                <th className="px-6 py-3.5 text-[12px] font-bold text-slate-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3.5 text-[12px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
              ) : isError ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-red-500 text-sm">
                    Failed to load workspaces. Please try again.
                  </td>
                </tr>
              ) : workspacesList.length > 0 ? (
                workspacesList.map((workspace, index) => (
                  <tr
                    key={workspace.id}
                    className={`hover:bg-slate-50/50 transition-colors group ${index % 2 !== 0 ? 'bg-slate-50/30' : ''}`}
                  >
                    {/* workspace */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">

                        <WorkspaceAvatar workspace={workspace} size='sm' />


                        <div className="flex flex-col items-start">
                          <span className={`text-[14px] font-medium leading-tight mb-1 ${workspace.status === 'Suspended' ? 'text-red-600 line-through' : 'text-slate-900'}`}>
                            {workspace.name}
                          </span>
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${workspace.planColor}`}>
                            {workspace.plan}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* owner */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {workspace.owner.avatarUrl ? (
                          <img
                            src={workspace.owner.avatarUrl}
                            alt={workspace.owner.name}
                            className="w-6 h-6 rounded-full object-cover shrink-0"
                          />
                        ) : (
                          <div className={`w-6 h-6 rounded-full ${workspace.owner.color} flex items-center justify-center text-[10px] font-bold text-white shrink-0`}>
                            {workspace.owner.initials}
                          </div>
                        )}
                        <span className="text-[14px] text-slate-700">{workspace.owner.name}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-[14px] text-slate-700 font-medium">{workspace.members}</td>
                    <td className="px-6 py-4 text-[14px] text-slate-700 font-medium">{workspace.goals}</td>
                    <td className="px-6 py-4 text-[14px] text-slate-500">{workspace.created}</td>

                    {/* actions */}
                    <td className="px-6 py-4 text-right relative">
                      <button
                        onClick={(e) => toggleDropdown(e, workspace.id)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
                      >
                        <MoreHorizontal className="w-[18px] h-[18px]" />
                      </button>

                      {dropdownOpenId === workspace.id && (
                        <div className={`absolute right-8 ${index >= workspacesList.length - 2 ? 'bottom-10 mb-2' : 'top-10 mt-1'} w-44 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50 overflow-hidden text-left`}>
                          <button
                            onClick={() => setWorkspaceDetails(workspace)}
                            className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center text-left"
                          >
                            View Details
                          </button>
                          <button
                            disabled={workspace.status === 'Suspended'}
                            onClick={() => setIsConfirmSuspendOpen(true)}
                            className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center text-left font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Suspend Workspace
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-slate-500 text-sm">
                    No workspaces found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* pagination */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[13px] text-slate-500">
            Showing {workspacesList.length} workspaces
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 border border-slate-200 rounded-md text-[13px] font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors"
            >
              Previous
            </button>
            <span className="px-3 py-1.5 bg-blue-600 border border-blue-600 rounded-md text-[13px] font-medium text-white shadow-sm">
              {page}
            </span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={workspacesList.length === 0}
              className="px-3 py-1.5 border border-slate-200 rounded-md text-[13px] font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {
        workspaceDetails && <AdminWorkspaceDetailModal workspace={workspaceDetails} onClose={() => setWorkspaceDetails(null)} />
      }


      <DangerConfirmationModal
        isOpen={isConfirmSuspendOpen}
        onClose={() => setIsConfirmSuspendOpen(false)}
        onConfirm={() => null}
        title="Suspend Workspace"
        description="All members will immediately lose access to this workspace."
        confirmButtonText="Yes, Suspend"
        isLoading={isLoading}
      />


    </div>
  );
}