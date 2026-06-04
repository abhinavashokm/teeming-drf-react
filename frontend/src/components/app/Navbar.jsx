import {
  Bell, Info
} from 'lucide-react';
import { useMatches } from 'react-router-dom';
import useGoal from '../../hooks/goal/useGoal';
import useGoalId from '../../hooks/params/useGoalId';
import useWorkspace from '../../hooks/workspace/useWorkspace';
import { useState } from 'react';
import GoalInfoModal from '../goal/GoalInfoModal';


function Navbar({ isNavbarVisible, isScrolled }) {

  const { data: currentWorkspace } = useWorkspace()
  const goalId = useGoalId()
  const { data: currentGoal } = useGoal()
  const matches = useMatches()


  const staticBreadcrumb = matches.findLast(m => m.handle?.breadcrumb)?.handle?.breadcrumb
  const currentPage = goalId ? currentGoal?.name : staticBreadcrumb

  const [isGoalInfoModalOpen, setIsGoalInfoModalOpen] = useState(false)

  return (
    <>
      <header
        className={`bg-white transition-all duration-200 overflow-hidden flex items-center justify-between shrink-0 w-full h-[44px] ${isScrolled ? 'border-b border-gray-200 shadow-[0_1px_4px_rgba(0,0,0,0.06)]' : 'border-b border-transparent'}`}
      >
        <div className="flex items-center gap-2 pl-15 flex-1">
          <span className="text-[13px] font-medium text-gray-500">{currentWorkspace.name}</span>
          <span className="text-gray-300 mx-1">›</span>
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[13px] font-medium text-gray-900 truncate">{currentPage}</span>
            <button
              className="hidden md:flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors outline-none shrink-0"
              onClick={() => setIsGoalInfoModalOpen(true)}
              title="Goal info"
            >
              {
                goalId && <Info className="w-3.5 h-3.5" strokeWidth={2} />
              }
            </button>
          </div>

        </div>

        <div className="flex items-center pr-4 mr-2 justify-end">
          <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell className="h-[17px] w-[17px]" strokeWidth={1.5} />
            <span className="absolute top-1.5 right-1.5 block h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>
        </div>
      </header>

      {isGoalInfoModalOpen &&
        <GoalInfoModal onClose={() => setIsGoalInfoModalOpen(false)} />}
    </>
  )
}

export default Navbar