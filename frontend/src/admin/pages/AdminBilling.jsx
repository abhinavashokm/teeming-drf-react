import { DollarSign, Users, Building2, UserPlus } from 'lucide-react';
import TransactionsTable from '../components/billing/TransactionsTable';
import useBillingOverview from '../hooks/adminBilling/useBillingOverview';
import WorkspaceAvatar from '../../components/workspace/WorkspaceAvatar';

const PLAN_COLORS = {
  FREE: { stroke: '#E2E8F0', dot: 'bg-slate-300', border: 'border-slate-100', bg: 'bg-slate-50/50', text: 'text-slate-700' },
  PRO: { stroke: '#3B82F6', dot: 'bg-blue-500', border: 'border-blue-100', bg: 'bg-blue-50/50', text: 'text-blue-900' },
  ENTERPRISE: { stroke: '#8B5CF6', dot: 'bg-purple-500', border: 'border-purple-100', bg: 'bg-purple-50/50', text: 'text-purple-900' },
};

const CIRCUMFERENCE = 251.2; // 2 * π * r(40)

function buildDonutSegments(planDistribution) {
  let offsetSoFar = 0;
  return planDistribution
    .filter((p) => p.percentage > 0)
    .map((p) => {
      const length = (p.percentage / 100) * CIRCUMFERENCE;
      const segment = {
        ...p,
        dashArray: `${length} ${CIRCUMFERENCE - length}`,
        dashOffset: CIRCUMFERENCE - offsetSoFar,
      };
      offsetSoFar += length;
      return segment;
    });
}

export default function AdminBilling() {
  const { data, isLoading, isError } = useBillingOverview();

  if (isLoading) {
    return <div className="max-w-6xl mx-auto py-12 text-center text-slate-500">Loading billing overview...</div>;
  }

  if (isError || !data) {
    return <div className="max-w-6xl mx-auto py-12 text-center text-red-500">Failed to load billing overview.</div>;
  }

  const { overview, planDistribution, topPayingWorkspaces } = data;
  const donutSegments = buildDonutSegments(planDistribution);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">

      {/* Top Stat Cards */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          label="Total Revenue"
          value={`₹${Number(overview.totalRevenue).toLocaleString()}`}
          sub="All-time collected"
          icon={<DollarSign className="w-4 h-4 text-emerald-600" />}
          iconBg="bg-emerald-50"
        />
        <StatCard
          label="Active Subscriptions"
          value={overview.activeSubscriptions}
          sub="Currently paying workspaces"
          icon={<Users className="w-4 h-4 text-blue-600" />}
          iconBg="bg-blue-50"
        />
        <StatCard
          label="Total Workspaces"
          value={overview.totalWorkspaces}
          sub="Across all plans"
          icon={<Building2 className="w-4 h-4 text-purple-600" />}
          iconBg="bg-purple-50"
        />
        {/* <StatCard
          label="Total Members"
          value={overview.totalMembers}
          sub="Across all workspaces"
          icon={<UserPlus className="w-4 h-4 text-orange-500" />}
          iconBg="bg-orange-50"
        /> */}
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-2 gap-6">

        {/* Plan Distribution */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-[16px] font-bold text-slate-900">Plan Distribution</h3>
              <p className="text-[13px] text-slate-500 mt-1">Share among active subscriptions</p>
            </div>
            <div className="text-right">
              <p className="text-[12px] font-medium text-slate-500">Total Workspaces</p>
              <p className="text-[20px] font-bold text-slate-900 mt-0.5">{overview.totalWorkspaces}</p>
            </div>
          </div>

          <div className="flex items-center gap-8 mt-6">
            <div className="w-32 h-32 relative shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#E2E8F0" strokeWidth="20" />
                {donutSegments.map((seg) => (
                  <circle
                    key={seg.code}
                    cx="50" cy="50" r="40" fill="none"
                    stroke={PLAN_COLORS[seg.code]?.stroke || '#94A3B8'}
                    strokeWidth="20"
                    strokeDasharray={seg.dashArray}
                    strokeDashoffset={seg.dashOffset}
                  />
                ))}
              </svg>
            </div>

            <div className="flex-1 space-y-4">
              {planDistribution.map((p) => {
                const colors = PLAN_COLORS[p.code] || PLAN_COLORS.FREE;
                return (
                  <div key={p.code} className={`flex items-center justify-between p-3 rounded-xl border ${colors.border} ${colors.bg}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${colors.dot}`}></div>
                      <span className={`text-[14px] font-semibold ${colors.text}`}>{p.name}</span>
                    </div>
                    <span className="text-[14px] font-bold text-slate-900">{p.percentage}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Paying Workspaces */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-[16px] font-bold text-slate-900">Top Paying Workspaces</h3>
            <p className="text-[13px] text-slate-500 mt-1">Highest revenue accounts</p>
          </div>

          <div className="space-y-4">
            {topPayingWorkspaces.map((ws, index) => (

              <div key={ws.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-6 text-[13px] font-bold text-slate-400 text-center">
                    #{index + 1}
                  </div>

                  <WorkspaceAvatar workspace={ws} size='sm' />

                  <div>
                    <h4 className="text-[14px] font-bold text-slate-900">{ws.name}</h4>
                    <span className="text-[12px] font-semibold text-slate-500">{ws.plan}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[14px] font-bold text-slate-900">₹{Number(ws.amount).toLocaleString()}</div>
                </div>
              </div>

            ))}
          </div>
        </div>
      </div>

      <TransactionsTable />
    </div>
  );
}

function StatCard({ label, value, sub, icon, iconBg }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <span className="text-[14px] font-semibold text-slate-600">{label}</span>
        <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center`}>{icon}</div>
      </div>
      <h2 className="text-[28px] font-bold text-slate-900 leading-none mb-1">{value}</h2>
      <p className="text-[12px] text-slate-500">{sub}</p>
    </div>
  );
}