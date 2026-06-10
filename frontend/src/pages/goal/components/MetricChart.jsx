import {
    CategoryScale,
    Chart as ChartJS,
    Filler,
    LinearScale,
    LineElement,
    PointElement,
    Tooltip,
} from 'chart.js';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import useCheckins from '../../../hooks/outcome/useCheckins';
import useMetrics from '../../../hooks/outcome/useMetrics';
import { dateToHuman } from '../../../utils/timeUtils';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Filler
);

function MetricChart() {
    const { data: metrics } = useMetrics();
    const { data: checkins = [] } = useCheckins();

    const [selectedMetricId, setSelectedMetricId] = useState(null);

    useEffect(() => {
        if (metrics?.length && !selectedMetricId) {
            setSelectedMetricId(metrics[0].id);
        }
    }, [metrics, selectedMetricId]);

    const selectedMetric = metrics?.find(m => m.id === selectedMetricId);

const chartData = [
    ...(selectedMetric?.baselineValue !== undefined && selectedMetric?.baselineValue !== null
        ? [{ date: 'Base', value: selectedMetric.baselineValue }]
        : []
    ),
    ...checkins
        .filter(c => c.metricValues?.length)
        .map(c => {
            const metricValue = c.metricValues.find(v => v.metricId === selectedMetricId);
            return {
                date: dateToHuman(c.createdAt),
                value: metricValue?.value,
            };
        })
        .filter(item => item.value !== undefined)
        .reverse(),
];

    const firstValue = chartData[0]?.value;
    const latestValue = chartData.at(-1)?.value;

    const change =
        firstValue !== undefined &&
            firstValue !== null &&
            firstValue !== 0 &&
            latestValue !== undefined
            ? ((latestValue - firstValue) / firstValue) * 100
            : null;

    const isPositive =
        change !== null &&
        (
            (selectedMetric?.direction === "increase" && change > 0) ||
            (selectedMetric?.direction === "decrease" && change < 0)
        );

    const displayChange =
        change !== null
            ? Math.abs(change).toFixed(1)
            : null;

    const trendText = isPositive
        ? "Improvement"
        : "Regression";
    //const isPositive = improvement > 0 && selectedMetric.direction == "increase" || improvement < 0 && selectedMetric.direction === "decrease";

    const data = {
        labels: chartData.map(d => d.date),
        datasets: [
            {
                data: chartData.map(d => d.value),
                fill: true,
                borderColor: '#16a34a',
                backgroundColor: (ctx) => {
                    const canvas = ctx.chart.ctx;
                    const gradient = canvas.createLinearGradient(0, 0, 0, 280);
                    gradient.addColorStop(0, 'rgba(22, 163, 74, 0.15)');
                    gradient.addColorStop(1, 'rgba(22, 163, 74, 0)');
                    return gradient;
                },
                borderWidth: 2.5,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#16a34a',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#16a34a',
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#fff',
                borderColor: '#e5e7eb',
                borderWidth: 1,
                titleColor: '#6b7280',
                bodyColor: '#111827',
                bodyFont: { size: 14, weight: '600' },
                titleFont: { size: 12 },
                padding: 10,
                displayColors: false,
                callbacks: {
                    title: (items) => items[0].label,
                    label: (item) => `${item.raw}${selectedMetric?.unit ? ' ' + selectedMetric.unit : ''}`,
                },
            },
        },
        scales: {
            x: {
                grid: { display: false },
                border: { display: false },
                ticks: {
                    color: '#9ca3af',
                    font: { size: 12 },
                },
            },
            y: {
                grid: {
                    color: '#f3f4f6',
                    drawBorder: false,
                },
                border: { display: false, dash: [4, 4] },
                ticks: {
                    color: '#9ca3af',
                    font: { size: 12 },
                },
            },
        },
    };

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                {/* Metric tabs */}
                <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1 bg-gray-50/50 overflow-x-auto">
                    {metrics?.map(metric => (
                        <button
                            key={metric.id}
                            onClick={() => setSelectedMetricId(metric.id)}
                            className={`
                                px-3 py-1.5 text-[13px] font-medium rounded-md shrink-0 transition-all
                                ${selectedMetricId === metric.id
                                    ? 'bg-white border border-gray-200 shadow-sm text-gray-900'
                                    : 'text-gray-500 hover:text-gray-700'
                                }
                            `}
                        >
                            {metric.name}
                        </button>
                    ))}
                </div>

                {/* Improvement badge */}
                {displayChange !== null && (
                    <div
                        className={`
            px-3 py-1.5 rounded-lg text-[13px] font-semibold flex items-center gap-1.5
            ${isPositive
                                ? 'bg-green-50 border border-green-200 text-green-700'
                                : 'bg-red-50 border border-red-200 text-red-600'
                            }
        `}
                    >
                        {isPositive ? (
                            <TrendingUp className="w-4 h-4" />
                        ) : (
                            <TrendingDown className="w-4 h-4" />
                        )}

                        {displayChange}% {trendText} since first check-in
                    </div>
                )}
            </div>

            {/* Chart */}
            <div className="h-[280px]">
                {chartData.length > 1 ? (
                    <Line data={data} options={options} />
                ) : (
                    <div className="h-full flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-200 rounded-xl">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium text-gray-600">No data yet</p>
                            <p className="text-xs text-gray-400 mt-0.5">Complete a check-in to see your progress chart</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MetricChart;