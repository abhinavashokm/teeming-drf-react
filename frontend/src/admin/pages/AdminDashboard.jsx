import React from 'react';
import { Users, Layers, Target, UserPlus, ArrowUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import useAdminUsers from '../hooks/users/useAdminUsers';
import MemberAvatar from '../../components/team/MemberAvatar';
import DataTable from '../components/table/DataTable';

export default function AdminDashboard() {
  const { data, isPending, isError } = useAdminUsers({ joined: 'today' })

  const recentSignups = data?.users ?? []
  const recentSignupsCount = data?.pagination?.count ?? recentSignups.length

  const columns = [
    {
      key: 'user',
      header: 'User',
      render: (user) => (
        <div className="flex items-center gap-3">
          <MemberAvatar user={user} size="sm" />
          <span className="text-[14px] font-medium text-slate-900">{user.fullName}</span>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      render: (user) => <span className="text-[14px] text-slate-500">{user.email}</span>,
    },
    {
      key: 'workspaces',
      header: 'Workspaces',
      render: (user) => (
        <span className="text-[14px] text-slate-900 font-medium">
          {user.workspaceCount} Workspace{user.workspaceCount !== 1 ? 's' : ''}
        </span>
      ),
    },
    {
      key: 'joined',
      header: 'Joined',
      render: (user) => (
        <span className="text-[14px] text-slate-500">
          {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (user) => (
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-emerald-500' :
              user.status === 'pending' ? 'bg-amber-500' :
                'bg-red-500'
            }`} />
          <span className={`text-[14px] font-medium capitalize ${user.status === 'suspended' ? 'text-red-600' : 'text-slate-900'
            }`}>
            {user.status}
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat 1 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-semibold text-slate-500">Total Users</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center shadow-sm">
              <Users className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-[28px] leading-none font-bold text-slate-900">1,248</h3>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUp className="w-3 h-3 text-emerald-500" strokeWidth={3} />
                <span className="text-xs font-semibold text-emerald-600">12 this week</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-semibold text-slate-500">Total Workspaces</span>
            <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center shadow-sm">
              <Layers className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-[28px] leading-none font-bold text-slate-900">342</h3>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUp className="w-3 h-3 text-emerald-500" strokeWidth={3} />
                <span className="text-xs font-semibold text-emerald-600">8 this week</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-semibold text-slate-500">Total Goals</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center shadow-sm">
              <Target className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-[28px] leading-none font-bold text-slate-900">1,890</h3>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUp className="w-3 h-3 text-emerald-500" strokeWidth={3} />
                <span className="text-xs font-semibold text-emerald-600">34 this week</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-semibold text-slate-500">New Signups Today</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center shadow-sm">
              <UserPlus className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-[28px] leading-none font-bold text-slate-900">
                {isPending ? '—' : recentSignupsCount}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-[16px] font-bold text-slate-900">Recent Signups</h2>
            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[11px] font-bold rounded uppercase tracking-wider">Today</span>
          </div>
          <button className="text-[13px] font-semibold text-blue-600 hover:text-blue-700 transition-colors">
            View All
          </button>
        </div>

        <DataTable
          columns={columns}
          data={recentSignups}
          isPending={isPending}
          isError={isError}
          emptyMessage="No signups yet today."
          errorMessage="Failed to load recent signups."
          skeletonRows={5}
        />
      </div>

    </div>
  );
}