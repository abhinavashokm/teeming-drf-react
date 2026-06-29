import { Check, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import usePlans from '../../hooks/subscription/usePlans';
import PlanCard from '../../components/subscription/PlanCard';
import useWorkspace from "../../hooks/workspace/useWorkspace"
import { formatDate } from "../../utils/timeUtils"
import { currencySymbols, planCodes } from '../../constants/subscriptionConstants';
import CurrentSubscriptionCard from '../../components/subscription/CurrentSubscriptionCard';


function SubscriptionPage() {

    const { data: plans, isPending: isPlansLoading } = usePlans()
    const { data: currentWorkspace } = useWorkspace()

    const subscription = currentWorkspace?.subscription

    const [billingCycle, setBillingCycle] = useState('monthly');
    const scrollContainerRef = useRef(null);
    const [showLeftFade, setShowLeftFade] = useState(false);
    const [showRightFade, setShowRightFade] = useState(true);
    const [hasOverflow, setHasOverflow] = useState(false);

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

                {/* Toggle */}
                {/* <div className="inline-flex items-center justify-center p-1 bg-gray-100/80 border border-gray-200/60 rounded-full mx-auto w-auto">
                    <button
                        onClick={() => setBillingCycle('monthly')}
                        className={`relative z-10 px-4 py-1.5 text-[13px] font-medium rounded-full transition-all duration-200 ${billingCycle === 'monthly' ? 'text-gray-900 shadow-sm bg-white' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setBillingCycle('yearly')}
                        className={`relative z-10 flex items-center gap-1.5 px-4 py-1.5 text-[13px] font-medium rounded-full transition-all duration-200 ${billingCycle === 'yearly' ? 'text-gray-900 shadow-sm bg-white' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Yearly
                        <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full transition-colors leading-none ${billingCycle === 'yearly' ? 'bg-[#1A9E6E]/10 text-[#1A9E6E]' : 'bg-gray-200 text-gray-500'}`}>Save 20%</span>
                    </button>
                </div> */}

            </div>

            {/* Current Subscription */}
            <div className="max-w-[1100px] mx-auto px-6 mb-8">
                <CurrentSubscriptionCard subscription={subscription} />
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
                                    <PlanCard plan={plan} key={plan.id} />
                                ))
                            )
                    }


                    {/* Spacer to ensure the last card isn't flush against the right edge when fully scrolled */}
                    <div className="hidden lg:block flex-none w-6 shrink-0"></div>
                </div>
            </div>

            {/* Footer Note */}
            <p className="text-[13px] text-gray-400 mt-12 mb-4 text-center max-w-lg shrink-0">
                Payments are processed securely via Stripe. You can cancel or change your plan at any time.
            </p>
        </>
    )
}

export default SubscriptionPage