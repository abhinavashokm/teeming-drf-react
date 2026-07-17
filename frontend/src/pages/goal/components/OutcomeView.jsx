import { Info, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import CheckinFormModal from '../../../components/outcome/CheckinFormModal';
import CheckinRow from '../../../components/outcome/CheckinRow';
import MetricFormModal from '../../../components/outcome/MetricFormModal';
import MetricRow from '../../../components/outcome/MetricRow';
import AppButton from "../../../components/ui/buttons/AppButton";
import { PERMISSIONS } from '../../../constants/permissions';
import useGoal from "../../../hooks/goal/useGoal";
import useCheckins from '../../../hooks/outcome/useCheckins';
import useMetrics from '../../../hooks/outcome/useMetrics';
import { useCan } from "../../../hooks/permissions/useCan";
import MetricChart from './MetricChart';


function OutcomeView() {

    const { data: currentGoal  } = useGoal()

    const { data: metrics } = useMetrics()
    const { data: checkins = [] } = useCheckins()

    const [isMetricFormModalOpen, setIsMetricFormModalOpen] = useState(false)
    const [isCheckinFormModalOpen, setIsCheckinFormModalOpen] = useState(false)

    const canManageMetrics = useCan(PERMISSIONS.MANAGE_METRICS)
    const canManageCheckins = useCan(PERMISSIONS.MANAGE_CHECKINS)

    return (
        <>
             <div className="max-w-7xl px-8 md:px-12 lg:px-16 pb-8 md:pb-12 space-y-6">
                {/* 1. Outcome Header Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex flex-col min-[1210px]:flex-row min-[1210px]:items-start justify-between gap-4 min-[1210px]:gap-0 mb-6">
                        <div>
                            <h2 className="text-[18px] font-bold text-gray-900 leading-tight">Outcome</h2>
                            <p className="text-[13px] text-gray-500 mt-1">Track what actually changed</p>
                        </div>

                        <div className="flex items-center gap-3 w-full min-[1210px]:w-auto">
                            {
                                canManageMetrics &&
                                <button onClick={() => setIsMetricFormModalOpen(true)} className="flex-1 min-[1210px]:flex-none px-4 py-2 border border-gray-200 text-gray-700 font-medium rounded-lg text-[13px] hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center">
                                    Add Metric
                                </button>
                            }
                            {
                                canManageCheckins &&
                                <AppButton onClick={() => setIsCheckinFormModalOpen(true)} >
                                    Add Checkin
                                </AppButton>
                            }
                        </div>

                    </div>

                    {metrics?.length > 0 ? (
                        metrics.map(metric => (
                            <MetricRow currentMetric={metric} canManageMetrics={canManageCheckins} />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 px-4 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200 mb-4">
                            <p className="text-[13px] font-semibold text-gray-700">No metrics yet</p>
                            <p className="text-[12px] text-gray-400 mt-0.5 max-w-xs">
                                Add a metric to start measuring the real impact of this idea.
                            </p>
                            {canManageMetrics && (
                                <button
                                    onClick={() => setIsMetricFormModalOpen(true)}
                                    className="mt-3 px-3.5 py-1.5 text-[12px] font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                                >
                                    Add Metric
                                </button>
                            )}
                        </div>
                    )}
                    {
                        (canManageCheckins || canManageMetrics) &&
                        <div className="flex items-start gap-2 bg-blue-50/50 text-blue-800 p-3 rounded-lg border border-blue-100">
                            <Info className="w-4 h-4 shrink-0 mt-0.5" />
                            <span className="text-[13px]">Add metrics and check in regularly to measure progress and keep your idea moving forward</span>
                        </div>
                    }

                </div>

                {/* 2. Metrics Journey Chart */}
                {
                    metrics?.length > 0 
                    && <MetricChart />
                }

                {/* 3. Check-ins Section */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm ">
                    <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <h2 className="text-[16px] font-bold text-gray-900">Check-ins</h2>
                            <span className="text-[12px] text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-full">{checkins?.length ?? 0} check-ins</span>
                        </div>
                        <span className="text-[13px] text-gray-500 font-medium">Latest to oldest</span>
                    </div>

                    {checkins?.length > 0 ? (
                        checkins.map((checkin, index) => (
                            <CheckinRow
                                key={checkin.id}
                                checkin={checkin}
                                isLast={index === checkins.length - 1}
                                canManageCheckins={canManageCheckins}
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

                            {
                                canManageCheckins &&
                                <AppButton onClick={() => setIsCheckinFormModalOpen(true)} className='mt-3'>
                                    Create First Check-in
                                </AppButton>
                            }

                        </div>
                    )}
                </div>
            </div >

            <MetricFormModal isOpen={isMetricFormModalOpen} onClose={() => setIsMetricFormModalOpen(false)} goalName={currentGoal?.name} />
            <CheckinFormModal isOpen={isCheckinFormModalOpen} onClose={() => setIsCheckinFormModalOpen(false)} goalName={currentGoal?.name} />
        </>
    )
}

export default OutcomeView