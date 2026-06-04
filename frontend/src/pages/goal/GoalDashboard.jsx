import { Activity, AlertCircle, Calendar, Check, CheckCircle2, ChevronRight, Flag, Info, Lightbulb, Lock, MessageSquare, RefreshCw, Sparkles, TableProperties, Target, ThumbsUp, TrendingDown, TrendingUp, Wand2, X, Zap } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import BaseModal from '../../components/ui/modal/BaseModal';
import useGoal from '../../hooks/goal/useGoal';
import BoardView from './components/BoardView';
import GoalTabs from './components/GoalTabs';
import OutcomeView from './components/OutcomeView';
import RightPanel from './components/RightPanel';


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

  const [isAddIdeaModalOpen, setIsAddIdeaModalOpen] = useState(false);
  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaDesc, setIdeaDesc] = useState('');
  const [suggestWithAi, setSuggestWithAi] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

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

  // Mock function to simulate calling the Anthropic API
  const fetchAISuggestions = async () => {
    setIsAiLoading(true);
    setAiSuggestions([]);
    return new Promise(resolve => {
      setTimeout(() => {
        const suggestions = [
          "Add guest checkout option",
          "Implement one-click Apple Pay",
          "Show progress indicator during checkout",
          "Auto-fill address via Google Maps",
          "Offer Buy Now, Pay Later options"
        ];
        setAiSuggestions(suggestions);
        setIsAiLoading(false);
        resolve(suggestions);
      }, 1500);
    });
  };

  React.useEffect(() => {
    if (suggestWithAi && aiSuggestions.length === 0 && !isAiLoading) {
      fetchAISuggestions();
    }
  }, [suggestWithAi]);

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
        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
          <div className="px-8 pb-8 pt-6 md:px-12 md:pb-12 lg:px-16 w-full transition-all duration-300">

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

      {/* Add Idea Modal */}
      {isAddIdeaModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-0 md:p-4" onClick={() => setIsAddIdeaModalOpen(false)}>
          <div className="bg-white rounded-t-2xl md:rounded-2xl shadow-xl w-full md:max-w-lg overflow-hidden flex flex-col fixed md:relative bottom-0 md:bottom-auto inset-x-0 md:inset-x-auto h-[85vh] md:h-auto md:max-h-[90vh]" onClick={e => e.stopPropagation()}>
            {/* Mobile Drag Handle */}
            <div className="md:hidden w-full flex justify-center pt-3 pb-1 shrink-0 bg-white" onClick={() => setIsAddIdeaModalOpen(false)}>
              <div className="w-10 h-1.5 bg-gray-300 rounded-full"></div>
            </div>
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-4 shrink-0">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-md text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  New Idea
                </span>
              </div>
              <button className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100" onClick={() => setIsAddIdeaModalOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 overflow-y-auto scrollbar-hide pb-6">
              <h2 className="text-[20px] font-bold text-gray-900 mb-6">Add a new idea</h2>

              {/* Title */}
              <div className="mb-5">
                <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wider mb-2">Title *</label>
                <input
                  type="text"
                  value={ideaTitle}
                  onChange={(e) => setIdeaTitle(e.target.value)}
                  placeholder="What's the idea? Keep it short..."
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13px] outline-none focus:border-[#378ADD] focus:ring-1 focus:ring-[#378ADD] transition-shadow shadow-sm"
                />
              </div>

              {/* Description */}
              <div className="mb-6 relative">
                <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wider mb-2">Description <span className="text-gray-400 normal-case font-medium">(optional)</span></label>
                <textarea
                  value={ideaDesc}
                  onChange={(e) => setIdeaDesc(e.target.value)}
                  maxLength={300}
                  placeholder="Add more context about this idea..."
                  className="w-full bg-white border border-gray-200 rounded-xl p-3.5 pb-8 text-[13px] outline-none focus:border-[#378ADD] focus:ring-1 focus:ring-[#378ADD] transition-shadow shadow-sm min-h-[100px] resize-y"
                ></textarea>
                <span className="absolute bottom-3 right-3 text-[11px] text-gray-400 font-medium">
                  {ideaDesc.length} / 300
                </span>
              </div>

              {/* AI Section */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <Wand2 className="w-4 h-4 text-indigo-600" />
                    </div>
                    <span className="text-[13px] font-bold text-gray-900">Suggest ideas with AI</span>
                  </div>
                  {/* Toggle Switch */}
                  <button
                    onClick={() => setSuggestWithAi(!suggestWithAi)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${suggestWithAi ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${suggestWithAi ? 'transform translate-x-5' : ''}`}></div>
                  </button>
                </div>

                {suggestWithAi && (
                  <div className="p-4 pt-0 border-t border-gray-100 bg-white">
                    <div className="flex items-center gap-3 mb-4 mt-4">
                      <div className="h-px bg-gray-100 flex-1"></div>
                      <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">AI SUGGESTIONS BASED ON YOUR GOAL:</span>
                      <div className="h-px bg-gray-100 flex-1"></div>
                    </div>

                    {isAiLoading ? (
                      <div className="flex items-center justify-center py-6 gap-2 text-indigo-600">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span className="text-[13px] font-medium animate-pulse">Generating suggestions...</span>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {aiSuggestions.map((sug, i) => (
                          <button
                            key={i}
                            onClick={() => setIdeaTitle(sug)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-[13px] transition-colors flex items-center gap-2 ${i === 0 ? 'bg-green-50 text-green-700 font-medium hover:bg-green-100' : 'text-gray-700 hover:bg-gray-50'}`}
                          >
                            <span className={i === 0 ? 'text-green-500 font-bold text-[14px]' : 'text-gray-400 font-bold text-[14px]'}>+</span> {sug}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-gray-100 bg-gray-50 flex items-center justify-between mt-auto shrink-0">
              <div className="flex items-center gap-2 text-gray-500">
                <Target className="w-4 h-4" />
                <span className="text-[13px] font-medium truncate max-w-[200px]">Adding to: {goalTitle || 'Checkout Drop-off'}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg text-[13px] hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
                  onClick={() => setIsAddIdeaModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-5 py-2 bg-[#1D9E75] text-white font-medium rounded-lg text-[13px] hover:bg-[#15825f] transition-colors shadow-sm"
                  onClick={() => {
                    setIsAddIdeaModalOpen(false);
                    setIdeaTitle('');
                    setIdeaDesc('');
                    setSuggestWithAi(false);
                  }}
                >
                  Add idea
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Idea Detail Modal */}
      {selectedIdeaCard && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-0 md:p-4" onClick={() => setSelectedIdeaCard(null)}>
          <div className="bg-white rounded-t-2xl md:rounded-2xl shadow-xl w-full md:max-w-2xl overflow-hidden flex flex-col fixed md:relative bottom-0 md:bottom-auto inset-x-0 md:inset-x-auto h-[85vh] md:h-auto md:max-h-[90vh]" onClick={e => e.stopPropagation()}>
            {/* Mobile Drag Handle */}
            <div className="md:hidden w-full flex justify-center pt-3 pb-1 shrink-0 bg-white" onClick={() => setSelectedIdeaCard(null)}>
              <div className="w-10 h-1.5 bg-gray-300 rounded-full"></div>
            </div>
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-4 shrink-0">
              <div className="flex items-center gap-3">
                {selectedIdeaStatus === 'ideas' && (
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-md text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span className="text-[12px]">✋</span> IDEA
                  </span>
                )}
                {selectedIdeaStatus === 'progress' && (
                  <span className="px-2.5 py-1 bg-blue-50 text-[#378ADD] border border-[#378ADD]/30 rounded-md text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5" /> IN PROGRESS
                  </span>
                )}
                {selectedIdeaStatus === 'done' && (
                  <span className="px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-md text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> DONE
                  </span>
                )}
              </div>
              <button className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100" onClick={() => setSelectedIdeaCard(null)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 overflow-y-auto scrollbar-hide pb-6">
              <div className="mb-6">
                <h2 className="text-[22px] font-bold text-gray-900 leading-tight mb-2">{selectedIdeaCard.title}</h2>
                <div className="text-[13px] text-gray-500">
                  {selectedIdeaStatus === 'ideas' && (
                    <>Added by {selectedIdeaCard.assignee?.name || 'User'} · {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · Updated 2h ago</>
                  )}
                  {selectedIdeaStatus === 'progress' && (
                    <>Added by {selectedIdeaCard.assignee?.name || 'User'} · {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · <span className="text-[#378ADD] font-medium">Updated 2h ago</span></>
                  )}
                  {selectedIdeaStatus === 'done' && (
                    <>Added by <span className="font-medium text-gray-900">{selectedIdeaCard.assignee?.name || 'User'}</span> · {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · <span className="text-green-600 font-medium">Completed Oct 15</span></>
                  )}
                </div>
              </div>

              {/* Description Section */}
              <div className={`mb-6 p-4 rounded-xl ${selectedIdeaStatus === 'ideas' ? 'border border-dashed border-gray-300 bg-gray-50/50' : ''}`}>
                {selectedIdeaStatus === 'ideas' && (
                  <div className="text-[11px] font-bold text-gray-400 tracking-widest uppercase mb-2">Description</div>
                )}
                <p className="text-[13px] text-gray-700 leading-relaxed">
                  {selectedIdeaCard.description || 'No description provided for this idea yet.'}
                </p>
              </div>

              {/* Meta Section */}
              <div className={`border rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-6 ${selectedIdeaStatus === 'ideas' ? 'border-dashed border-gray-300 bg-gray-50/50' : 'border-gray-200 bg-white'}`}>
                {/* Meta Left */}
                <div className="space-y-4">
                  <div>
                    <div className="text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-1.5">Created By</div>
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full ${selectedIdeaCard.assignee?.bgClass || 'bg-gray-100'} flex items-center justify-center text-[10px] font-bold ${selectedIdeaCard.assignee?.textClass || 'text-gray-600'}`}>
                        {selectedIdeaCard.assignee?.initials || 'U'}
                      </div>
                      <span className="text-[13px] font-medium text-gray-900">{selectedIdeaCard.assignee?.name || 'User'}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-1.5">Created At</div>
                    <div className="text-[13px] text-gray-700">Oct 12, 2025 at 10:30 AM</div>
                  </div>
                  {selectedIdeaStatus === 'ideas' && (
                    <div>
                      <div className="text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-1.5">Last Updated</div>
                      <div className="text-[13px] text-gray-700">2 hours ago</div>
                    </div>
                  )}
                  {(selectedIdeaStatus === 'progress' || selectedIdeaStatus === 'done') && (
                    <div>
                      <div className="text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-1.5">
                        {selectedIdeaStatus === 'progress' ? 'Moved to In Progress By' : 'In Progress By'}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-700">
                          AJ
                        </div>
                        <span className="text-[13px] font-medium text-gray-900">Arjun</span>
                      </div>
                    </div>
                  )}
                  {selectedIdeaStatus === 'progress' && (
                    <div>
                      <div className="text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-1.5">Moved At</div>
                      <div className="text-[13px] text-gray-700">Oct 14, 2025 at 2:15 PM</div>
                    </div>
                  )}
                  {selectedIdeaStatus === 'done' && (
                    <div>
                      <div className="text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-1.5">Marked as Done By</div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-[10px] font-bold text-purple-700">
                          SM
                        </div>
                        <span className="text-[13px] font-medium text-gray-900">Sarah</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Meta Right */}
                <div className="space-y-4">
                  <div>
                    <div className="text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-1.5">Status</div>
                    {selectedIdeaStatus === 'ideas' && <span className="inline-block px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[12px] font-medium">Idea</span>}
                    {selectedIdeaStatus === 'progress' && <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[12px] font-medium">In Progress</span>}
                    {selectedIdeaStatus === 'done' && <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 rounded text-[12px] font-medium">Done</span>}
                  </div>
                  {(selectedIdeaStatus === 'progress' || selectedIdeaStatus === 'done') && (
                    <div>
                      <div className="text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-1.5">Deadline</div>
                      {selectedIdeaStatus === 'progress' ? (
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] text-gray-900">Oct 20, 2025</span>
                          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 border border-amber-100 px-1.5 py-0.5 rounded text-[11px] font-medium">
                            <AlertCircle className="w-3 h-3" />
                            6 days left
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] text-gray-900">Oct 20, 2025</span>
                          <span className="inline-flex items-center gap-1 text-green-600 text-[12px] font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Completed on time
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  <div>
                    <div className="text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-1.5">Goal</div>
                    <div className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-[12px] font-medium">
                      <Flag className="w-3.5 h-3.5" />
                      {goalTitle || 'Checkout Drop-off'}
                    </div>
                  </div>
                  {(selectedIdeaStatus === 'progress' || selectedIdeaStatus === 'done') && (
                    <div>
                      <div className="text-[11px] font-bold text-gray-500 tracking-wider uppercase mb-1.5">Assigned To</div>
                      <div className="flex items-center gap-1.5">
                        <div className="flex -space-x-1.5">
                          <div className="w-6 h-6 rounded-full bg-blue-100 ring-2 ring-white flex items-center justify-center text-[10px] font-bold text-blue-700 z-20">AJ</div>
                          <div className="w-6 h-6 rounded-full bg-teal-100 ring-2 ring-white flex items-center justify-center text-[10px] font-bold text-teal-700 z-10">KL</div>
                          {selectedIdeaStatus === 'done' && (
                            <div className="w-6 h-6 rounded-full bg-gray-100 ring-2 ring-white flex items-center justify-center text-[10px] font-bold text-gray-600 z-0">+1</div>
                          )}
                        </div>
                        <span className="text-[13px] text-gray-600 ml-1">
                          {selectedIdeaStatus === 'done' ? 'Arjun, Kevin, +1' : 'Arjun, Kevin'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            {selectedIdeaStatus !== 'done' && (
              <div className="p-5 border-t border-gray-100 bg-gray-50 flex items-center justify-between mt-auto shrink-0 rounded-b-2xl">
                {/* Footer Left Actions */}
                <div className="flex items-center gap-3">
                  {selectedIdeaStatus === 'ideas' && (
                    <button className="px-4 py-2 border border-red-200 text-red-600 bg-white hover:bg-red-50 hover:border-red-300 font-medium rounded-lg text-[13px] transition-colors shadow-sm" onClick={() => setSelectedIdeaCard(null)}>
                      Delete
                    </button>
                  )}
                  {selectedIdeaStatus === 'progress' && (
                    <button className="px-4 py-2 border border-red-200 text-red-600 bg-white hover:bg-red-50 hover:border-red-300 font-medium rounded-lg text-[13px] transition-colors shadow-sm" onClick={() => setSelectedIdeaCard(null)}>
                      Drop Idea
                    </button>
                  )}
                </div>

                {/* Footer Middle Likes */}
                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-[13px] font-medium text-gray-500 flex items-center gap-1.5">
                    <ThumbsUp className="w-4 h-4" /> {selectedIdeaCard.thumbsUp || 5}
                  </span>
                  <div className="flex -space-x-1.5">
                    <div className="w-5 h-5 rounded-full bg-purple-100 ring-2 ring-gray-50 flex items-center justify-center text-[8px] font-bold text-purple-700 z-30">SM</div>
                    <div className="w-5 h-5 rounded-full bg-amber-100 ring-2 ring-gray-50 flex items-center justify-center text-[8px] font-bold text-amber-700 z-20">TR</div>
                    <div className="w-5 h-5 rounded-full bg-gray-200 ring-2 ring-gray-50 flex items-center justify-center text-[8px] font-bold text-gray-600 z-10">+3</div>
                  </div>
                </div>

                {/* Footer Right Actions */}
                <div className="flex items-center gap-3">
                  {selectedIdeaStatus === 'ideas' && (
                    <button className="px-5 py-2 bg-[#378ADD] text-white font-medium rounded-lg text-[13px] hover:bg-[#2c71b6] transition-colors shadow-sm flex items-center gap-1" onClick={() => setIsMoveToProgressModalOpen(true)}>
                      Move to In Progress <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                  {selectedIdeaStatus === 'progress' && (
                    <button className="px-5 py-2 bg-green-600 text-white font-medium rounded-lg text-[13px] hover:bg-green-700 transition-colors shadow-sm flex items-center gap-1" onClick={() => setIsMarkAsDoneModalOpen(true)}>
                      Mark as Done <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}
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
