import { Info, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import CheckinRow from '../../../components/outcome/CheckinRow';
import CreateCheckinModal from '../../../components/outcome/CreateCheckinModal';
import CreateMetricsModal from '../../../components/outcome/CreateMetricsModal';
import MetricRow from '../../../components/outcome/MetricRow';
import AppButton from "../../../components/ui/buttons/AppButton";
import useCheckins from '../../../hooks/outcome/useCheckins';
import useMetrics from '../../../hooks/outcome/useMetrics';
import MetricChart from './MetricChart';


function OutcomeView() {

    const { data: metrics } = useMetrics()
    const { data: checkins = [] } = useCheckins()
    console.log(checkins)

    const [isCreateMetricsModalOpen, setIsCreateMetricsModalOpen] = useState(false)
    const [isCreateCheckinModalOpen, setIsCreateCheckinModalOpen] = useState(false)

    return (
        <>
            <div className="max-w-7xl space-y-6 pb-12">
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
                {
                    metrics?.length > 0 
                    &&  <MetricChart />
                }
               

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