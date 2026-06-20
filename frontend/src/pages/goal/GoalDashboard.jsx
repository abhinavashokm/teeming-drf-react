import { Flag, Info, Lock, MessageSquare, X } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import BaseModal from '../../components/ui/modal/BaseModal';
import useGoal from '../../hooks/goal/useGoal';
import BoardView from './components/BoardView';
import GoalTabs from './components/GoalTabs';
import OutcomeView from './components/OutcomeView';
import RightPanel from './components/rightPanel/RightPanel';


export default function GoalDashboard({ goalTitle }) {

  const { setIsFullBleed, setIsGoalInfoModalOpen } = useOutletContext()
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false)

  useEffect(() => {
    setIsFullBleed(true)
    return () => setIsFullBleed(false);
  }, [])

  const { data: currentGoal, isLoading } = useGoal()


  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [canResizeRightPanel, setCanResizeRightPanel] = useState(window.innerWidth >= 1400)

  const panelWidth = useRef(320);
  const [width, setWidth] = useState(320);
  const isResizing = useRef(false);

  const onMouseDown = () => {
    isResizing.current = true;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = (e) => {
    if (!isResizing.current) return;
    const newWidth = window.innerWidth - e.clientX;
    if (newWidth < 240 || newWidth > 600) return; // min/max limits
    panelWidth.current = newWidth;
    setWidth(newWidth);
  };

  const onMouseUp = () => {
    isResizing.current = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      setCanResizeRightPanel(window.innerWidth >= 1400)
      if (window.innerWidth < 1400) {
        setWidth(320);
      }
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


  return (
    <div className="flex flex-1 h-full overflow-hidden  relative">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Fixed Header: View Switcher */}
        <GoalTabs activeView={activeView} setActiveView={setActiveView} />

        {/* Scrollable Content */}
        <div className={`flex-1 min-h-0 ${activeView === 'board' ? 'overflow-hidden' : 'overflow-y-auto overflow-x-hidden scrollbar-hide'}`}>
          <div className={`w-full transition-all duration-300 
            ${activeView === 'board'
              ? 'h-full pt-6'
              : 'px-8 pt-6 md:px-12 lg:px-16 pb-8 md:pb-12'
            }`}
          >

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
      {
        !isRightPanelOpen &&
        <button
          className="fixed min-[865px]:absolute bottom-6 right-6 w-14 h-14 bg-[#378ADD] text-white rounded-full shadow-[0_4px_14px_rgba(55,138,221,0.4)] flex items-center justify-center hover:bg-[#2c71b6] transition-colors z-40"
          onClick={() => setIsRightPanelOpen(true)}
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      }



      {/* Right Side Panel */}
      {/* Mobile */}
      {isMobile && (
        <BaseModal
          isOpen={isRightPanelOpen}
          onClose={() => setIsRightPanelOpen(false)}
          size="sm"
          sheetBreakpoint="lg"
        >
          <RightPanel
            isMobile={true}
            onClose={() => setIsRightPanelOpen(false)}
          />
        </BaseModal>
      )}

      {/* Desktop */}
      {!isMobile && isRightPanelOpen && (
        <div
          style={{ width }}
          className="shrink-0 border-l border-gray-200 bg-white h-full flex flex-col overflow-hidden relative"
        >
          {/* Drag handle */}
          {
            canResizeRightPanel &&
            <div
              onMouseDown={onMouseDown}
              className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-[#378ADD]/30 transition-colors z-10"
            />
          }
          <RightPanel onClose={() => setIsRightPanelOpen(false)} />
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

    </div>
  );
}
