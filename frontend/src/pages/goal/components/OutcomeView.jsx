import { AlertCircle, Info, ThumbsUp, TrendingUp, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import CreateCheckinModal from '../../../components/outcome/CreateCheckinModal';
import CreateMetricsModal from '../../../components/outcome/CreateMetricsModal';
import MetricRow from '../../../components/outcome/MetricRow';
import MemberAvatar from "../../../components/team/MemberAvatar";
import AppButton from "../../../components/ui/buttons/AppButton";
import { CHECKIN_STATUS_LABELS } from '../../../constants/outcomeConstants';
import useCheckins from '../../../hooks/outcome/useCheckins';
import useMetrics from '../../../hooks/outcome/useMetrics';
import { dateToHuman } from '../../../utils/timeUtils';
import CheckinDesktopRow from '../../../components/outcome/CheckinDesktopRow';
import CheckinMobileRow from '../../../components/outcome/CheckinMobileRow';
import CheckinActions from '../../../components/outcome/CheckinActions';
import CheckinRow from '../../../components/outcome/CheckinRow';


function OutcomeView() {

    const { data: metrics } = useMetrics()
    const { data: checkins = [] } = useCheckins()
    console.log(checkins)

    const [isCreateMetricsModalOpen, setIsCreateMetricsModalOpen] = useState(false)
    const [isCreateCheckinModalOpen, setIsCreateCheckinModalOpen] = useState(false)

    return (
        <>
            <div className="max-w-5xl space-y-6 pb-12">
                {/* 1. Outcome Header Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex flex-col min-[1043px]:flex-row min-[1043px]:items-start justify-between gap-4 min-[1043px]:gap-0 mb-6">
                        <div>
                            <h2 className="text-[18px] font-bold text-gray-900 leading-tight">Outcome</h2>
                            <p className="text-[13px] text-gray-500 mt-1">Track what actually changed</p>
                        </div>
                        <div className="flex items-center gap-3 w-full min-[1043px]:w-auto">
                            <button onClick={() => setIsCreateMetricsModalOpen(true)} className="flex-1 min-[1043px]:flex-none px-4 py-2 border border-gray-200 text-gray-700 font-medium rounded-lg text-[13px] hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center">
                                Add Metric
                            </button>
                            <AppButton onClick={() => setIsCreateCheckinModalOpen(true)} >
                                Add Checkin
                            </AppButton>
                        </div>
                    </div>

                    {
                        metrics?.map(metric => {
                            return <MetricRow currentMetric={metric} />
                        })
                    }

                    <div className="flex items-start gap-2 bg-blue-50/50 text-blue-800 p-3 rounded-lg border border-blue-100">
                        <Info className="w-4 h-4 shrink-0 mt-0.5" />
                        <span className="text-[13px]">This idea will be visible to all members of the workspace by default</span>
                    </div>
                </div>

                {/* 2. Metrics Journey Chart */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-1 bg-gray-50/50 w-full sm:w-auto overflow-x-auto scrollbar-hide">
                            <button className="px-3 py-1.5 text-[13px] font-medium bg-white border border-gray-200 shadow-sm rounded-md text-gray-900 shrink-0">Checkout rate</button>
                            <button className="px-3 py-1.5 text-[13px] font-medium text-gray-500 hover:text-gray-700 shrink-0">Drop-off users</button>
                            <button className="px-3 py-1.5 text-[13px] font-medium text-gray-500 hover:text-gray-700 shrink-0">Conversion</button>
                        </div>
                        <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-1.5 rounded-lg text-[13px] font-semibold flex items-center gap-1.5 shrink-0">
                            <TrendingUp className="w-4 h-4" />
                            Total improvement: +15% since baseline
                        </div>
                    </div>

                    <div className="h-[240px] w-full flex items-end">
                        <div className="flex flex-col justify-between text-[11px] text-gray-400 pb-6 pr-4 h-full shrink-0">
                            <span>60%</span>
                            <span>50%</span>
                            <span>40%</span>
                            <span>30%</span>
                            <span>20%</span>
                        </div>
                        <div className="relative flex-1 h-full">
                            {/* Grid Lines */}
                            <div className="absolute left-0 right-0 border-t border-gray-100" style={{ top: '0%' }}></div>
                            <div className="absolute left-0 right-0 border-t border-gray-100" style={{ top: '25%' }}></div>
                            <div className="absolute left-0 right-0 border-t border-gray-100" style={{ top: '50%' }}></div>
                            <div className="absolute left-0 right-0 border-t border-gray-100" style={{ top: '75%' }}></div>
                            <div className="absolute left-0 right-0 border-t border-gray-100" style={{ top: '100%' }}></div>

                            {/* SVG Line & Dots */}
                            <div className="absolute inset-0 mb-6">
                                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                                    <polyline points="0,80 25,60 50,30 75,40 100,0" fill="none" stroke="#378ADD" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                {/* Dots */}
                                <div className="absolute w-3 h-3 bg-white border-[2.5px] border-[#378ADD] rounded-full transform -translate-x-1.5 -translate-y-1.5 z-10 hover:scale-125 transition-transform cursor-pointer" style={{ left: '0%', top: '80%' }}></div>
                                <div className="absolute w-3 h-3 bg-white border-[2.5px] border-[#378ADD] rounded-full transform -translate-x-1.5 -translate-y-1.5 z-10 hover:scale-125 transition-transform cursor-pointer" style={{ left: '25%', top: '60%' }}></div>
                                <div className="absolute w-3 h-3 bg-white border-[2.5px] border-[#378ADD] rounded-full transform -translate-x-1.5 -translate-y-1.5 z-10 hover:scale-125 transition-transform cursor-pointer" style={{ left: '50%', top: '30%' }}></div>
                                <div className="absolute w-3 h-3 bg-white border-[2.5px] border-[#378ADD] rounded-full transform -translate-x-1.5 -translate-y-1.5 z-10 hover:scale-125 transition-transform cursor-pointer" style={{ left: '75%', top: '40%' }}></div>
                                <div className="absolute w-[14px] h-[14px] bg-[#378ADD] border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10 shadow-sm ring-2 ring-[#378ADD]/20 hover:scale-125 transition-transform cursor-pointer" style={{ left: '100%', top: '0%' }}></div>
                            </div>

                            {/* X Axis Labels */}
                            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[11px] text-gray-400 font-medium translate-y-full pt-2">
                                <span>Oct 12</span>
                                <span>Oct 26</span>
                                <span>Nov 9</span>
                                <span>Nov 23</span>
                                <span className="text-gray-900 font-semibold">Dec 7</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Check-ins Section */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <h2 className="text-[16px] font-bold text-gray-900">Check-ins</h2>
                            <span className="text-[12px] text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-full">2 check-ins</span>
                        </div>
                        <span className="text-[13px] text-gray-500 font-medium">Latest to oldest</span>
                    </div>

                    {checkins?.length > 0 ? (
                        checkins.map((checkin, index) => (
                            <CheckinRow
                                key={checkin.id}
                                checkin={checkin}
                                isLast={index === checkins.length - 1}
                            />
                        ))
                    ) : (
                        <div className="py-16 px-6 text-center">
                            <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                <TrendingUp className="w-6 h-6 text-gray-400" />
                            </div>

                            <h3 className="text-[15px] font-semibold text-gray-900">
                                No check-ins yet
                            </h3>

                            <p className="mt-2 text-[13px] text-gray-500 max-w-sm mx-auto">
                                Record progress updates to track whether this idea is creating the outcome you're aiming for.
                            </p>

                            <AppButton onClick={() => setIsCreateCheckinModalOpen(true)} className='mt-3'>
                                Create First Check-in
                            </AppButton>
                        </div>
                    )}
                </div>
            </div >

            <CreateMetricsModal isOpen={isCreateMetricsModalOpen} onClose={() => setIsCreateMetricsModalOpen(false)} />
            <CreateCheckinModal isOpen={isCreateCheckinModalOpen} onClose={() => setIsCreateCheckinModalOpen(false)} />
        </>
    )
}

export default OutcomeView