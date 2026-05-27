import {
  ChevronDown, ChevronRight,
  Home,
  Layers,
  LogOut,
  Mail,
  PanelLeft,
  Search,
  Settings,
  Target,
  Users,
  Zap
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/auth/useAuth';
import useLogout from '../../hooks/auth/useLogout';
import LeaveWorkspaceModal from '../workspace/LeaveWorkspaceModal';
import SwitchWorkspaceModal from '../workspace/SwitchWorkspaceModal';
import useWorkspace from '../../hooks/workspace/useWorkspace';
import useRemoveMember from '../../hooks/workspace/useRemoveMember';
import useLeaveWorkspace from '../../hooks/workspace/useLeaveWorkspace';



function Sidebar({ isSidebarVisible, setIsSidebarVisible }) {

  const { data: currentUser } = useAuth()
  const { data: currentWorkspace } = useWorkspace()
  const { mutate: logoutUser } = useLogout()

  const [activeWorkspace, setActiveWorkspace] = useState(true);



  const [currentView, setCurrentView] = useState('home');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isSwitchWorkspaceModalOpen, setIsSwitchWorkspaceModalOpen] = useState(false);

  const roleColors = {
    Owner: 'text-emerald-600',
    Admin: 'text-blue-600',
    Member: 'text-gray-500'
  };

  const favoriteGoals = []

  if (!currentWorkspace) return null
  return (
    <>
      <aside className={`bg-white md:bg-gray-50/50 flex flex-col shrink-0 h-screen absolute md:relative top-0 left-0 z-40 transition-all duration-200 ${isSidebarVisible ? 'w-64 border-r border-gray-200' : 'w-0 border-transparent overflow-hidden'}`}>

        {/* Workspace Dropdown in sidebar top */}
        <div className="h-14 flex items-center justify-between px-3 shrink-0 relative border-b border-gray-200 z-50">
          <button
            onClick={() => setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen)}
            className="flex-1 flex items-center justify-between p-1.5 rounded-lg hover:bg-gray-100/50 transition-colors group text-left min-w-0"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 bg-gray-900 rounded-[8px] flex items-center justify-center text-white text-[12px] font-medium shadow-sm shrink-0">
                {currentWorkspace.name[0]}
              </div>
              <div className="flex flex-col min-w-0 text-left">
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <span className="font-semibold text-[14px] text-gray-900 tracking-tight truncate leading-tight">{currentWorkspace.name}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-gray-400 group-hover:text-gray-600 shrink-0" />
                </div>
                <div className="flex items-center text-[11px] mt-0.5">
                  <span className="text-gray-500 truncate">Free plan</span>
                  <span className="text-gray-300 mx-1">·</span>
                  <span className={`truncate ${currentWorkspace.role || 'text-gray-500'}`}>{currentWorkspace.role}</span>
                </div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setIsSidebarVisible(!isSidebarVisible)}
            className="text-gray-400 hover:text-gray-900 hover:bg-gray-100 p-1.5 rounded-md transition-colors ml-1 shrink-0"
          >
            <PanelLeft className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </button>

          {isWorkspaceDropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsWorkspaceDropdownOpen(false)}></div>
              <div className="absolute left-4 top-full mt-1 w-[240px] bg-white border border-gray-200/80 rounded-xl shadow-[0_12px_24px_-8px_rgba(0,0,0,0.15)] py-2 z-50 overflow-hidden transform origin-top-left transition-all duration-200">

                <div className="border-t border-gray-100/80 mb-1.5"></div>
                <button className="w-[calc(100%-12px)] mx-1.5 flex items-center justify-start gap-2.5 px-2.5 py-1.5 text-[13px] font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-[8px] transition-colors group">
                  <Zap className="h-[15px] w-[15px] text-gray-400 group-hover:text-yellow-500" />
                  Upgrade Plan
                </button>
                <button onClick={() => { setIsSwitchWorkspaceModalOpen(true); setIsWorkspaceDropdownOpen(false); }} className="w-[calc(100%-12px)] mx-1.5 flex items-center justify-start gap-2.5 px-2.5 py-1.5 text-[13px] font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-[8px] transition-colors group">
                  <Layers className="h-[15px] w-[15px] text-gray-400 group-hover:text-gray-600" />
                  Switch Workspace
                </button>
                <div className="border-t border-gray-100/80 my-1.5"></div>

                {
                  currentWorkspace.role !== 'Owner' &&

                  <button onClick={() => { setIsWorkspaceDropdownOpen(false); setIsLeaveModalOpen(true); }} className="w-[calc(100%-12px)] mx-1.5 flex items-center justify-start gap-2.5 px-2.5 py-1.5 text-[13px] font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-[8px] transition-colors group">
                    <LogOut className="h-[15px] w-[15px] text-red-500 group-hover:text-red-600" />
                    Leave Workspace
                  </button>
                }

              </div>
            </>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-4">

          {/* Search & Inbox */}
          <div className="flex gap-1 pb-4 border-b border-gray-200">
            <button
              onClick={() => console.log('Search clicked')}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 border border-gray-200 bg-white hover:bg-gray-50 rounded-md shadow-sm text-[12px] font-medium text-gray-500 transition-colors"
            >
              <Search className="h-3.5 w-3.5 text-gray-400" strokeWidth={1.5} />
              Search
            </button>

            <button
              onClick={() => console.log('Inbox clicked')}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 border border-gray-200 bg-white hover:bg-gray-50 rounded-md shadow-sm text-[12px] font-medium text-gray-500 transition-colors"
            >
              <Mail className="h-3.5 w-3.5 text-gray-400" strokeWidth={1.5} />
              Inbox
              <span className="flex items-center justify-center h-3.5 bg-teeming-green text-white text-[9px] rounded-full px-1.5 ml-0.5">
                3
              </span>
            </button>

          </div>

          {/* Home */}
          <div className="pb-4 border-b border-gray-200">
            <Link to={''} onClick={() => setCurrentView('home')} className={`flex items-center gap-2.5 px-2.5 py-1.5 text-[13px] font-medium rounded-md transition-colors ${currentView === 'home' ? 'bg-teeming-green/10 text-teeming-green' : 'text-gray-600 hover:bg-gray-100/50'}`}>
              <Home className={`h-4 w-4 ${currentView === 'home' ? 'text-teeming-green' : 'text-gray-400'}`} strokeWidth={1.5} />
              Home
            </Link>
          </div>

          {/* Goals */}
          <div className="pb-4 border-b border-gray-200">
            <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-2.5 mb-2">Starred Goals</h3>
            <div className="space-y-0.5">
              {favoriteGoals.map(goal => (
                <a key={goal} href="#" className="flex items-center gap-2.5 px-2.5 py-1.5 text-[13px] font-medium text-gray-600 hover:bg-gray-100/50 rounded-md transition-colors">
                  <Target className="h-4 w-4 text-gray-400" strokeWidth={1.5} />
                  {goal}
                </a>
              ))}
              {favoriteGoals.length === 0 && (
                <div className="px-2.5 py-1.5 text-[12px] text-gray-400 italic">No starred goals</div>
              )}
            </div>
          </div>

          {/* Settings & Manage Team */}
          <div className="space-y-0.5">

            <Link to={'manage-team'} onClick={() => setCurrentView('team')} className={`flex items-center gap-2.5 px-2.5 py-1.5 text-[13px] font-medium rounded-md transition-colors ${currentView === 'team' ? 'bg-teeming-green/10 text-teeming-green' : 'text-gray-600 hover:bg-gray-100/50'}`}>
              <Users className={`h-4 w-4 ${currentView === 'team' ? 'text-teeming-green' : 'text-gray-400'}`} strokeWidth={1.5} />
               {currentWorkspace.role !== "Member"? "Manage Team" : "View Team"} 
            </Link>

            {
              currentWorkspace.role !== "Member" &&
              <Link to={'settings'} onClick={() => setCurrentView('workspace_settings')} className={`flex items-center gap-2.5 px-2.5 py-1.5 text-[13px] font-medium rounded-md transition-colors ${currentView === 'workspace_settings' ? 'bg-teeming-green/10 text-teeming-green' : 'text-gray-600 hover:bg-gray-100/50'}`}>
                <Settings className={`h-4 w-4 ${currentView === 'workspace_settings' ? 'text-teeming-green' : 'text-gray-400'}`} strokeWidth={1.5} />
                Settings
              </Link>
            }


          </div>

        </nav>

        {/* User Profile Strip */}
        <div className="shrink-0 border-t border-gray-200 p-4 relative">
          <button
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className="w-full flex items-center justify-between p-2 -mx-2 rounded-xl hover:bg-gray-100/50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white text-[12px] font-medium shadow-sm shrink-0">
                {currentUser.fullName.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex flex-col min-w-0 text-left">
                <span className="text-[14px] font-medium text-gray-900 truncate leading-tight">{currentUser.fullName}</span>
                <span className="text-[12px] text-gray-500 mt-0.5">{currentUser.email}</span>
              </div>
            </div>
            {isProfileDropdownOpen ? (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
            )}
          </button>

          {isProfileDropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsProfileDropdownOpen(false)}></div>
              <div className="absolute bottom-full left-4 mb-3 w-[240px] bg-white border border-gray-200/80 rounded-xl shadow-[0_12px_24px_-8px_rgba(0,0,0,0.15)] py-2 z-50 overflow-hidden transform origin-bottom-left transition-all duration-200 opacity-100 scale-100">

                <Link to={'my-account'} onClick={() => { setCurrentView('account'); setIsProfileDropdownOpen(false); }}>
                  <button
                    className="w-[calc(100%-12px)] mx-1.5 flex items-center gap-2.5 px-2.5 py-1.5 text-[13px] font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-[8px] transition-colors group"
                  >
                    <Settings className="h-[15px] w-[15px] text-gray-400 group-hover:text-gray-600" />
                    My Account
                  </button>
                </Link>

                <div className="border-t border-gray-100 my-1.5"></div>

                <button onClick={logoutUser} className="w-[calc(100%-12px)] mx-1.5 flex items-center gap-2.5 px-2.5 py-1.5 text-[13px] font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-[8px] transition-colors group">
                  <LogOut className="h-[15px] w-[15px] text-red-500 group-hover:text-red-600" />
                  Sign Out
                </button>

              </div>
            </>
          )}
        </div>
      </aside>

      <LeaveWorkspaceModal isOpen={isLeaveModalOpen} onClose={() => setIsLeaveModalOpen(false)} />
      <SwitchWorkspaceModal isOpen={isSwitchWorkspaceModalOpen} onClose={() => setIsSwitchWorkspaceModalOpen(false)} />

    </>
  )
}

export default Sidebar