import { AlertTriangle, Plus } from 'lucide-react';
import { useState } from 'react';
import DangerConfirmationModal from '../../components/ui/modal/DangerConfirmationModal';
import CreatePlanModal from '../components/adminPlans/CreatePlanModal';
import PlanCard from '../components/adminPlans/PlanCard';
import AdminButton from '../components/form/AdminButton';
import usePlans from '../hooks/adminPlans/usePlans';


export default function AdminPlanSettings() {

  const [suspendConfirmPlan, setSuspendConfirmPlan] = useState(null);
  const [isCreatePlanOpen, setIsCreatePlanOpen] = useState(false);
  const { data: plansData, isPending: isPlansLoading, isError: isPlansError } = usePlans();
  const plans = plansData?.plans ?? [];

  const activePlans = plans.filter((plan) => !plan.isArchived);
  const archivedPlans = plans.filter((plan) => plan.isArchived);

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
          <>
            {/* Active Plans */}
            {activePlans.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activePlans.map((plan) => (
                  <PlanCard
                    plan={plan}
                    key={plan.id}
                    onSuspend={(plan) => setSuspendConfirmPlan(plan)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
                <h3 className="text-[15px] font-bold text-slate-900">No active plans</h3>
                <p className="text-[13px] text-slate-500 mt-1">All plans are archived. Create a new plan to get started.</p>
              </div>
            )}

            {/* Archived Plans */}
            {archivedPlans.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mt-8 mb-4">
                  <h3 className="text-[13px] font-bold text-slate-400 uppercase tracking-wider">
                    Archived Plans
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-400">
                    {archivedPlans.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {archivedPlans.map((plan) => (
                    <PlanCard plan={plan} key={plan.id} />
                  ))}
                </div>
              </div>
            )}
          </>
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
              Existing plans cannot be edited directly. Use <strong>Create New Version</strong> to update pricing or features — current subscribers stay on their original plan until they upgrade or cancel.
            </p>
            <div className="mt-2">
              <button className="text-[12px] font-bold text-orange-500 uppercase tracking-wide hover:text-orange-600 transition-colors">
                View History
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[12px] text-slate-400">
            {activePlans.length} active · {archivedPlans.length} archived
          </span>
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
        description={`Workspaces currently on the "${suspendConfirmPlan?.name ?? ''}" plan (v${suspendConfirmPlan?.version ?? 1}) will not be able to renew their subscription, and no new workspaces can select it.`}
        confirmButtonText="Yes, Suspend"
      />

      <CreatePlanModal
        isOpen={isCreatePlanOpen}
        onClose={() => setIsCreatePlanOpen(false)}
      />

    </>
  );
}


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