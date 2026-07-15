import { useState, useMemo } from 'react';
import { Calendar } from 'lucide-react';
import useRevenue from '../../hooks/adminBilling/useRevenue';

const PRESETS = [
  { key: '7d', label: '7D' },
  { key: '30d', label: '30D' },
  { key: '90d', label: '90D' },
  { key: '12m', label: '12M' },
  { key: 'custom', label: 'Custom' },
];

function getPresetRange(key) {
  const end = new Date();
  const start = new Date();
  if (key === '7d') start.setDate(end.getDate() - 6);
  if (key === '30d') start.setDate(end.getDate() - 29);
  if (key === '90d') start.setDate(end.getDate() - 89);
  if (key === '12m') start.setMonth(end.getMonth() - 11);
  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  };
}

function RevenuePanel() {
  const [preset, setPreset] = useState('30d');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const range = useMemo(() => {
    if (preset === 'custom') {
      return { start: customStart, end: customEnd };
    }
    return getPresetRange(preset);
  }, [preset, customStart, customEnd]);

  const hasValidRange = range.start && range.end;

  const { data, isLoading, isError } = useRevenue(
    hasValidRange ? { start: range.start, end: range.end } : {}
  );

  const maxValue = useMemo(() => {
    if (!data?.series?.length) return 0;
    return Math.max(...data.series.map((d) => Number(d.amount)));
  }, [data]);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h3 className="text-[16px] font-bold text-slate-900">Revenue</h3>
          <p className="text-[13px] text-slate-500 mt-1">Platform revenue over the selected period</p>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {PRESETS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPreset(p.key)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors ${
                preset === p.key
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom date inputs */}
      {preset === 'custom' && (
        <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-slate-50 border border-slate-100 w-fit">
          <Calendar className="w-4 h-4 text-slate-400" />
          <input
            type="date"
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
            max={customEnd || undefined}
            className="text-[13px] font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-slate-400"
          />
          <span className="text-[13px] text-slate-400">to</span>
          <input
            type="date"
            value={customEnd}
            onChange={(e) => setCustomEnd(e.target.value)}
            min={customStart || undefined}
            max={new Date().toISOString().slice(0, 10)}
            className="text-[13px] font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-slate-400"
          />
        </div>
      )}

      {/* Empty / loading / error states */}
      {preset === 'custom' && !hasValidRange ? (
        <div className="py-10 text-center text-[13px] font-semibold text-slate-400">
          Pick a start and end date to see revenue
        </div>
      ) : isLoading ? (
        <div className="py-10 text-center text-[13px] font-semibold text-slate-400">
          Loading revenue…
        </div>
      ) : isError || !data ? (
        <div className="py-10 text-center text-[13px] font-semibold text-red-400">
          Couldn't load revenue for this range
        </div>
      ) : data.series.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <p className="text-[14px] font-bold text-slate-900">No revenue in this period</p>
          <p className="text-[12px] font-semibold text-slate-500 mt-1">
            Try a wider date range
          </p>
        </div>
      ) : (
        <>
          {/* Total */}
          <div className="mb-6">
            <h2 className="text-[32px] font-bold text-slate-900 leading-none">
              ₹{Number(data.total).toLocaleString()}
            </h2>
          </div>

          {/* Bar chart — bars grow to fill the card's width when there's room (7D, 90D
              won't look sparse), but won't shrink past MIN_BAR_WIDTH. Once there are
              enough bars to hit that minimum, the row overflows and scrolls horizontally
              instead of squishing further — mainly kicks in on mobile with dense views. */}
          {(() => {
            const barCount = data.series.length;
            const MIN_BAR_WIDTH = 18; // px, bars won't shrink below this
            const step = Math.max(1, Math.ceil(barCount / 9)); // label thinning

            return (
              <div className="overflow-x-auto overflow-y-visible -mx-1 px-1 pt-8">
                <div className="flex items-end gap-1 h-32 min-w-full">
                  {data.series.map((point) => {
                    const heightPct = maxValue > 0 ? (Number(point.amount) / maxValue) * 100 : 0;
                    return (
                      <div
                        key={point.label}
                        className="flex-1 flex flex-col items-center justify-end h-full group relative"
                        style={{ minWidth: MIN_BAR_WIDTH }}
                      >
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[11px] font-bold text-white whitespace-nowrap bg-slate-900 rounded px-1.5 py-0.5 shadow-md z-20 pointer-events-none">
                          ₹{Number(point.amount).toLocaleString()}
                        </div>
                        <div
                          className="w-full rounded-t-sm bg-blue-500 hover:bg-blue-600 transition-colors"
                          style={{ height: `${Math.max(heightPct, 2)}%` }}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* X-axis labels — same flex-1/minWidth as the bars above so they stay aligned */}
                <div className="flex items-start gap-1 mt-2 min-w-full">
                  {data.series.map((point, i) => (
                    <div
                      key={point.label}
                      className="flex-1 flex justify-center"
                      style={{ minWidth: MIN_BAR_WIDTH }}
                    >
                      {i % step === 0 && (
                        <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap">
                          {point.label}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </>
      )}
    </div>
  );
}

export default RevenuePanel;