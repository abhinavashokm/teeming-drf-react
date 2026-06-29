import { Clock, DollarSign, TrendingUp, Users } from 'lucide-react';
import TransactionsTable from '../components/billing/TransactionsTable';

const mockTransactions = [
  { id: 1, workspace: 'Acme Design Studio', owner: 'Sarah Jenkins', plan: 'Pro', amount: '$29.00', status: 'Paid', date: 'Jan 18, 2025' },
  { id: 2, workspace: 'Global Tech Corp', owner: 'Michael Chen', plan: 'Enterprise', amount: '$849.00', status: 'Pending', date: 'Jan 18, 2025' },
  { id: 3, workspace: 'StartUp X', owner: 'Jessica Miller', plan: 'Pro', amount: '$29.00', status: 'Failed', date: 'Jan 17, 2025' },
  { id: 4, workspace: 'Digital Nomads', owner: 'Robert Pike', plan: 'Free', amount: '$0.00', status: 'Paid', date: 'Jan 16, 2025' },
  { id: 5, workspace: 'Creative Flow', owner: 'Lena Headey', plan: 'Free', amount: '$0.00', status: 'Paid', date: 'Jan 16, 2025' },
  { id: 6, workspace: 'Design Co', owner: 'Alice Smith', plan: 'Pro', amount: '$29.00', status: 'Paid', date: 'Feb 12, 2025' },
  { id: 7, workspace: 'Tech Innovators', owner: 'Bob Jones', plan: 'Enterprise', amount: '$849.00', status: 'Paid', date: 'Feb 10, 2025' },
  { id: 8, workspace: 'Marketing Pros', owner: 'Charlie Brown', plan: 'Pro', amount: '$29.00', status: 'Paid', date: 'Mar 05, 2025' },
  { id: 9, workspace: 'Web Wizards', owner: 'Diana Prince', plan: 'Free', amount: '$0.00', status: 'Paid', date: 'Mar 02, 2025' },
  { id: 10, workspace: 'App Builders', owner: 'Eve Adams', plan: 'Pro', amount: '$29.00', status: 'Failed', date: 'Apr 15, 2025' },
  { id: 11, workspace: 'Data Insights', owner: 'Frank White', plan: 'Enterprise', amount: '$849.00', status: 'Paid', date: 'Apr 10, 2025' },
  { id: 12, workspace: 'Cloud Solutions', owner: 'Grace Lee', plan: 'Pro', amount: '$29.00', status: 'Paid', date: 'May 20, 2025' },
  { id: 13, workspace: 'AI Ventures', owner: 'Henry Ford', plan: 'Enterprise', amount: '$849.00', status: 'Paid', date: 'May 18, 2025' },
  { id: 14, workspace: 'E-commerce Experts', owner: 'Ivy Green', plan: 'Pro', amount: '$29.00', status: 'Pending', date: 'Jun 25, 2025' },
  { id: 15, workspace: 'Social Media Gurus', owner: 'Jack Black', plan: 'Free', amount: '$0.00', status: 'Paid', date: 'Jun 22, 2025' },
];

export default function AdminBilling() {

  return (

    <div className="max-w-6xl mx-auto space-y-6 pb-12">

      {/* Top Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <span className="text-[14px] font-semibold text-slate-600">Monthly Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div className="flex items-end gap-3 mb-1">
            <h2 className="text-[28px] font-bold text-slate-900 leading-none">$124,582</h2>
            <span className="flex items-center gap-1 text-[13px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-emerald-700 mb-1">
              +12.4%
            </span>
          </div>
          <p className="text-[12px] text-slate-500">Current Month MRR Trend</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <span className="text-[14px] font-semibold text-slate-600">Active Subscriptions</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div className="flex items-end gap-2 mb-2">
            <h2 className="text-[28px] font-bold text-slate-900 leading-none">1,842</h2>
            <span className="text-[14px] text-slate-500 mb-1 font-medium">total</span>
          </div>
          <p className="text-[12px] text-slate-500">Pro: 1,420 • Enterprise: 422</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <span className="text-[14px] font-semibold text-slate-600">Average MRR</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-purple-600" />
            </div>
          </div>
          <div className="flex items-end gap-3 mb-1">
            <h2 className="text-[28px] font-bold text-slate-900 leading-none">$68.40</h2>
            <span className="flex items-center gap-1 text-[13px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-emerald-700 mb-1">
              +$4.2
            </span>
          </div>
          <p className="text-[12px] text-slate-500">Average per workspace</p>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <span className="text-[14px] font-semibold text-slate-600">Trial Workspaces</span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
              <Clock className="w-4 h-4 text-orange-500" />
            </div>
          </div>
          <div className="flex items-end gap-2 mb-2">
            <h2 className="text-[28px] font-bold text-slate-900 leading-none">248</h2>
            <span className="text-[14px] text-slate-500 mb-1 font-medium">active</span>
          </div>
          <p className="text-[12px] text-slate-500">18.5% conversion rate avg</p>
        </div>
      </div>

      {/* Middle Section (Distribution & Top Workspaces) */}
      <div className="grid grid-cols-2 gap-6">

        {/* Plan Distribution */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-[16px] font-bold text-slate-900">Plan Distribution</h3>
              <p className="text-[13px] text-slate-500 mt-1">Market share by workspace plan</p>
            </div>
            <div className="text-right">
              <p className="text-[12px] font-medium text-slate-500">Total Workspaces</p>
              <p className="text-[20px] font-bold text-slate-900 mt-0.5">4,520</p>
            </div>
          </div>

          <div className="flex items-center gap-8 mt-6">
            {/* Fake Donut Chart */}
            <div className="w-32 h-32 relative shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {/* Free - 59.2% */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="#E2E8F0" strokeWidth="20" />
                {/* Pro - 31.4% */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="#3B82F6" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset="102" />
                {/* Enterprise - 9.4% */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="#8B5CF6" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset="227" />
              </svg>
            </div>

            {/* Legend */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                  <span className="text-[14px] font-semibold text-slate-700">Free Tier</span>
                </div>
                <span className="text-[14px] font-bold text-slate-900">59.2%</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl border border-blue-100 bg-blue-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-[14px] font-semibold text-blue-900">Pro Plan</span>
                </div>
                <span className="text-[14px] font-bold text-slate-900">31.4%</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl border border-purple-100 bg-purple-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-[14px] font-semibold text-purple-900">Enterprise</span>
                </div>
                <span className="text-[14px] font-bold text-slate-900">9.4%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Paying Workspaces */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-[16px] font-bold text-slate-900">Top Paying Workspaces</h3>
            <p className="text-[13px] text-slate-500 mt-1">Highest MRR accounts</p>
          </div>

          <div className="space-y-4">
            {[
              { initials: 'GC', name: 'Global Tech Corp', plan: 'Enterprise', amount: '$2,450/mo', growth: '+4%', bg: 'bg-indigo-100', text: 'text-indigo-700' },
              { initials: 'AX', name: 'Apex Robotics', plan: 'Enterprise', amount: '$1,820/mo', growth: '+8%', bg: 'bg-emerald-100', text: 'text-emerald-700' },
              { initials: 'NS', name: 'Nexus Systems', plan: 'Pro', amount: '$840/mo', growth: '+12%', bg: 'bg-amber-100', text: 'text-amber-700' },
              { initials: 'CS', name: 'CloudSync Inc', plan: 'Pro', amount: '$720/mo', growth: '+2%', bg: 'bg-pink-100', text: 'text-pink-700' },
            ].map((ws, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-[13px] font-bold ${ws.bg} ${ws.text}`}>
                    {ws.initials}
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-slate-900">{ws.name}</h4>
                    <span className="text-[12px] font-semibold text-slate-500">{ws.plan}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[14px] font-bold text-slate-900">{ws.amount}</div>
                  <div className="text-[11px] font-bold text-emerald-600">{ws.growth}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <TransactionsTable transactions={mockTransactions} />

    </div>

  );
}
