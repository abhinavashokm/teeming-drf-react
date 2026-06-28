import { Ban, Check, GitBranch, Archive, Pencil } from 'lucide-react';

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

const formatLimit = (value) => (value ?? null) === null ? 'Unlimited' : value;

const planFeatures = (plan) => [
    { label: 'AI idea suggestions', enabled: plan.canUseAiIdeaSuggestions },
    { label: 'AI assistant', enabled: plan.canUseAiAssistant },
    { label: 'Export workspace data', enabled: plan.canExportWorkspaceData },
];

function PlanCard({ plan, onEdit, onNewVersion, onSuspend }) {
    const accent = getPlanAccent(plan.code);
    const features = planFeatures(plan);
    const isArchived = plan.isArchived;  // use the actual field

    return (
        <div
            className={`bg-white border ${accent.card} rounded-2xl shadow-sm flex flex-col overflow-hidden transition-shadow
                ${isArchived ? 'opacity-60 grayscale-[30%]' : 'hover:shadow-md'}`}
        >
            <div className={`p-6 border-b flex-1 ${accent.body}`}>

                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-[18px] font-bold text-slate-900">{plan.name}</h3>
                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${accent.badge}`}>
                                {plan.code}
                            </span>
                            {isArchived && (
                                <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 flex items-center gap-1">
                                    <Archive className="w-[10px] h-[10px]" />
                                    Archived
                                </span>
                            )}
                        </div>
                        <p className="text-[13px] text-slate-500 line-clamp-2">{plan.description}</p>
                    </div>
                    <span className={`text-[11px] font-bold shrink-0 ${!isArchived ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {isArchived ? 'Archived' : 'Active'}
                    </span>
                </div>

                {/* Price */}
                <div className="flex items-end gap-1 mb-6">
                    <span className="text-[28px] font-bold text-slate-900 leading-none">{formatPlanPrice(plan)}</span>
                    <span className="text-[12px] font-semibold text-slate-500 mb-1">/mo</span>
                </div>

                {/* Metrics */}
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

                {/* Features */}
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

            {/* Footer */}
            <div className="px-6 py-4 bg-white border-t border-slate-100 flex items-center justify-between">
                {isArchived ? (
                    <>
                        <span className="text-[11px] text-slate-400">
                            {plan.currency} · archived {plan.archivedAt ? `on ${new Date(plan.archivedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}` : ''}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-400">
                            {plan.subscriberCount ?? 0} active subscriber{(plan.subscriberCount ?? 0) !== 1 ? 's' : ''}
                        </span>
                    </>
                ) : (
                    <>
                        <span className="text-[11px] text-slate-400">{plan.currency} · v{plan.version}</span>
                        <div className="flex items-center gap-2">
                            <button
                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="Edit name & description"
                                onClick={() => onEdit?.(plan)}
                            >
                                <Pencil className="w-[14px] h-[14px]" />
                            </button>
                            <button
                                className="p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded transition-colors"
                                title="Create New Version"
                                onClick={() => onNewVersion?.(plan)}
                            >
                                <GitBranch className="w-[14px] h-[14px]" />
                            </button>
                            <button
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Suspend Plan"
                                onClick={() => onSuspend?.(plan)}
                            >
                                <Ban className="w-[14px] h-[14px]" />
                            </button>
                        </div>
                    </>
                )}
            </div>

        </div>
    );
}

export default PlanCard;