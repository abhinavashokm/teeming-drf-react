import React, { useState } from 'react';
import { Check, AlertTriangle, Pencil, Ban, Plus } from 'lucide-react';
import usePlans from '../hooks/adminPlans/usePlans';
import DangerConfirmationModal from '../../components/ui/modal/DangerConfirmationModal';
import AdminButton from '../components/form/AdminButton';
import CreatePlanModal from '../components/adminPlans/CreatePlanModal';

const getPlanAccent = (code = '') => {
  const map = {
    FREE: {
      card: 'border-slate-200',
      body: 'bg-slate-50/50 border-slate-200',
      metric: 'border-slate-200',
      badge: 'bg-slate-100 text-slate-700',
    },
    PRO: {
      card: 'border-blue-500 shadow-md',
      body: 'bg-blue-50/50 border-blue-100',
      metric: 'border-blue-100',
      badge: 'bg-blue-100 text-blue-700',
    },
    ENTERPRISE: {
      card: 'border-purple-500 shadow-md',
      body: 'bg-purple-50/50 border-purple-100',
      metric: 'border-purple-100',
      badge: 'bg-purple-100 text-purple-700',
    },
  };

  return map[code?.toUpperCase()] ?? map.FREE;
};

const formatPlanPrice = (plan) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: plan.currency ?? 'INR',
    maximumFractionDigits: 0,
  }).format(Number(plan.monthlyPrice ?? 0));

const formatLimit = (value) => value ?? 'Unlimited';

const planFeatures = (plan) => [
  { label: 'AI idea suggestions', enabled: plan.canUseAiIdeaSuggestions },
  { label: 'AI assistant', enabled: plan.canUseAiAssistant },
  { label: 'Export workspace data', enabled: plan.canExportWorkspaceData },
];

function PlanSkeletonCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-pulse">
      <div className="p-6 bg-slate-50/50 border-b border-slate-200">
        <div className="h-5 w-32 bg-slate-100 rounded mb-4" />
        <div className="h-8 w-28 bg-slate-100 rounded mb-6" />
        <div className="flex items-center gap-3 mb-8 h-[53px]">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex-1 bg-white border border-slate-200 rounded-lg p-2">
              <div className="h-3 w-12 bg-slate-100 rounded mx-auto mb-2" />
              <div className="h-4 w-10 bg-slate-100 rounded mx-auto" />
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <div className="h-4 w-full bg-slate-100 rounded" />
          <div className="h-4 w-5/6 bg-slate-100 rounded" />
          <div className="h-4 w-4/5 bg-slate-100 rounded" />
        </div>
      </div>
      <div className="px-6 py-4 bg-white border-t border-slate-100">
        <div className="h-4 w-24 bg-slate-100 rounded" />
      </div>
    </div>
  );
}

export default function AdminPlanSettings() {
  const [suspendConfirmPlan, setSuspendConfirmPlan] = useState(null);
  const [isCreatePlanOpen, setIsCreatePlanOpen] = useState(false);
  const { data: plansData, isPending: isPlansLoading, isError: isPlansError } = usePlans();
  const plans = plansData?.plans ?? [];
  const activePlansCount = plans.filter((plan) => plan.isActive).length;

  return (
    <>
          <div className="max-w-5xl mx-auto space-y-6 pb-12">

            <div className="flex justify-end">
              <div className="w-fit">
                <AdminButton onClick={() => setIsCreatePlanOpen(true)} className="px-4">
                  <Plus className="w-4 h-4" />
                  Add New Plan
                </AdminButton>
              </div>
            </div>

            {/* Plans Grid */}
            {isPlansLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, index) => (
                  <PlanSkeletonCard key={index} />
                ))}
              </div>
            ) : isPlansError ? (
              <div className="bg-red-50 border border-red-100 rounded-xl p-5 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[14px] font-bold text-red-700">Failed to load plans</h4>
                  <p className="text-[13px] text-red-600 mt-1">Please refresh the page and try again.</p>
                </div>
              </div>
            ) : plans.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan) => {
                  const accent = getPlanAccent(plan.code);
                  const features = planFeatures(plan);

                  return (
                    <div
                      key={plan.id}
                      className={`bg-white border ${accent.card} rounded-2xl shadow-sm flex flex-col overflow-hidden hover:shadow-md transition-shadow`}
                    >
                      <div className={`p-6 border-b flex-1 ${accent.body}`}>
                        <div className="flex items-start justify-between gap-4 mb-5">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-[18px] font-bold text-slate-900">{plan.name}</h3>
                              <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${accent.badge}`}>
                                {plan.code}
                              </span>
                            </div>
                            <p className="text-[13px] text-slate-500 line-clamp-2">{plan.description}</p>
                          </div>
                          <span className={`text-[11px] font-bold ${plan.isActive ? 'text-emerald-600' : 'text-red-600'}`}>
                            {plan.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>

                        <div className="flex items-end gap-1 mb-6">
                          <span className="text-[28px] font-bold text-slate-900 leading-none">{formatPlanPrice(plan)}</span>
                          <span className="text-[12px] font-semibold text-slate-500 mb-1">/mo</span>
                        </div>

                        <div className="flex items-center gap-3 mb-8 h-[53px]">
                          <div className={`flex-1 bg-white border ${accent.metric} rounded-lg p-2 flex flex-col items-center justify-center`}>
                            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-0.5">Members</span>
                            <span className="text-[14px] font-bold text-slate-900">{formatLimit(plan.maxMembers)}</span>
                          </div>
                          <div className={`flex-1 bg-white border ${accent.metric} rounded-lg p-2 flex flex-col items-center justify-center`}>
                            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-0.5">Goals</span>
                            <span className="text-[14px] font-bold text-slate-900">{formatLimit(plan.maxGoals)}</span>
                          </div>
                          <div className={`flex-1 bg-white border ${accent.metric} rounded-lg p-2 flex flex-col items-center justify-center`}>
                            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-0.5">Tier</span>
                            <span className="text-[14px] font-bold text-slate-900">{plan.tier}</span>
                          </div>
                        </div>

                        <ul className="space-y-3">
                          {features.map((feature) => (
                            <li key={feature.label} className={`flex items-start gap-2 ${feature.enabled ? '' : 'opacity-50'}`}>
                              <Check
                                className={`w-[14px] h-[14px] shrink-0 mt-0.5 ${feature.enabled ? 'text-emerald-500' : 'text-slate-400'}`}
                                strokeWidth={3}
                              />
                              <span className={`text-[14px] ${feature.enabled ? 'text-slate-600' : 'text-slate-400 line-through'}`}>
                                {feature.label}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="px-6 py-4 bg-white border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">{plan.currency} billing plan</span>
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit Plan">
                            <Pencil className="w-[14px] h-[14px]" />
                          </button>
                          <button
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Suspend Plan"
                            onClick={() => setSuspendConfirmPlan(plan.name)}
                          >
                            <Ban className="w-[14px] h-[14px]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
                <h3 className="text-[15px] font-bold text-slate-900">No plans found</h3>
                <p className="text-[13px] text-slate-500 mt-1">Create a plan to start configuring subscriptions.</p>
              </div>
            )}

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
              <span className="text-[12px] text-slate-400">Showing {activePlansCount} active plan configurations.</span>
              <div className="flex items-center gap-6">
                <button className="text-[12px] font-semibold text-blue-500 hover:text-blue-600 transition-colors">Active Subscriptions</button>
                <button className="text-[12px] font-semibold text-blue-500 hover:text-blue-600 transition-colors">Legacy Plans</button>
                <button className="text-[12px] font-semibold text-blue-500 hover:text-blue-600 transition-colors">API Documentation</button>
              </div>
            </div>

          </div>

      <DangerConfirmationModal
        isOpen={Boolean(suspendConfirmPlan)}
        onClose={() => setSuspendConfirmPlan(null)}
        onConfirm={() => setSuspendConfirmPlan(null)}
        title="Suspend Plan"
        description={`Workspaces currently on the ${suspendConfirmPlan ?? ''} plan will not be able to renew their subscription, and no new workspaces can select it.`}
        confirmButtonText="Yes, Suspend"
      />

      <CreatePlanModal
        isOpen={isCreatePlanOpen}
        onClose={() => setIsCreatePlanOpen(false)}
      />

    </>
  );
}
