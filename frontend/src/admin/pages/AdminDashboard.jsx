import React from 'react';
import { LayoutDashboard, Users, Layers, Settings, LineChart, Target, UserPlus, ArrowUp } from 'lucide-react';
import AdminSidebar from '../components/app/AdminSidebar';

export default function AdminDashboard() {
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
              <h3 className="text-[28px] leading-none font-bold text-slate-900">24</h3>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUp className="w-3 h-3 text-emerald-500" strokeWidth={3} />
                <span className="text-xs font-semibold text-emerald-600">6 vs yesterday</span>
              </div>
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

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-3 text-[12px] font-bold text-slate-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-[12px] font-bold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-[12px] font-bold text-slate-500 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-3 text-[12px] font-bold text-slate-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-[12px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-[11px] font-bold text-white shrink-0">AK</div>
                    <span className="text-[14px] font-medium text-slate-900">Arjun Kumar</span>
                  </div>
                </td>
                <td className="px-6 py-3.5 text-[14px] text-slate-500">arjun.k@example.com</td>
                <td className="px-6 py-3.5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[12px] font-medium bg-amber-100 text-amber-700">Pro</span>
                </td>
                <td className="px-6 py-3.5 text-[14px] text-slate-500">2 mins ago</td>
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-[14px] text-slate-700">Active</span>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-[11px] font-bold text-white shrink-0">SR</div>
                    <span className="text-[14px] font-medium text-slate-900">Sara R.</span>
                  </div>
                </td>
                <td className="px-6 py-3.5 text-[14px] text-slate-500">sara.r@example.com</td>
                <td className="px-6 py-3.5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[12px] font-medium bg-slate-100 text-slate-600">Free</span>
                </td>
                <td className="px-6 py-3.5 text-[14px] text-slate-500">15 mins ago</td>
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-[14px] text-slate-700">Active</span>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-[11px] font-bold text-white shrink-0">KP</div>
                    <span className="text-[14px] font-medium text-slate-900">Kiran P.</span>
                  </div>
                </td>
                <td className="px-6 py-3.5 text-[14px] text-slate-500">kiran.p@example.com</td>
                <td className="px-6 py-3.5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[12px] font-medium bg-slate-100 text-slate-600">Free</span>
                </td>
                <td className="px-6 py-3.5 text-[14px] text-slate-500">1 hour ago</td>
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <span className="text-[14px] text-slate-700">Pending</span>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-[11px] font-bold text-white shrink-0">MJ</div>
                    <span className="text-[14px] font-medium text-slate-900">Meera J.</span>
                  </div>
                </td>
                <td className="px-6 py-3.5 text-[14px] text-slate-500">meera.j@example.com</td>
                <td className="px-6 py-3.5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[12px] font-medium bg-amber-100 text-amber-700">Pro</span>
                </td>
                <td className="px-6 py-3.5 text-[14px] text-slate-500">2 hours ago</td>
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-[14px] text-slate-700">Active</span>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-[11px] font-bold text-white shrink-0">DK</div>
                    <span className="text-[14px] font-medium text-slate-900">Dev K.</span>
                  </div>
                </td>
                <td className="px-6 py-3.5 text-[14px] text-slate-500">dev.k@example.com</td>
                <td className="px-6 py-3.5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[12px] font-medium bg-slate-100 text-slate-600">Free</span>
                </td>
                <td className="px-6 py-3.5 text-[14px] text-slate-500">3 hours ago</td>
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-[14px] text-slate-700">Active</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

  );
}
