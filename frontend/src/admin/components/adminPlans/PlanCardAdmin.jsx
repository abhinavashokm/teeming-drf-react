import { Ban, Check, GitBranch, Archive, Pencil, Lock, ImageOff } from 'lucide-react';
import useSuspendPlan from '../../hooks/adminPlans/useSuspendPlan';
import useRestorePlan from '../../hooks/adminPlans/useRestorePlan';
import { formatDate } from "../../../utils/timeUtils"
import { planCodes } from '../../../constants/subscriptionConstants';

const getPlanAccent = (code = '') => {
    const map = {
        FREE: {
            card: 'border-slate-200',
            body: 'bg-slate-50/50 border-slate-200',
            metric: 'border-slate-200',
            badge: 'bg-slate-100 text-slate-700',
            version: 'bg-slate-100 text-slate-500',
        },
        PRO: {
            card: 'border-blue-400',
            body: 'bg-blue-50/40 border-blue-100',
            metric: 'border-blue-100',
            badge: 'bg-blue-100 text-blue-700',
            version: 'bg-blue-50 text-blue-400',
        },
        ENTERPRISE: {
            card: 'border-purple-400',
            body: 'bg-purple-50/40 border-purple-100',
            metric: 'border-purple-100',
            badge: 'bg-purple-100 text-purple-700',
            version: 'bg-purple-50 text-purple-400',
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

const formatLimit = (value) => (value ?? null) === null ? '∞' : value;

const planFeatures = (plan) => [
    { label: 'AI Enhancements', enabled: plan.canUseAiEnhancements },
    { label: 'AI assistant', enabled: plan.canUseAiAssistant },
    { label: 'Export workspace data', enabled: plan.canExportWorkspaceData },
];

function PlanCardAdmin({ plan, onEdit, onNewVersion, canSuspend }) {
    const accent = getPlanAccent(plan.code);
    const features = planFeatures(plan);
    const isArchived = plan.isArchived;
    const isFreePlan = plan.code?.toUpperCase() === planCodes.FREE;
    const suspendBlocked = isFreePlan || !canSuspend;

    const getSuspendTooltip = () => {
        if (isFreePlan) return 'Free plan cannot be suspended';
        if (!canSuspend) return 'At least 2 active plans must remain';
        return 'Suspend this plan';
    };

    const { mutate: suspendPlan, isPending: isSuspending } = useSuspendPlan();
    const { mutate: restorePlan, isPending: isRestoring } = useRestorePlan();

    const handleSuspend = () => {
        suspendPlan({ planId: plan.id });
    };

    const handleRestore = () => {
        restorePlan({ planId: plan.id });
    };

    return (
        <div className={`bg-white border ${accent.card} rounded-2xl shadow-sm flex flex-col overflow-hidden transition-shadow
            ${isArchived ? 'opacity-55' : 'hover:shadow-md'}`}
        >
            <div className={`p-5 border-b flex-1 ${accent.body}`}>

                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${accent.badge}`}>
                            {plan.code}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${accent.version}`}>
                            v{plan.version}
                        </span>
                        {isArchived && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-400 flex items-center gap-1">
                                <Archive className="w-[9px] h-[9px]" />
                                Archived
                            </span>
                        )}
                        {isFreePlan && !isArchived && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 flex items-center gap-1">
                                <Lock className="w-[9px] h-[9px]" />
                                Protected
                            </span>
                        )}
                    </div>
                    <span className={`text-[11px] font-semibold shrink-0 mt-0.5 ${!isArchived ? 'text-emerald-500' : 'text-slate-400'}`}>
                        {isArchived ? 'Inactive' : '● Active'}
                    </span>
                </div>

                {/* Plan name + description */}
                <div className="mb-5">
                    <h3 className="text-[17px] font-bold text-slate-900 leading-tight">{plan.name}</h3>
                    {plan.description && (
                        <p className="text-[12px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">{plan.description}</p>
                    )}
                </div>

                {/* Price */}
                <div className="flex items-end gap-1 mb-5">
                    <span className="text-[30px] font-extrabold text-slate-900 leading-none tracking-tight">
                        {formatPlanPrice(plan)}
                    </span>
                    <span className="text-[12px] font-medium text-slate-400 mb-1.5">/mo</span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 mb-5">
                    {[
                        { label: 'Members', value: formatLimit(plan.maxMembers) },
                        { label: 'Goals', value: formatLimit(plan.maxGoals) },
                        { label: 'Tier', value: plan.tier },
                    ].map(({ label, value }) => (
                        <div key={label} className={`bg-white border ${accent.metric} rounded-lg py-2 px-1 flex flex-col items-center justify-center`}>
                            <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{label}</span>
                            <span className="text-[13px] font-bold text-slate-800">{value}</span>
                        </div>
                    ))}
                </div>

                {/* Divider */}
                <div className="border-t border-slate-200/70 mb-4" />

                {/* Features */}
                <ul className="space-y-2">
                    {features.map((feature) => (
                        <li key={feature.label} className="flex items-center gap-2">
                            <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0
                                ${feature.enabled ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                                <Check
                                    className={`w-[9px] h-[9px] ${feature.enabled ? 'text-emerald-600' : 'text-slate-300'}`}
                                    strokeWidth={3}
                                />
                            </span>
                            <span className={`text-[13px] ${feature.enabled ? 'text-slate-600' : 'text-slate-300 line-through'}`}>
                                {feature.label}
                            </span>
                        </li>
                    ))}
                </ul>

            </div>

            {/* Footer */}
            <div className="px-5 py-3 bg-white border-t border-slate-100 flex items-center justify-between">
                {isArchived ? (
                    <div className="w-full space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] text-slate-400">
                                {plan.archivedAt ? `Archived ${formatDate(plan.archivedAt)}` : 'Archived'}
                            </span>
                            <span className="text-[11px] font-semibold text-slate-500">
                                {plan.subscriberCount ?? 0} active subscriber{(plan.subscriberCount ?? 0) !== 1 ? 's' : ''}
                            </span>
                        </div>
                        <button
                            className="w-full flex items-center justify-center gap-1.5 py-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-[11px] font-medium"
                            onClick={handleRestore}
                            disabled={isRestoring}
                        >
                            {isRestoring ? 'Restoring...' : (
                                <>
                                    <Archive className="w-[13px] h-[13px]" />
                                    Restore Plan
                                </>
                            )}
                        </button>
                    </div>
                ) : (
                    <>
                        {/* <span className="text-[11px] text-slate-400">{plan.currency}</span> */}
                        <div className="flex items-center justify-end w-full divide-x divide-slate-100">

                            <button
                                className="group flex items-center gap-1.5 px-2.5 py-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-l transition-colors"
                                title="Edit name & description only"
                                onClick={() => onEdit?.(plan)}
                            >
                                <Pencil className="w-[13px] h-[13px]" />
                                <span className="text-[11px] font-medium">Edit</span>
                              {!isFreePlan && <Lock className="w-[9px] h-[9px] opacity-40 group-hover:opacity-70" />}  
                            </button>

                            {/*Suspend and New version Hidden for FREE plan */}
                            {!isFreePlan && (
                                <>
                                    <button
                                        className="flex items-center gap-1.5 px-2.5 py-1 text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-colors"
                                        title="Create new version with updated pricing or features"
                                        onClick={() => onNewVersion?.(plan)}
                                    >
                                        <GitBranch className="w-[13px] h-[13px]" />
                                        <span className="text-[11px] font-medium">New Version</span>
                                    </button>

                                    <div className="relative group">
                                        <button
                                            className="flex items-center gap-1.5 px-2.5 py-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-r transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-slate-400"
                                            onClick={handleSuspend}
                                            disabled={suspendBlocked || isSuspending}
                                            title={getSuspendTooltip()}
                                        >
                                            {isSuspending ? (
                                                <span className="text-[11px] font-medium">Suspending...</span>
                                            ) : (
                                                <>
                                                    <Ban className="w-[13px] h-[13px]" />
                                                    <span className="text-[11px] font-medium">Suspend</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </>
                            )}

                        </div>
                    </>
                )}
            </div>

        </div>
    );
}

export default PlanCardAdmin;