import {
    Target,
    Lightbulb,
    TrendingUp,
    Users,
    Crown,
    ShieldCheck,
    User,
    Check,
    X,
    ArrowRight,
    Sparkles,
} from 'lucide-react';
import { PERMISSIONS } from '../../constants/permissions';

// ─── Permission → human-readable label + category ──────────────────────────

const PERMISSION_LABELS = {
    [PERMISSIONS.MANAGE_GOALS]: { label: 'Create and manage goals', category: 'Goals & Ideas' },
    [PERMISSIONS.MOVE_IDEA_PLANNED]: { label: 'Move ideas to Planned', category: 'Goals & Ideas' },
    [PERMISSIONS.MOVE_IDEA_PROGRESS]: { label: 'Move ideas to In Progress', category: 'Goals & Ideas' },
    [PERMISSIONS.MOVE_IDEA_DONE]: { label: 'Mark ideas as Done', category: 'Goals & Ideas' },
    [PERMISSIONS.DELETE_OTHERS_IDEA]: { label: "Delete teammates' ideas", category: 'Goals & Ideas' },
    [PERMISSIONS.DROP_IDEA]: { label: 'Drop a planned or in-progress idea', category: 'Goals & Ideas' },
    [PERMISSIONS.MANAGE_METRICS]: { label: 'Add and edit metrics', category: 'Outcomes' },
    [PERMISSIONS.MANAGE_CHECKINS]: { label: 'Add and edit check-ins', category: 'Outcomes' },
    [PERMISSIONS.INVITE_MEMBERS]: { label: 'Invite new members', category: 'Team & Workspace' },
    [PERMISSIONS.MANAGE_TEAM]: { label: 'Manage team members and roles', category: 'Team & Workspace' },
    [PERMISSIONS.MANAGE_SETTINGS]: { label: 'Change workspace settings', category: 'Team & Workspace' },
    [PERMISSIONS.LEAVE_WORKSPACE]: { label: 'Leave the workspace', category: 'Team & Workspace' },
    [PERMISSIONS.UPGRADE_PLAN]: { label: 'Upgrade or manage billing', category: 'Billing' },
    [PERMISSIONS.DELETE_WORKSPACE]: { label: 'Delete the workspace', category: 'Billing' },
};

const CATEGORY_ORDER = ['Goals & Ideas', 'Outcomes', 'Team & Workspace', 'Billing'];

const MEMBER_PERMISSIONS = [PERMISSIONS.LEAVE_WORKSPACE];

const ADMIN_PERMISSIONS = [
    ...MEMBER_PERMISSIONS,
    PERMISSIONS.MANAGE_GOALS,
    PERMISSIONS.INVITE_MEMBERS,
    PERMISSIONS.MANAGE_TEAM,
    PERMISSIONS.MANAGE_SETTINGS,
    PERMISSIONS.MOVE_IDEA_PLANNED,
    PERMISSIONS.MOVE_IDEA_PROGRESS,
    PERMISSIONS.MOVE_IDEA_DONE,
    PERMISSIONS.DELETE_OTHERS_IDEA,
    PERMISSIONS.DROP_IDEA,
    PERMISSIONS.MANAGE_CHECKINS,
    PERMISSIONS.MANAGE_METRICS,
];

const OWNER_PERMISSIONS = [
    ...ADMIN_PERMISSIONS.filter((p) => p !== PERMISSIONS.LEAVE_WORKSPACE),
    PERMISSIONS.DELETE_WORKSPACE,
    PERMISSIONS.UPGRADE_PLAN,
];

const ROLES = [
    {
        key: 'member',
        label: 'Member',
        icon: User,
        color: 'text-gray-600',
        bg: 'bg-gray-100',
        summary: 'Can submit ideas, like them, and follow along on outcomes — the person doing the work.',
        permissions: MEMBER_PERMISSIONS,
    },
    {
        key: 'admin',
        label: 'Admin',
        icon: ShieldCheck,
        color: 'text-[#378ADD]',
        bg: 'bg-[#378ADD]/10',
        summary: 'Runs the day-to-day: creates goals, moves ideas through the pipeline, tracks outcomes.',
        permissions: ADMIN_PERMISSIONS,
    },
    {
        key: 'owner',
        label: 'Owner',
        icon: Crown,
        color: 'text-[#1D9E75]',
        bg: 'bg-[#1D9E75]/10',
        summary: 'Everything an Admin can do, plus billing and the workspace itself.',
        permissions: OWNER_PERMISSIONS,
    },
];

// Baseline capabilities every member has, regardless of role — not gated by a permission
const BASELINE_CAPABILITIES = [
    'Submit new ideas for the team to try',
    'Like ideas and join the discussion',
    'View every goal and its outcomes',
    'Chat with teammates and the AI assistant',
];

// ─── Small building blocks ──────────────────────────────────────────────────

function SectionLabel({ children }) {
    return (
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#1D9E75] mb-2">
            {children}
        </p>
    );
}

function LoopStep({ icon: Icon, label, isLast }) {
    return (
        <div className="flex items-center gap-2 shrink-0">
            <div className="flex flex-col items-center gap-2">
                <div className="w-11 h-11 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gray-700" strokeWidth={1.8} />
                </div>
                <span className="text-[12px] font-medium text-gray-700 whitespace-nowrap">{label}</span>
            </div>
            {!isLast && <ArrowRight className="w-4 h-4 text-gray-300 mb-6" />}
        </div>
    );
}

function RoleCard({ role }) {
    const Icon = role.icon;
    return (
        <div className="border border-gray-200 rounded-2xl bg-white p-5">
            <div className="flex items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-xl ${role.bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-4.5 h-4.5 ${role.color}`} strokeWidth={2} />
                </div>
                <h3 className="text-[15px] font-bold text-gray-900">{role.label}</h3>
            </div>
            <p className="text-[13px] text-gray-500 leading-relaxed">{role.summary}</p>
        </div>
    );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function HowItWorksPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-16 pb-24 px-4">

            {/* Hero */}
            <section className="pt-10 text-center">
                <h1 className="text-[28px] font-bold text-gray-900 tracking-tight mb-3">
                    Outcomes, not just tasks
                </h1>
                <p className="text-[14px] text-gray-500 max-w-lg mx-auto leading-relaxed">
                    Most tools track whether work got done. Teeming tracks whether it worked.
                    Here's the thinking behind it, and what your role lets you do.
                </p>
            </section>

            {/* What are OKRs */}
            <section>
                <SectionLabel>The idea behind it</SectionLabel>
                <h2 className="text-[20px] font-bold text-gray-900 mb-3">
                    Why "done" isn't the finish line
                </h2>
                <p className="text-[14px] text-gray-600 leading-relaxed mb-4">
                    OKRs — Objectives and Key Results — are how teams set a clear goal (the
                    Objective) and define specific, measurable signals that prove it's actually
                    happening (the Key Results). The framework was pioneered at Intel by Andy
                    Grove, brought to Google by an early investor in 1999, and has since become
                    the standard at companies like LinkedIn, Spotify, and Airbnb — precisely
                    because it separates <em>activity</em> from <em>impact</em>. A team can ship
                    ten features and still miss the objective if none of them moved the number
                    that mattered.
                </p>
                <p className="text-[14px] text-gray-600 leading-relaxed">
                    Teeming builds that discipline directly into how your team works, without
                    forcing you to run a separate OKR process on the side.
                </p>
            </section>

            {/* How Teeming maps to it */}
            <section>
                <SectionLabel>How Teeming applies it</SectionLabel>
                <h2 className="text-[20px] font-bold text-gray-900 mb-3">
                    The loop your team runs on
                </h2>
                <p className="text-[14px] text-gray-600 leading-relaxed mb-6">
                    A <strong className="text-gray-900">Goal</strong> is your Objective. Every
                    idea your team tries against it is a bet on a Key Result. Once an idea ships,
                    Teeming asks the question most tools skip:{' '}
                    <em>did it actually move anything?</em> That's what the Outcome section is
                    for — baseline numbers, check-ins, and a chart of real progress over time.
                </p>

                <div className="bg-gray-50/70 border border-gray-200 rounded-2xl p-6 overflow-x-auto">
                    <div className="flex items-start justify-center gap-1 min-w-max">
                        <LoopStep icon={Target} label="Goal" />
                        <LoopStep icon={Lightbulb} label="Idea" />
                        <LoopStep icon={Users} label="Planned" />
                        <LoopStep icon={TrendingUp} label="In Progress" />
                        <LoopStep icon={Check} label="Done" />
                        <LoopStep icon={TrendingUp} label="Outcome" isLast />
                    </div>
                </div>
            </section>

            {/* Roles overview */}
            <section>
                <SectionLabel>Your team</SectionLabel>
                <h2 className="text-[20px] font-bold text-gray-900 mb-3">Roles in a workspace</h2>
                <p className="text-[14px] text-gray-600 leading-relaxed mb-6">
                    Every workspace has three roles. Permissions build on top of each other —
                    an Admin can do everything a Member can, and an Owner can do everything an
                    Admin can, plus manage billing and the workspace itself.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    {ROLES.map((role) => (
                        <RoleCard key={role.key} role={role} />
                    ))}
                </div>

                {/* Baseline capabilities */}
                <div className="bg-[#1D9E75]/5 border border-[#1D9E75]/20 rounded-2xl p-5 mb-8">
                    <h3 className="text-[13px] font-bold text-gray-900 mb-3">
                        Everyone in the workspace can:
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {BASELINE_CAPABILITIES.map((item) => (
                            <div key={item} className="flex items-start gap-2">
                                <Check className="w-3.5 h-3.5 text-[#1D9E75] mt-0.5 shrink-0" />
                                <span className="text-[13px] text-gray-700">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </section>
        </div>
    );
}