import {
  BellIcon,
  Info
} from 'lucide-react';
import { Link, useMatches } from 'react-router-dom';
import { ROUTE_PATHS } from '../../constants/routePaths';
import useGoal from '../../hooks/goal/useGoal';
import useGoalId from '../../hooks/params/useGoalId';
import useWorkspace from '../../hooks/workspace/useWorkspace';
import { NotificationBell } from './NotificationBell';
import { PresenceIndicator } from './PresenceIndicator';



function Navbar({ isNavbarVisible, isSidebarVisible, isScrolled, showShadow = false, setIsGoalInfoModalOpen }) {

  const { data: currentWorkspace } = useWorkspace()
  const goalId = useGoalId()
  const { data: currentGoal, isPending } = useGoal()
  const matches = useMatches()


  const staticBreadcrumb = matches.findLast(m => m.handle?.breadcrumb)?.handle?.breadcrumb
  const currentPage = goalId ? currentGoal?.name : staticBreadcrumb

  return (
    <>
      <header
        className={`fixed top-0 right-0 left-0 bg-white transition-all duration-200 flex items-center justify-between shrink-0 h-[44px] z-30
    ${isSidebarVisible ? 'min-[1024px]:left-64' : 'min-[1024px]:left-11'}
    ${isScrolled || showShadow
            ? 'border-b border-gray-200 shadow-[0_1px_4px_rgba(0,0,0,0.06)]'
            : 'border-b border-transparent'
          }`
        }
      >
        <div className="flex items-center gap-2 pl-15 flex-1 min-w-0 overflow-hidden">
          <Link to={ROUTE_PATHS.WORKSPACE(currentWorkspace?.slug)} ><span className="text-[13px] font-medium text-gray-500 shrink-0">{currentWorkspace.name}</span></Link>

          <span className="text-gray-300 mx-1 shrink-0">›</span>
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            {
              currentPage ?
                <>
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
                </>
                :
                //loading skelton
                <span className="inline-block h-[14px] w-24 bg-gray-100 rounded-md animate-pulse align-middle" />
            }

          </div>

        </div>

        <div className="flex items-center gap-2 pr-4 mr-2 justify-end">
          <PresenceIndicator />
          <NotificationBell />
        </div>


      </header>

    </>
  )
}

export default Navbar