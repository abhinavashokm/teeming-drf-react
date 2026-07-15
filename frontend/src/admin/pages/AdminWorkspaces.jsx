import {
  ChevronDown,
  Download, MoreHorizontal,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import DangerConfirmationModal from "../../components/ui/modal/DangerConfirmationModal";
import WorkspaceAvatar from "../../components/workspace/WorkspaceAvatar";
import { planCodes } from '../../constants/subscriptionConstants';
import { formatDate } from "../../utils/timeUtils";
import AdminWorkspaceDetailModal from '../components/adminWorkspaces/AdminWorkspaceDetailModal';
import DataTable from '../components/table/DataTable';
import useAdminWorkspaces from '../hooks/workspaces/useAdminWorkspaces';
import usePlans from '../hooks/adminPlans/usePlans';

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
  version: `V${ws.activeSubscription?.plan?.version}`,
  planCode: ws.activeSubscription?.plan?.code ?? planCodes.FREE,
  planColor: getPlanColor(ws.activeSubscription?.plan?.code),
  members: ws.memberCount,
  goals: ws.goalCount,
  created: formatDate(ws.createdAt),
  owner: {
    ...ws.owner,
    name: ws.owner?.fullName || ws.owner?.email || 'Unknown',
    initials: getInitials(ws.owner?.fullName || ws.owner?.email || ''),
    color: colorFor(ws.owner?.id),
  },
});

// ─── main component ──────────────────────────────────────────────────────────

export default function AdminWorkspaces() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [planFilter, setPlanFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [dropdownOpenId, setDropdownOpenId] = useState(null);

  const { data, isLoading, isError } = useAdminWorkspaces(
    {
      search: searchQuery,
      status: statusFilter,
      plan: planFilter,
      page,
    }
  )

  const workspacesList = useMemo(
    () => (data?.workspaces ?? []).map(transformWorkspace),
    [data]
  );

  const pagination = data?.pagination ?? {};
  const {
    count: totalCount = 0,
    totalPages = 0,
    currentPage = page,
    hasNext = false,
    hasPrevious = false,
  } = pagination;

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
  const [suspendTarget, setSuspendTarget] = useState(null)
  const [isConfirmSuspendOpen, setIsConfirmSuspendOpen] = useState(false)

  const columns = [
    {
      key: 'workspace',
      header: 'Workspace',
      render: (workspace) => (
        <div className="flex items-center gap-3">
          <WorkspaceAvatar workspace={workspace} size='sm' />
          <div className="flex flex-col items-start">
            <span className={`text-[14px] font-medium leading-tight mb-1 ${workspace.status === 'Suspended' ? 'text-red-600 line-through' : 'text-slate-900'}`}>
              {workspace.name}
            </span>
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${workspace.planColor}`}>
              {`${workspace.plan}-${workspace.version}`}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'owner',
      header: 'Owner',
      render: (workspace) => (
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
      ),
    },
    {
      key: 'members',
      header: 'Members',
      render: (workspace) => <span className="text-[14px] text-slate-700 font-medium">{workspace.members}</span>,
    },
    {
      key: 'goals',
      header: 'Goals',
      render: (workspace) => <span className="text-[14px] text-slate-700 font-medium">{workspace.goals}</span>,
    },
    {
      key: 'created',
      header: 'Created',
      render: (workspace) => <span className="text-[14px] text-slate-500">{workspace.created}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (workspace, index) => (
        <>
          <button
            onClick={(e) => toggleDropdown(e, workspace.id)}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
          >
            <MoreHorizontal className="w-[18px] h-[18px]" />
          </button>

          {dropdownOpenId === workspace.id && (
            <div className={`absolute right-8 ${index >= workspacesList.length - 2 ? 'bottom-10 mb-2' : 'top-10 mt-1'} w-44 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50 overflow-hidden text-left`}>
              <button
                onClick={() => { setWorkspaceDetails(workspace); setDropdownOpenId(null); }}
                className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center text-left"
              >
                View Details
              </button>
              {/* <button
                disabled={workspace.status === 'Suspended'}
                onClick={() => { setSuspendTarget(workspace); setIsConfirmSuspendOpen(true); setDropdownOpenId(null); }}
                className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center text-left font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suspend Workspace
              </button> */}
            </div>
          )}
        </>
      ),
    },
  ];

  /* -------------------------------------------------------------------------- */
  /* fetch plans for showing filter options */
  /* -------------------------------------------------------------------------- */
  const { data: plansData, isPending: isPlansLoading, isError: isPlansError } = usePlans();
  const plans = plansData?.plans ?? [];

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

          {/* <div className="relative">
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
          </div> */}

          <div className="relative">
            <select
              value={planFilter}
              onChange={(e) => { setPlanFilter(e.target.value); setPage(1); }}
              disabled={isPlansLoading}
              className="h-[36px] appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 text-[13px] font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <option value="All">All Plans</option>
              {!isPlansError && plans.map((plan) => (
                <option key={plan.code} value={plan.code}>
                  {plan.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </div>
          </div>
        </div>

        {/* <div className="flex items-center gap-2">
          <button className="w-[36px] h-[36px] flex items-center justify-center bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors shadow-sm">
            <SlidersHorizontal className="h-[15px] w-[15px]" />
          </button>
          <button className="w-[36px] h-[36px] flex items-center justify-center bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors shadow-sm">
            <Download className="h-[15px] w-[15px]" />
          </button>
        </div> */}
      </div>

      <DataTable
        columns={columns}
        data={workspacesList}
        isPending={isLoading}
        isError={isError}
        emptyMessage="No workspaces found matching your filters."
        errorMessage="Failed to load workspaces. Please try again."
        skeletonRows={8}
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        hasNext={hasNext}
        hasPrevious={hasPrevious}
        onPageChange={setPage}
      />

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