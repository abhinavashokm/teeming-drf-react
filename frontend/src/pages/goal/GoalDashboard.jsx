import { Activity, AlertCircle, Calendar, Check, CheckCircle2, ChevronRight, Flag, Info, Lightbulb, Lock, MessageSquare, RefreshCw, TableProperties, Target, ThumbsUp, TrendingDown, TrendingUp, X, Zap } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import BaseModal from '../../components/ui/modal/BaseModal';
import useGoal from '../../hooks/goal/useGoal';
import BoardView from './components/BoardView';
import GoalTabs from './components/GoalTabs';
import OutcomeView from './components/OutcomeView';
import RightPanel from './components/RightPanel';
import AddIdeaModal from '../../components/idea/AddIdeaModal';


export default function GoalDashboard({ goalTitle }) {

  const { setIsFullBleed, setIsGoalInfoModalOpen } = useOutletContext()
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false)

  useEffect(() => {
    setIsFullBleed(true)
    return () => setIsFullBleed(false);
  }, [])

  const { data: currentGoal, isLoading } = useGoal()


  const [isMobile, setIsMobile] = useState(window.innerWidth < 865);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 865);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);




  const [activeView, setActiveView] = useState('board');
  const [isBaselineModalOpen, setIsBaselineModalOpen] = useState(false);
  const [baselineMode, setBaselineMode] = useState('create');
  const [metrics, setMetrics] = useState([]);

  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);
  const [checkinStatus, setCheckinStatus] = useState(null);
  const [checkinMetrics, setCheckinMetrics] = useState([
    { id: 1, name: 'Checkout rate', baselineValue: 42, currentValue: '', unit: '%' },
    { id: 2, name: 'Drop-off users', baselineValue: 12000, currentValue: '', unit: 'users/week' },
    { id: 3, name: 'Conversion', baselineValue: 3.2, currentValue: '', unit: '%' }
  ]);
  const [checkinNotes, setCheckinNotes] = useState('');

  const [selectedIdeaCard, setSelectedIdeaCard] = useState(null);
  const [selectedIdeaStatus, setSelectedIdeaStatus] = useState(null);

  const [isMoveToProgressModalOpen, setIsMoveToProgressModalOpen] = useState(false);
  const [selectedAssignees, setSelectedAssignees] = useState([]);
  const [isAssigneeDropdownOpen, setIsAssigneeDropdownOpen] = useState(false);
  const [moveDeadline, setMoveDeadline] = useState('');

  const [isMarkAsDoneModalOpen, setIsMarkAsDoneModalOpen] = useState(false);
  const [completionNote, setCompletionNote] = useState('');

  const availableMembers = [
    { id: 'm1', name: 'Arjun Patel', role: 'Engineering', initials: 'AP', bgClass: 'bg-blue-100', textClass: 'text-blue-700' },
    { id: 'm2', name: 'Sarah Miller', role: 'Design', initials: 'SM', bgClass: 'bg-purple-100', textClass: 'text-purple-700' },
    { id: 'm3', name: 'Kevin Lee', role: 'Product', initials: 'KL', bgClass: 'bg-teal-100', textClass: 'text-teal-700' },
    { id: 'm4', name: 'Tom Riddle', role: 'Marketing', initials: 'TR', bgClass: 'bg-amber-100', textClass: 'text-amber-700' },
    { id: 'm5', name: 'Alice Wang', role: 'Engineering', initials: 'AW', bgClass: 'bg-pink-100', textClass: 'text-pink-700' }
  ];

  const calculateChange = (baseline, current) => {
    if (!current || isNaN(current)) return null;
    const b = parseFloat(baseline);
    const c = parseFloat(current);
    if (b === 0) return null;
    const pct = ((c - b) / b) * 100;
    return {
      val: Math.abs(pct).toFixed(1),
      isPositive: pct > 0,
      isNegative: pct < 0,
      raw: pct
    };
  };

  const handleOpenBaseline = (mode) => {
    setBaselineMode(mode);
    if (mode === 'edit') {
      setMetrics([
        { id: 1, name: 'Checkout rate', value: '42', unit: '%' },
        { id: 2, name: 'Drop-off users', value: '12k', unit: 'users/week' },
        { id: 3, name: 'Conversion', value: '3.2', unit: '%' }
      ]);
    } else {
      setMetrics([{ id: Date.now(), name: '', value: '', unit: '' }]);
    }
    setIsBaselineModalOpen(true);
  };
  const scrollToColumn = (id) => {
    const el = document.getElementById(id);
    if (el && el.parentElement) {
      const scrollLeftPos = el.offsetLeft - el.parentElement.offsetLeft;
      el.parentElement.scrollTo({
        left: scrollLeftPos,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="flex flex-1 h-full overflow-hidden  relative">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Fixed Header: View Switcher */}
        <GoalTabs activeView={activeView} setActiveView={setActiveView} />

        {/* Scrollable Content */}
        <div className={`flex-1 min-h-0 ${activeView === 'board' ? 'overflow-hidden' : 'overflow-y-auto overflow-x-hidden scrollbar-hide'}`}>
          <div className={`px-8 pt-6 md:px-12 lg:px-16 w-full transition-all duration-300 ${activeView === 'board' ? 'h-full' : 'pb-8 md:pb-12'}`}>

            {/* Main Content Areas */}
            {activeView === 'board' ? (
              <BoardView isRightPanelOpen={isRightPanelOpen} />
            ) : (
              <OutcomeView />
            )}

          </div>
        </div>
      </div>

      {/* Floating Button for Panel */}
      <button
        className="fixed min-[865px]:absolute bottom-6 right-6 w-14 h-14 bg-[#378ADD] text-white rounded-full shadow-[0_4px_14px_rgba(55,138,221,0.4)] flex items-center justify-center hover:bg-[#2c71b6] transition-colors z-40"
        onClick={() => setIsRightPanelOpen(true)}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Right Side Panel */}
      {/* Mobile */}
      {isMobile && (
        <BaseModal
          isOpen={isRightPanelOpen}
          onClose={() => setIsRightPanelOpen(false)}
          size="sm"
        >
          <RightPanel
            onClose={() => setIsRightPanelOpen(false)}
          />
        </BaseModal>
      )}

      {/* Desktop */}
      {!isMobile && isRightPanelOpen && (
        <div className="w-80 shrink-0 border-l border-gray-200 bg-white">
          <RightPanel
            onClose={() => setIsRightPanelOpen(false)}
          />
        </div>
      )}


      {/* Baseline Modal */}
      {isBaselineModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-0 md:p-4" onClick={() => setIsBaselineModalOpen(false)}>
          <div className="bg-white rounded-t-2xl md:rounded-2xl shadow-xl w-full md:max-w-2xl overflow-hidden flex flex-col fixed md:relative bottom-0 md:bottom-auto inset-x-0 md:inset-x-auto h-[85vh] md:h-auto md:max-h-[90vh]" onClick={e => e.stopPropagation()}>
            {/* Mobile Drag Handle */}
            <div className="md:hidden w-full flex justify-center pt-3 pb-1 shrink-0 bg-white" onClick={() => setIsBaselineModalOpen(false)}>
              <div className="w-10 h-1.5 bg-gray-300 rounded-full"></div>
            </div>
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-4 shrink-0">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-[11px] font-bold uppercase tracking-wider">Baseline</span>
              </div>
              <button className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100" onClick={() => setIsBaselineModalOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 overflow-y-auto scrollbar-hide">
              <h2 className="text-[20px] font-bold text-gray-900 mb-1">
                {baselineMode === 'edit' ? 'Edit baseline metrics' : 'Set baseline metrics'}
              </h2>
              <p className="text-[13px] text-gray-500 mb-5">Record where things stand right now before work begins. Every check-in will measure progress against these numbers.</p>

              <div className="flex items-start gap-2.5 bg-blue-50/50 text-blue-800 p-3.5 rounded-xl border border-blue-100 mb-6">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-600" />
                <span className="text-[13px] leading-relaxed">Once saved the baseline metric names are locked. You can only update values in future check-ins.</span>
              </div>

              {/* Metric Rows */}
              <div className="space-y-3 mb-6">
                {/* Header row for grid */}
                <div className="grid grid-cols-[1fr_120px_120px_32px] gap-3 px-1">
                  <span className="text-[12px] font-semibold text-gray-700">Metric Name</span>
                  <span className="text-[12px] font-semibold text-gray-700">Current Value</span>
                  <span className="text-[12px] font-semibold text-gray-700">Unit</span>
                  <span></span>
                </div>

                {metrics.map((m, i) => (
                  <div key={m.id} className="grid grid-cols-[1fr_120px_120px_32px] gap-3 items-center">
                    <div className="relative">
                      <input
                        type="text"
                        value={m.name}
                        onChange={(e) => {
                          const newMetrics = [...metrics];
                          newMetrics[i].name = e.target.value;
                          setMetrics(newMetrics);
                        }}
                        placeholder="e.g. Checkout rate"
                        disabled={baselineMode === 'edit' && m.name !== ''}
                        className={`w-full border ${baselineMode === 'edit' && m.name !== '' ? 'bg-gray-50 border-gray-200 text-gray-500 pr-8' : 'bg-white border-gray-200 focus:border-[#378ADD] focus:ring-1 focus:ring-[#378ADD]'} rounded-lg px-3 py-2 text-[13px] outline-none transition-shadow`}
                      />
                      {baselineMode === 'edit' && m.name !== '' && (
                        <Lock className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                      )}
                    </div>
                    <input
                      type="text"
                      value={m.value}
                      onChange={(e) => {
                        const newMetrics = [...metrics];
                        newMetrics[i].value = e.target.value;
                        setMetrics(newMetrics);
                      }}
                      placeholder="e.g. 42"
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#378ADD] focus:ring-1 focus:ring-[#378ADD] transition-shadow"
                    />
                    <input
                      type="text"
                      value={m.unit}
                      onChange={(e) => {
                        const newMetrics = [...metrics];
                        newMetrics[i].unit = e.target.value;
                        setMetrics(newMetrics);
                      }}
                      placeholder="e.g. %"
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#378ADD] focus:ring-1 focus:ring-[#378ADD] transition-shadow"
                    />
                    <button
                      onClick={() => setMetrics(metrics.filter(metric => metric.id !== m.id))}
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove metric"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {/* Placeholder Row */}
                <div className="grid grid-cols-[1fr_120px_120px_32px] gap-3 items-center opacity-60 hover:opacity-100 transition-opacity focus-within:opacity-100">
                  <input type="text" placeholder="Add metric name..." className="w-full bg-gray-50/50 border border-gray-200 border-dashed rounded-lg px-3 py-2 text-[13px] outline-none focus:border-solid focus:border-[#378ADD] focus:ring-1 focus:ring-[#378ADD] focus:bg-white transition-all" />
                  <input type="text" placeholder="-" className="w-full bg-gray-50/50 border border-gray-200 border-dashed rounded-lg px-3 py-2 text-[13px] outline-none focus:border-solid focus:border-[#378ADD] focus:ring-1 focus:ring-[#378ADD] focus:bg-white transition-all" />
                  <input type="text" placeholder="-" className="w-full bg-gray-50/50 border border-gray-200 border-dashed rounded-lg px-3 py-2 text-[13px] outline-none focus:border-solid focus:border-[#378ADD] focus:ring-1 focus:ring-[#378ADD] focus:bg-white transition-all" />
                  <div></div>
                </div>
              </div>

              <button
                onClick={() => setMetrics([...metrics, { id: Date.now(), name: '', value: '', unit: '' }])}
                className="w-full py-2.5 border-2 border-dashed border-gray-200 text-gray-500 font-medium rounded-xl text-[13px] hover:border-gray-300 hover:text-gray-700 hover:bg-gray-50 transition-colors mb-6"
              >
                + Add another metric
              </button>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-gray-100 bg-gray-50 flex items-center justify-between mt-auto rounded-b-2xl">
              <div className="flex items-center gap-2 text-gray-500">
                <Flag className="w-4 h-4" />
                <span className="text-[13px] font-medium truncate max-w-[200px]">Goal: {goalTitle || 'Checkout Drop-off'}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg text-[13px] hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
                  onClick={() => setIsBaselineModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-5 py-2 bg-[#378ADD] text-white font-medium rounded-lg text-[13px] hover:bg-[#2c71b6] transition-colors shadow-sm flex items-center gap-1.5"
                  onClick={() => setIsBaselineModalOpen(false)}
                >
                  Save baseline
                  <span className="text-[14px]">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Check-in Modal */}
      {isCheckinModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-0 md:p-4" onClick={() => setIsCheckinModalOpen(false)}>
          <div className="bg-white rounded-t-2xl md:rounded-2xl shadow-xl w-full md:max-w-2xl overflow-hidden flex flex-col fixed md:relative bottom-0 md:bottom-auto inset-x-0 md:inset-x-auto h-[85vh] md:h-auto md:max-h-[90vh]" onClick={e => e.stopPropagation()}>
            {/* Mobile Drag Handle */}
            <div className="md:hidden w-full flex justify-center pt-3 pb-1 shrink-0 bg-white" onClick={() => setIsCheckinModalOpen(false)}>
              <div className="w-10 h-1.5 bg-gray-300 rounded-full"></div>
            </div>
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-4 shrink-0">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-md text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5" />
                  New Check-in
                </span>
              </div>
              <button className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100" onClick={() => setIsCheckinModalOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 overflow-y-auto scrollbar-hide pb-6">
              <h2 className="text-[20px] font-bold text-gray-900 mb-1">Record outcome check-in</h2>
              <p className="text-[13px] text-gray-500 mb-8">How are things looking since the work was completed?</p>

              {/* Section 1 - Status */}
              <div className="mb-8">
                <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wider mb-3">Status *</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setCheckinStatus('still_measuring')}
                    className={`relative p-4 rounded-xl border text-left transition-all ${checkinStatus === 'still_measuring' ? 'border-[#378ADD] bg-blue-50/30 ring-1 ring-[#378ADD]' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'}`}
                  >
                    {checkinStatus === 'still_measuring' && (
                      <div className="absolute top-3 right-3 w-5 h-5 bg-[#378ADD] rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <Activity className={`w-5 h-5 mb-2.5 ${checkinStatus === 'still_measuring' ? 'text-[#378ADD]' : 'text-gray-400'}`} />
                    <h3 className="text-[14px] font-semibold text-gray-900 mb-1">Still Measuring</h3>
                    <p className="text-[12px] text-gray-500 leading-snug">Collecting data, no clear impact yet</p>
                  </button>

                  <button
                    onClick={() => setCheckinStatus('looking_promising')}
                    className={`relative p-4 rounded-xl border text-left transition-all ${checkinStatus === 'looking_promising' ? 'border-[#378ADD] bg-blue-50/30 ring-1 ring-[#378ADD]' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'}`}
                  >
                    {checkinStatus === 'looking_promising' && (
                      <div className="absolute top-3 right-3 w-5 h-5 bg-[#378ADD] rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <TrendingUp className={`w-5 h-5 mb-2.5 ${checkinStatus === 'looking_promising' ? 'text-[#378ADD]' : 'text-blue-500'}`} />
                    <h3 className="text-[14px] font-semibold text-gray-900 mb-1">Looking Promising</h3>
                    <p className="text-[12px] text-gray-500 leading-snug">Numbers are moving in the right direction</p>
                  </button>

                  <button
                    onClick={() => setCheckinStatus('goal_achieved')}
                    className={`relative p-4 rounded-xl border text-left transition-all ${checkinStatus === 'goal_achieved' ? 'border-[#378ADD] bg-blue-50/30 ring-1 ring-[#378ADD]' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'}`}
                  >
                    {checkinStatus === 'goal_achieved' && (
                      <div className="absolute top-3 right-3 w-5 h-5 bg-[#378ADD] rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <CheckCircle2 className={`w-5 h-5 mb-2.5 ${checkinStatus === 'goal_achieved' ? 'text-[#378ADD]' : 'text-green-500'}`} />
                    <h3 className="text-[14px] font-semibold text-gray-900 mb-1">Goal Achieved</h3>
                    <p className="text-[12px] text-gray-500 leading-snug">Successfully reached the desired outcome</p>
                  </button>

                  <button
                    onClick={() => setCheckinStatus('not_working')}
                    className={`relative p-4 rounded-xl border text-left transition-all ${checkinStatus === 'not_working' ? 'border-[#378ADD] bg-blue-50/30 ring-1 ring-[#378ADD]' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'}`}
                  >
                    {checkinStatus === 'not_working' && (
                      <div className="absolute top-3 right-3 w-5 h-5 bg-[#378ADD] rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <TrendingDown className={`w-5 h-5 mb-2.5 ${checkinStatus === 'not_working' ? 'text-[#378ADD]' : 'text-red-500'}`} />
                    <h3 className="text-[14px] font-semibold text-gray-900 mb-1">Not Working</h3>
                    <p className="text-[12px] text-gray-500 leading-snug">Results are flat or negatively impacted</p>
                  </button>
                </div>
              </div>

              {/* Section 2 - Metrics */}
              <div className="mb-8">
                <div className="mb-3">
                  <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wider mb-0.5">Metrics (optional)</label>
                  <p className="text-[12px] text-gray-500">Track what actually changed with numbers</p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-3">
                  <div className="flex items-center gap-2 mb-4">
                    <TableProperties className="w-4 h-4 text-gray-400" />
                    <span className="text-[13px] font-semibold text-gray-700">Baseline metrics found</span>
                  </div>

                  <div className="space-y-3">
                    {checkinMetrics.map((m, i) => {
                      const change = calculateChange(m.baselineValue, m.currentValue);
                      return (
                        <div key={m.id} className="grid grid-cols-[1fr_120px_100px_80px] gap-3 items-center">
                          <input
                            type="text"
                            value={m.name}
                            disabled
                            className="w-full bg-white border border-gray-100 text-gray-500 rounded-lg px-3 py-2 text-[13px] outline-none shadow-sm"
                          />
                          <input
                            type="text"
                            value={m.currentValue}
                            onChange={(e) => {
                              const newM = [...checkinMetrics];
                              newM[i].currentValue = e.target.value;
                              setCheckinMetrics(newM);
                            }}
                            placeholder={m.baselineValue.toString()}
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#378ADD] focus:ring-1 focus:ring-[#378ADD] transition-shadow shadow-sm"
                          />
                          <input
                            type="text"
                            value={m.unit}
                            disabled
                            className="w-full bg-white border border-gray-100 text-gray-500 rounded-lg px-3 py-2 text-[13px] outline-none shadow-sm"
                          />
                          <div className="flex justify-end pr-1">
                            {change ? (
                              <span className={`text-[12px] font-bold ${change.isPositive ? 'text-green-600' : change.isNegative ? 'text-red-500' : 'text-gray-400'}`}>
                                {change.isPositive ? '↑' : change.isNegative ? '↓' : ''}{change.val}%
                              </span>
                            ) : (
                              <span className="text-[12px] font-medium text-gray-400">-</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <p className="text-[12px] text-[#378ADD] hover:text-[#2c71b6] cursor-pointer inline-flex transition-colors">
                  Add new metrics in Baseline to track them here
                </p>
              </div>

              {/* Section 3 - Notes */}
              <div>
                <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wider mb-3">Notes (optional)</label>
                <textarea
                  value={checkinNotes}
                  onChange={(e) => setCheckinNotes(e.target.value)}
                  placeholder="What did you learn?..."
                  className="w-full bg-white border border-gray-200 rounded-xl p-3.5 text-[13px] outline-none focus:border-[#378ADD] focus:ring-1 focus:ring-[#378ADD] transition-shadow shadow-sm min-h-[100px] resize-y"
                ></textarea>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-gray-100 bg-gray-50 flex items-center justify-between mt-auto shrink-0 rounded-b-2xl">
              <div className="flex items-center gap-2 text-gray-500">
                <Flag className="w-4 h-4" />
                <span className="text-[13px] font-medium truncate max-w-[200px]">Goal: {goalTitle || 'Checkout Drop-off'}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg text-[13px] hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
                  onClick={() => setIsCheckinModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-5 py-2 bg-[#378ADD] text-white font-medium rounded-lg text-[13px] hover:bg-[#2c71b6] transition-colors shadow-sm"
                  onClick={() => setIsCheckinModalOpen(false)}
                >
                  Save check-in
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Move to In Progress Modal */}
      {isMoveToProgressModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-0 md:p-4" onClick={() => setIsMoveToProgressModalOpen(false)}>
          <div className="bg-white rounded-t-2xl md:rounded-2xl shadow-xl w-full md:max-w-lg overflow-hidden flex flex-col fixed md:relative bottom-0 md:bottom-auto inset-x-0 md:inset-x-auto h-[85vh] md:h-auto md:max-h-[90vh]" onClick={e => e.stopPropagation()}>
            {/* Mobile Drag Handle */}
            <div className="md:hidden w-full flex justify-center pt-3 pb-1 shrink-0 bg-white" onClick={() => setIsMoveToProgressModalOpen(false)}>
              <div className="w-10 h-1.5 bg-gray-300 rounded-full"></div>
            </div>
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-4 shrink-0">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 bg-blue-50 text-[#378ADD] border border-[#378ADD]/20 rounded-md text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  Starting idea
                </span>
              </div>
              <button className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100" onClick={() => setIsMoveToProgressModalOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 overflow-y-auto scrollbar-hide pb-6">
              <h2 className="text-[20px] font-bold text-gray-900 mb-1">Move to In Progress</h2>
              <p className="text-[13px] text-gray-500 mb-6">Assign this idea to team members and set a deadline</p>

              {/* Idea Preview Row */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                <div className="bg-white border border-gray-200 rounded-lg p-1.5 mt-0.5 shrink-0">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-gray-900 mb-0.5">{selectedIdeaCard?.title}</h3>
                  <p className="text-[12px] text-gray-500">Ideas · Added by {selectedIdeaCard?.assignee?.name}</p>
                </div>
              </div>

              {/* Assign To */}
              <div className="mb-6 relative">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wider">Assign to *</label>
                  {selectedAssignees.length > 0 && (
                    <span className="text-[12px] text-gray-500 font-medium">{selectedAssignees.length} members selected</span>
                  )}
                </div>
                <div
                  className="w-full bg-white border border-gray-200 rounded-xl p-2 min-h-[46px] flex flex-wrap gap-2 items-center cursor-text transition-shadow shadow-sm focus-within:border-[#378ADD] focus-within:ring-1 focus-within:ring-[#378ADD]"
                  onClick={() => setIsAssigneeDropdownOpen(true)}
                >
                  {selectedAssignees.map(user => (
                    <div key={user.id} className="flex items-center gap-1.5 bg-gray-100 border border-gray-200 rounded-md py-1 px-1.5">
                      <div className={`w-4 h-4 rounded-full ${user.bgClass} flex items-center justify-center text-[8px] font-bold ${user.textClass}`}>
                        {user.initials}
                      </div>
                      <span className="text-[12px] font-medium text-gray-700">{user.name}</span>
                      <button
                        className="text-gray-400 hover:text-red-500 ml-0.5"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAssignees(prev => prev.filter(u => u.id !== user.id));
                        }}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <input
                    type="text"
                    placeholder={selectedAssignees.length === 0 ? "Search members..." : ""}
                    className="flex-1 min-w-[100px] text-[13px] outline-none bg-transparent"
                    onFocus={() => setIsAssigneeDropdownOpen(true)}
                  />
                </div>

                {/* Dropdown */}
                {isAssigneeDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setIsAssigneeDropdownOpen(false); }}></div>
                    <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden max-h-60 overflow-y-auto">
                      {availableMembers.map(user => {
                        const isSelected = selectedAssignees.some(u => u.id === user.id);
                        return (
                          <div
                            key={user.id}
                            className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0"
                            onClick={() => {
                              if (isSelected) {
                                setSelectedAssignees(prev => prev.filter(u => u.id !== user.id));
                              } else {
                                setSelectedAssignees(prev => [...prev, user]);
                              }
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-7 h-7 rounded-full ${user.bgClass} flex items-center justify-center text-[10px] font-bold ${user.textClass}`}>
                                {user.initials}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[13px] font-semibold text-gray-900">{user.name}</span>
                                <span className="text-[11px] text-gray-500">{user.role}</span>
                              </div>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-[#378ADD]" />}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Deadline */}
              <div>
                <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wider mb-2">Deadline <span className="text-gray-400 normal-case font-medium">(optional)</span></label>
                <div className="relative">
                  <input
                    type="date"
                    value={moveDeadline}
                    onChange={(e) => setMoveDeadline(e.target.value)}
                    className={`w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13px] outline-none focus:border-[#378ADD] focus:ring-1 focus:ring-[#378ADD] transition-shadow shadow-sm ${!moveDeadline ? 'text-gray-400' : 'text-gray-900'}`}
                  />
                  <Calendar className={`w-4 h-4 absolute right-3.5 top-3 pointer-events-none ${moveDeadline ? 'text-[#378ADD]' : 'text-gray-400'}`} />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-gray-100 bg-gray-50 flex items-center justify-between mt-auto shrink-0">
              <div className="flex items-center gap-2 text-gray-500">
                <Target className="w-4 h-4" />
                <span className="text-[13px] font-medium truncate max-w-[200px]">{goalTitle || 'Checkout Drop-off'}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg text-[13px] hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
                  onClick={() => setIsMoveToProgressModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className={`px-5 py-2 font-medium rounded-lg text-[13px] transition-colors shadow-sm flex items-center gap-1 ${selectedAssignees.length > 0 ? 'bg-[#378ADD] text-white hover:bg-[#2c71b6]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                  disabled={selectedAssignees.length === 0}
                  onClick={() => {
                    setIsMoveToProgressModalOpen(false);
                    setSelectedIdeaCard(null); // Close the detail modal too
                  }}
                >
                  Move to In Progress <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mark as Done Modal */}
      {isMarkAsDoneModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-0 md:p-4" onClick={() => setIsMarkAsDoneModalOpen(false)}>
          <div className="bg-white rounded-t-2xl md:rounded-2xl shadow-xl w-full md:max-w-lg overflow-hidden flex flex-col fixed md:relative bottom-0 md:bottom-auto inset-x-0 md:inset-x-auto h-[85vh] md:h-auto md:max-h-[90vh]" onClick={e => e.stopPropagation()}>
            {/* Mobile Drag Handle */}
            <div className="md:hidden w-full flex justify-center pt-3 pb-1 shrink-0 bg-white" onClick={() => setIsMarkAsDoneModalOpen(false)}>
              <div className="w-10 h-1.5 bg-gray-300 rounded-full"></div>
            </div>
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-4 shrink-0">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-md text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Mark as Done
                </span>
              </div>
              <button className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100" onClick={() => setIsMarkAsDoneModalOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 overflow-y-auto scrollbar-hide pb-6">
              <h2 className="text-[20px] font-bold text-gray-900 mb-1">Mark idea as done</h2>
              <p className="text-[13px] text-gray-500 mb-6">Optionally add a note about what you found or learned</p>

              {/* Idea Preview Row */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                <div className="bg-white border border-gray-200 rounded-lg p-1.5 mt-0.5 shrink-0">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-gray-900 mb-0.5">{selectedIdeaCard?.title}</h3>
                  <p className="text-[12px] text-gray-500">In Progress</p>
                </div>
              </div>

              {/* Completion Note */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wider">Completion note</label>
                  <span className="text-[12px] text-gray-400 font-medium">(optional)</span>
                </div>
                <textarea
                  rows={4}
                  value={completionNote}
                  onChange={(e) => setCompletionNote(e.target.value)}
                  placeholder="What did you find out? Any learnings while working on this idea..."
                  className="w-full bg-white border border-gray-200 rounded-xl p-3.5 text-[13px] outline-none focus:border-[#378ADD] focus:ring-1 focus:ring-[#378ADD] transition-shadow shadow-sm resize-none"
                />
                <div className="flex justify-end mt-1.5">
                  <span className="text-[11px] text-gray-400 font-medium">{completionNote.length} / 300</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-gray-100 bg-gray-50 flex items-center justify-center gap-3 mt-auto shrink-0">
              <button
                className="px-6 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg text-[13px] hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
                onClick={() => setIsMarkAsDoneModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg text-[13px] hover:bg-green-700 transition-colors shadow-sm flex items-center gap-1.5"
                onClick={() => {
                  setIsMarkAsDoneModalOpen(false);
                  setSelectedIdeaCard(null); // Close the detail modal too
                  setCompletionNote('');
                }}
              >
                Mark as Done <Check className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
