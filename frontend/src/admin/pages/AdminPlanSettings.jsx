import React, { useState } from 'react';
import { LayoutDashboard, Users, Layers, Settings, LineChart, Search, ChevronDown, Plus, Check, Info, AlertTriangle, Pencil, Ban, X } from 'lucide-react';
import AdminSidebar from '../components/app/AdminSidebar';

export default function AdminPlanSettings() {
  const [suspendConfirmPlan, setSuspendConfirmPlan] = useState(null);
  const [isCreatePlanOpen, setIsCreatePlanOpen] = useState(false);
  return (
    <>
          <div className="max-w-5xl mx-auto space-y-6 pb-12">



            {/* Plans Grid */}
            <div className="grid grid-cols-2 gap-6">

              {/* Starter Free Plan */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6 bg-slate-50/50 border-b border-slate-200 flex-1">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <h3 className="text-[18px] font-bold text-slate-900">Starter Free</h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-8 h-[53px]">
                    <div className="flex-1 bg-white border border-slate-200 rounded-lg p-2 flex flex-col items-center justify-center">
                      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-0.5">Members</span>
                      <span className="text-[14px] font-bold text-slate-900">3</span>
                    </div>
                    <div className="flex-1 bg-white border border-slate-200 rounded-lg p-2 flex flex-col items-center justify-center">
                      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-0.5">Goals</span>
                      <span className="text-[14px] font-bold text-slate-900">5</span>
                    </div>
                    <div className="flex-1 bg-white border border-slate-200 rounded-lg p-2 flex flex-col items-center justify-center">
                      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-0.5">Checks</span>
                      <span className="text-[14px] font-bold text-slate-900">1</span>
                    </div>
                  </div>

                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <Check className="w-[14px] h-[14px] text-emerald-500 shrink-0 mt-0.5" strokeWidth={3} />
                      <span className="text-[14px] text-slate-600">Basic collaboration tools</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-[14px] h-[14px] text-emerald-500 shrink-0 mt-0.5" strokeWidth={3} />
                      <span className="text-[14px] text-slate-600">Discussion feed</span>
                    </li>
                    <li className="flex items-start gap-2 opacity-50">
                      <Check className="w-[14px] h-[14px] text-slate-400 shrink-0 mt-0.5" strokeWidth={3} />
                      <span className="text-[14px] text-slate-400 line-through">Advanced analytics</span>
                    </li>
                  </ul>
                </div>
                <div className="px-6 py-4 bg-white border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Updated Oct 12, 2024</span>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit Plan">
                      <Pencil className="w-[14px] h-[14px]" />
                    </button>
                    <button
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Suspend Plan"
                      onClick={() => setSuspendConfirmPlan('Starter Free')}
                    >
                      <Ban className="w-[14px] h-[14px]" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Professional Plan */}
              <div className="relative bg-white border-2 border-blue-500 rounded-2xl shadow-md flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6 bg-blue-50/50 border-b border-blue-100 flex-1">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3 mt-1">
                      <h3 className="text-[18px] font-bold text-slate-900">Professional</h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-8 h-[53px]">
                    <div className="flex-1 bg-white border border-blue-100 rounded-lg p-2 flex flex-col items-center justify-center">
                      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-0.5">Members</span>
                      <span className="text-[14px] font-bold text-slate-900">25</span>
                    </div>
                    <div className="flex-1 bg-white border border-blue-100 rounded-lg p-2 flex flex-col items-center justify-center">
                      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-0.5">Goals</span>
                      <span className="text-[14px] font-bold text-slate-900">50</span>
                    </div>
                    <div className="flex-1 bg-white border border-blue-100 rounded-lg p-2 flex flex-col items-center justify-center">
                      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-0.5">Checks</span>
                      <span className="text-[14px] font-bold text-slate-900">Unlimited</span>
                    </div>
                  </div>

                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 mb-1">
                      <span className="text-[14px] font-medium text-slate-600">Everything in Free, plus:</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-[14px] h-[14px] text-emerald-500 shrink-0 mt-0.5" strokeWidth={3} />
                      <span className="text-[14px] text-slate-600">Advanced AI Chat Assistant</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-[14px] h-[14px] text-emerald-500 shrink-0 mt-0.5" strokeWidth={3} />
                      <span className="text-[14px] text-slate-600">Export report as CSV</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-[14px] h-[14px] text-emerald-500 shrink-0 mt-0.5" strokeWidth={3} />
                      <span className="text-[14px] text-slate-600">AI Idea suggestions</span>
                    </li>
                  </ul>
                </div>
                <div className="px-6 py-4 bg-white border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Updated Oct 14, 2024</span>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit Plan">
                      <Pencil className="w-[14px] h-[14px]" />
                    </button>
                    <button
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Suspend Plan"
                      onClick={() => setSuspendConfirmPlan('Professional')}
                    >
                      <Ban className="w-[14px] h-[14px]" />
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Implementation Alert */}
            <div className="mt-8 bg-[#FEF9EC] border border-orange-300/30 rounded-xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-orange-400/10 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
              </div>
              <div className="flex-1 flex flex-col">
                <h4 className="text-[14px] font-bold text-slate-900 mb-1">Important Implementation Detail</h4>
                <p className="text-[14px] text-slate-600 leading-relaxed max-w-3xl">
                  Modifying existing plans will affect current subscribers on the next billing cycle. New limit configurations are applied instantly to all active workspaces within the specific plan tier.
                </p>
                <div className="mt-2">
                  <button className="text-[12px] font-bold text-orange-500 uppercase tracking-wide hover:text-orange-600 transition-colors">
                    View History
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Links */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[12px] text-slate-400">Showing 3 active plan configurations.</span>
              <div className="flex items-center gap-6">
                <button className="text-[12px] font-semibold text-blue-500 hover:text-blue-600 transition-colors">Active Subscriptions</button>
                <button className="text-[12px] font-semibold text-blue-500 hover:text-blue-600 transition-colors">Legacy Plans</button>
                <button className="text-[12px] font-semibold text-blue-500 hover:text-blue-600 transition-colors">API Documentation</button>
              </div>
            </div>

          </div>

      {/* Suspend Confirmation Modal */}
      {suspendConfirmPlan && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Suspend Plan</h3>
              <p className="text-sm text-slate-500">
                Are you sure you want to suspend the <span className="font-bold text-slate-700">{suspendConfirmPlan}</span> plan? Workspaces currently on this plan will not be able to renew their subscription, and no new workspaces can select it.
              </p>
            </div>
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setSuspendConfirmPlan(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200/50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setSuspendConfirmPlan(null)}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors"
              >
                Yes, Suspend
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Plan Modal */}
      {isCreatePlanOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Create New Plan</h3>
                <p className="text-sm text-slate-500 mt-1">Configure pricing, limits, and features for a new subscription tier.</p>
              </div>
              <button
                onClick={() => setIsCreatePlanOpen(false)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h4 className="text-[13px] font-bold text-slate-900 uppercase tracking-wider">Basic Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Plan Name</label>
                    <input type="text" placeholder="e.g. Enterprise" className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Monthly Price ($)</label>
                    <input type="number" placeholder="0.00" className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" />
                  </div>
                </div>
              </div>

              {/* Usage Limits */}
              <div className="space-y-4">
                <h4 className="text-[13px] font-bold text-slate-900 uppercase tracking-wider">Usage Limits</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Members</label>
                    <input type="number" placeholder="e.g. 50" className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" />
                    <p className="text-[11px] text-slate-500">Leave blank for unlimited</p>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Active Goals</label>
                    <input type="number" placeholder="e.g. 100" className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Weekly Checks</label>
                    <input type="number" placeholder="e.g. 1" className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors" />
                  </div>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-4">
                <h4 className="text-[13px] font-bold text-slate-900 uppercase tracking-wider">Included Features</h4>

                <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-xl p-4">
                  {[
                    { id: 1, name: 'Basic collaboration tools', included: true },
                    { id: 2, name: 'Discussion feed', included: true },
                    { id: 3, name: 'Advanced analytics dashboard', included: false },
                    { id: 4, name: 'Advanced AI Chat Assistant', included: false },
                    { id: 5, name: 'Export report as CSV', included: false },
                    { id: 6, name: 'AI Idea suggestions', included: false },
                    { id: 7, name: 'Custom branding', included: false },
                  ].map((feature) => (
                    <div key={feature.id} className="flex items-center justify-between pb-3 border-b border-slate-200 last:border-0 last:pb-0">
                      <span className="text-sm text-slate-700 font-medium">{feature.name}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={feature.included} />
                        <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
              <button
                onClick={() => setIsCreatePlanOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200/70 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsCreatePlanOpen(false)}
                className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
              >
                Create Plan
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
