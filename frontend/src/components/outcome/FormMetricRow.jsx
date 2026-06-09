import { X, TrendingUp, TrendingDown } from 'lucide-react';
import { Controller, useFormContext } from "react-hook-form";

const UNIT_OPTIONS = [
    {
        value: "percentage",
        display: "Percentage (%)",
    },
    {
        value: "number",
        display: "Count (#)",
    },
    {
        value: "currency",
        display: "Currency ($)",
    },
    {
        value: "hours",
        display: "Hours (hrs)",
    },
    {
        value: "days",
        display: "Days (d)",
    },
    {
        value: "minutes",
        display: "Minutes (min)",
    },
    {
        value: "score",
        display: "Score (Sc)",
    },
];

function DirectionToggle({ value, onChange, disabled, dirty }) {
    return (
        <div className={`flex items-center gap-1 rounded-lg p-1 h-[38px] transition-colors ${dirty ? 'bg-amber-50' : 'bg-gray-100'
            }`}>
            <div className="relative flex-1 h-full group">
                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => onChange('increase')}
                    className={`w-full h-full flex items-center justify-center rounded-md text-[13px] font-medium transition-all disabled:pointer-events-none ${value === 'increase'
                            ? 'bg-white text-green-600 shadow-sm border border-gray-200'
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                >
                    <span className="flex items-center gap-1 md:hidden">
                        <TrendingUp className="w-3.5 h-3.5 shrink-0" />↑ Increase
                    </span>
                    <span className="hidden md:flex items-center justify-center">↑</span>
                </button>
                <div className="hidden md:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <div className="bg-gray-800 text-white text-[11px] font-medium px-2.5 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1.5">
                        <TrendingUp className="w-3 h-3 text-green-400" />Higher is better
                    </div>
                    <div className="w-2 h-2 bg-gray-800 rotate-45 mx-auto -mt-1" />
                </div>
            </div>

            <div className="relative flex-1 h-full group">
                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => onChange('decrease')}
                    className={`w-full h-full flex items-center justify-center rounded-md text-[13px] font-medium transition-all disabled:pointer-events-none ${value === 'decrease'
                            ? 'bg-white text-red-500 shadow-sm border border-gray-200'
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                >
                    <span className="flex items-center gap-1 md:hidden">
                        <TrendingDown className="w-3.5 h-3.5 shrink-0" />↓ Decrease
                    </span>
                    <span className="hidden md:flex items-center justify-center">↓</span>
                </button>
                <div className="hidden md:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <div className="bg-gray-800 text-white text-[11px] font-medium px-2.5 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1.5">
                        <TrendingDown className="w-3 h-3 text-red-400" />Lower is better
                    </div>
                    <div className="w-2 h-2 bg-gray-800 rotate-45 mx-auto -mt-1" />
                </div>
            </div>
        </div>
    );
}

export default function FormMetricRow({ index, onRemove, canRemove }) {
    const { register, control } = useFormContext();

    return (
        <div className="border border-gray-200 rounded-xl p-4 bg-white">
            <div className="flex items-center gap-2 mb-3">
                <input
                    {...register(`metrics.${index}.name`)}
                    placeholder="Metric name"
                    className="flex-1 min-w-0 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#378ADD] focus:ring-1 focus:ring-[#378ADD]"
                />
                <button
                    type="button"
                    onClick={() => onRemove(index)}
                    disabled={!canRemove}
                    className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-[80px_minmax(0,1fr)_minmax(0,1fr)_72px] gap-3">
                <select
                    {...register(`metrics.${index}.unit`)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#378ADD] focus:ring-1 focus:ring-[#378ADD]"
                >
                    {UNIT_OPTIONS.map(unit => (
                        <option key={unit.value} value={unit.value}>{unit.display}</option>
                    ))}
                </select>

                <input
                    type="number"
                    {...register(`metrics.${index}.baselineValue`)}
                    placeholder="Baseline"
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#378ADD] focus:ring-1 focus:ring-[#378ADD]"
                />

                <input
                    type="number"
                    {...register(`metrics.${index}.targetValue`)}
                    placeholder="Target"
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#378ADD] focus:ring-1 focus:ring-[#378ADD]"
                />

                <Controller
                    control={control}
                    name={`metrics.${index}.direction`}
                    render={({ field }) => (
                        <DirectionToggle
                            value={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />
            </div>
        </div>
    );
}