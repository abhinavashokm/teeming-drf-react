import { useEffect, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import RightPanelToggleBtn from '../../components/goal/RightPanelToggleBtn';
import BaseModal from '../../components/ui/modal/BaseModal';
import { useGroupDiscussionWS } from '../../contexts/GroupDiscussionWSContext';
import useGoal from '../../hooks/goal/useGoal';
import BoardView from './components/BoardView';
import GoalTabs from './components/GoalTabs';
import OutcomeView from './components/OutcomeView';
import RightPanel from './components/rightPanel/RightPanel';


export default function GoalDashboard({ goalTitle }) {

  const { data: currentGoal, isLoading } = useGoal()
  const [activeView, setActiveView] = useState('board');
  const { setIsGoalInfoModalOpen } = useOutletContext()

  /* -------------------------------------------------------------------------- */
  /* Right Panel toggle handlers */
  /* -------------------------------------------------------------------------- */
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false)
  const { onPanelOpen, onPanelClose } = useGroupDiscussionWS()

  const handleOpenPanel = () => {
    setIsRightPanelOpen(true)
    onPanelOpen()              // ← clears unread, flips ref
  }

  const handleClosePanel = () => {
    setIsRightPanelOpen(false)
    onPanelClose()             // ← resumes unread counting
  }


  /* -------------------------------------------------------------------------- */
  /* right panel drag to resize configs */
  /* -------------------------------------------------------------------------- */
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

  return (

    <div className="flex flex-1 h-full overflow-hidden  relative">
      <div className="flex-1 flex flex-col min-w-0">

        {/* Fixed Header: View Switcher */}
        <GoalTabs activeView={activeView} setActiveView={setActiveView} />

        {/* Scrollable Content */}
        <div className={`flex-1 min-h-0 ${activeView === 'board' ? 'overflow-hidden' : 'overflow-y-auto overflow-x-hidden scrollbar-hide'}`}>
          <div className={`w-full  h-full pt-6`}>

            {/* Main Content Areas */}
            {activeView === 'board' ? (
              <BoardView isRightPanelOpen={isRightPanelOpen} />
            ) : (
              <OutcomeView />
            )}

          </div>
        </div>
      </div>

      {
        !isRightPanelOpen &&
        <RightPanelToggleBtn onOpen={handleOpenPanel} />
      }

      {/* Right Side Panel */}
      {/* Mobile */}
      {isMobile && (
        <BaseModal
          isOpen={isRightPanelOpen}
          onClose={handleClosePanel}
          size="sm"
          sheetBreakpoint="lg"
        >
          <RightPanel
            isMobile={true}
            onClose={handleClosePanel}
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
          <RightPanel onClose={handleClosePanel} />
        </div>
      )}

    </div>

  );
}
