import { Check, ChevronLeft, ChevronRight, X, Minus } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import usePlans from '../../hooks/subscription/usePlans';
import PlanCard from '../../components/subscription/PlanCard';
import useWorkspace from "../../hooks/workspace/useWorkspace"
import { formatDate } from "../../utils/timeUtils"
import { currencySymbols, planCodes } from '../../constants/subscriptionConstants';
import CurrentSubscriptionCard from '../../components/subscription/CurrentSubscriptionCard';
import PlanChangeModal from '../../components/subscription/PlanChangeModal';


// ---- Helpers ----

// "AI_ENHANCEMENTS" / "ai_assistant" -> "aiEnhancements" / "aiAssistant"
// so plan.features[].key lines up with workspace.features{} keys
function normalizeKey(key) {
    return key
        .toLowerCase()
        .replace(/_([a-z0-9])/g, (_, c) => c.toUpperCase());
}

// fallback label if a feature key can't be matched to a name anywhere
function prettifyKey(key) {
    const spaced = key.replace(/([A-Z])/g, ' $1').trim();
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function formatPrice(amount, currency) {
    const symbol = currencySymbols?.[currency] || currency || '';
    return `${symbol}${Number(amount).toLocaleString()}/mo`;
}



// Builds comparison rows between the subscribed (current) plan and the
// latest published version of that same plan code.
function buildPlanComparison(currentWorkspace, plans) {
    const subscription = currentWorkspace?.subscription;
    const currentPlanMeta = subscription?.plan;
    if (!subscription || !currentPlanMeta || !plans?.length) return null;

    const latestPlan = plans.find((p) => p.code === currentPlanMeta.code);
    if (!latestPlan) return null;

    const currentFeatures = currentWorkspace?.features || {};
    const currentLimits = currentWorkspace?.limits || {};

    const latestFeatureMap = {};
    latestPlan.features?.forEach((f) => {
        latestFeatureMap[normalizeKey(f.key)] = { enabled: f.enabled, name: f.name };
    });

    const featureKeys = Array.from(
        new Set([...Object.keys(currentFeatures), ...Object.keys(latestFeatureMap)])
    );

    const rows = [
        {
            kind: 'text',
            name: 'Price',
            current: formatPrice(currentPlanMeta.monthlyPrice, currentPlanMeta.currency),
            latest: formatPrice(latestPlan.monthlyPrice, latestPlan.currency),
            changed: currentPlanMeta.monthlyPrice !== latestPlan.monthlyPrice,
        },
        {
            kind: 'limit',
            name: 'Goals',
            current: currentLimits?.goals?.max ?? null,
            latest: latestPlan.maxGoals ?? null,
            changed: (currentLimits?.goals?.max ?? null) !== (latestPlan.maxGoals ?? null),
        },
        {
            kind: 'limit',
            name: 'Members',
            current: currentLimits?.members?.max ?? null,
            latest: latestPlan.maxMembers ?? null,
            changed: (currentLimits?.members?.max ?? null) !== (latestPlan.maxMembers ?? null),
        },
        ...featureKeys.map((key) => {
            const currentVal = currentFeatures[key];
            const latestEntry = latestFeatureMap[key];
            const latestVal = latestEntry?.enabled;
            return {
                kind: 'feature',
                name: latestEntry?.name || prettifyKey(key),
                current: currentVal,
                latest: latestVal,
                changed: Boolean(currentVal) !== Boolean(latestVal),
            };
        }),
    ];

    return {
        planName: latestPlan.name,
        currentVersion: currentPlanMeta.version,
        latestVersion: latestPlan.version,
        renewsOn: subscription.expiresAt ? formatDate(subscription.expiresAt) : null,
        hasChanged: rows.some((r) => r.changed),
        rows,
    };
}

function SubscriptionPage() {

    const { data: plans, isPending: isPlansLoading } = usePlans()
    const { data: currentWorkspace } = useWorkspace()

    const subscription = currentWorkspace?.subscription

    const [billingCycle, setBillingCycle] = useState('monthly');
    const scrollContainerRef = useRef(null);
    const [showLeftFade, setShowLeftFade] = useState(false);
    const [showRightFade, setShowRightFade] = useState(true);
    const [hasOverflow, setHasOverflow] = useState(false);
    const [isPlanChangeModalOpen, setIsPlanChangeModalOpen] = useState(false);

    const planComparison = useMemo(
        () => buildPlanComparison(currentWorkspace, plans),
        [currentWorkspace, plans]
    );

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;

        const {
            scrollLeft,
            scrollWidth,
            clientWidth
        } = scrollContainerRef.current;

        const overflow =
            scrollWidth > clientWidth + 1;

        setHasOverflow(overflow);

        setShowLeftFade(
            overflow && scrollLeft > 20
        );

        setShowRightFade(
            overflow &&
            scrollLeft < scrollWidth - clientWidth - 20
        );
    };

    useEffect(() => {
        handleScroll();
        window.addEventListener('resize', handleScroll);
        return () => window.removeEventListener('resize', handleScroll);
    }, []);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    return (
        <>
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-10 shrink-0 px-6">
                <h1 className="text-[28px] sm:text-[32px] font-bold text-gray-900 tracking-tight mb-3">Choose a plan for {currentWorkspace.name}</h1>
                <p className="text-[15px] text-gray-500 mb-8">All plans are billed per workspace. Upgrade or downgrade anytime.</p>
            </div>

            {/* Current Subscription */}
            <div className="max-w-[1100px] mx-auto px-6 mb-8">
                <CurrentSubscriptionCard subscription={subscription} />

                {/* Plan change note — sits directly below the "Current billing period ends on..." text */}
                {planComparison?.hasChanged && (
                    <p className="text-[13px] text-gray-500 mt-2">
                        The {planComparison.planName} plan has been updated. Your current terms stay the same until then.{' '}
                        <button
                            onClick={() => setIsPlanChangeModalOpen(true)}
                            className="text-gray-700 font-medium underline underline-offset-2 hover:text-gray-900 transition-colors"
                        >
                            See what's changed
                        </button>
                    </p>
                )}
            </div>

            {/* Plan Cards Container */}
            <div className="relative w-full max-w-[1100px] mx-auto shrink-0 group overflow-hidden">
                {/* Edge Fades */}
                <div className={`hidden md:block absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-white to-transparent pointer-events-none z-10 transition-opacity duration-300 ${showLeftFade ? 'opacity-100' : 'opacity-0'}`}></div>
                <div className={`hidden md:block absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 transition-opacity duration-300 ${showRightFade ? 'opacity-100' : 'opacity-0'}`}></div>

                {hasOverflow && (
                    <button
                        onClick={scrollLeft}
                        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-300 transition-all z-20 focus:outline-none opacity-0 group-hover:opacity-100 hidden md:flex"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                )}

                {hasOverflow && (
                    <button
                        onClick={scrollRight}
                        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-300 transition-all z-20 focus:outline-none opacity-0 group-hover:opacity-100 hidden md:flex"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                )}

                <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="
                    flex flex-col lg:flex-row
                    gap-5
                    lg:overflow-x-auto
                    lg:snap-x lg:snap-mandatory
                    scrollbar-hide
                    py-6 px-6 sm:px-12
                    w-full
                "
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none'
                    }}
                >

                    {
                        isPlansLoading ?
                            (
                                [...Array(3)]?.map((val, index) => (
                                    <PlanCard key={index} loading={true} />
                                ))
                            )
                            : (
                                plans?.map((plan) => (
                                    <PlanCard
                                        plan={plan}
                                        key={plan.id}
                                        onViewChanges={() => setIsPlanChangeModalOpen(true)}
                                    />
                                ))
                            )
                    }


                    {/* Spacer to ensure the last card isn't flush against the right edge when fully scrolled */}
                    <div className="hidden lg:block flex-none w-6 shrink-0"></div>
                </div>
            </div>

            {/* Footer Note */}
            <p className="text-[13px] text-gray-400 mt-12 mb-4 text-center w-full shrink-0">
                Payments are processed securely via Stripe. You can cancel or change your plan at any time.
            </p>

            {/* Plan change comparison modal */}
            <PlanChangeModal
                open={isPlanChangeModalOpen}
                onClose={() => setIsPlanChangeModalOpen(false)}
                comparison={planComparison}
            />
        </>
    )
}

export default SubscriptionPage