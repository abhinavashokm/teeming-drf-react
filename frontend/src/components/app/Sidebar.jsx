import {
  ChevronDown, ChevronRight,
  Home,
  Layers,
  LogOut,
  PanelLeft,
  Search,
  Settings,
  Users,
  Zap
} from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { PERMISSIONS } from '../../constants/permissions';
import { ROUTE_PATHS } from '../../constants/routePaths';
import useAuth from '../../hooks/auth/useAuth';
import useLogout from '../../hooks/auth/useLogout';
import useGoals from '../../hooks/goal/useGoals';
import { useCan } from '../../hooks/permissions/useCan';
import useWorkspace from '../../hooks/workspace/useWorkspace';
import MemberAvatar from '../team/MemberAvatar';
import LeaveWorkspaceModal from '../workspace/LeaveWorkspaceModal';
import SwitchWorkspaceModal from '../workspace/SwitchWorkspaceModal';
import WorkspaceAvatar from '../workspace/WorkspaceAvatar';
import { workspaceRoles } from '../../constants/workspaceConstants';
import { planCodes } from '../../constants/subscriptionConstants';

const getGoalColors = (goalName) => {
  const colorSets = [
    { bg: 'bg-blue-100', text: 'text-blue-700' },
    { bg: 'bg-green-100', text: 'text-green-700' },
    { bg: 'bg-amber-100', text: 'text-amber-700' },
    { bg: 'bg-pink-100', text: 'text-pink-700' },
    { bg: 'bg-teal-100', text: 'text-teal-700' },
  ];
  let hash = 0;
  for (let i = 0; i < goalName.length; i++) {
    hash = goalName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colorSets[Math.abs(hash) % colorSets.length];
};

const SidebarItem = ({ icon: Icon, to, children, sidebarContentExpanded, leading, onClick }) => {
  return (

    <NavLink
      to={to}
      onClick={onClick}
      end
      className={({ isActive }) => `flex items-center ${sidebarContentExpanded ? 'gap-2.5 px-2.5' : 'justify-center px-0'} py-1.5 text-[13px] font-medium rounded-md transition-colors 
              ${isActive ? 'bg-teeming-green/10 text-teeming-green' : 'text-gray-600 hover:bg-gray-100/50'}`}
      title={!sidebarContentExpanded ? 'Home' : ''}
    >
      {({ isActive }) => (
        <>
          {leading}
          {
            Icon && <Icon
              className={`h-4 w-4 shrink-0 ${isActive
                ? 'text-teeming-green'
                : 'text-gray-400'
                }`}
              strokeWidth={1.5}
            />
          }


          {
            sidebarContentExpanded && children
          }
        </>
      )}
    </NavLink>
  )
}


function Sidebar({ isSidebarVisible, setIsSidebarVisible, isMobileMenuOpen, setIsMobileMenuOpen }) {

  const handleCloseSidebarOnMobile = () => {
    setIsMobileMenuOpen(false)
  }

  const { data: currentUser } = useAuth()
  const { data: currentWorkspace } = useWorkspace()
  const { mutate: logoutUser, isPending: isSigningOut } = useLogout()
  const { data } = useGoals()
  const goals =
    data?.pages.flatMap(
      page => page.goals
    ) ?? []

  const currentPlan = currentWorkspace?.subscription?.plan

  const canLeaveWorkspace = useCan(PERMISSIONS.LEAVE_WORKSPACE)
  const canUpgradePlan = useCan(PERMISSIONS.UPGRADE_PLAN)
  const canManageSettings = useCan(PERMISSIONS.MANAGE_SETTINGS)

  const [currentView, setCurrentView] = useState('home');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isSwitchWorkspaceModalOpen, setIsSwitchWorkspaceModalOpen] = useState(false);

  const roleColors = {
    [workspaceRoles.OWNER]: 'text-emerald-600',
    [workspaceRoles.ADMIN]: 'text-blue-600',
    [workspaceRoles.MEMBER]: 'text-gray-500'
  };

  const starredGoals = goals?.filter(g => g.isStarred) ?? []

  // True when sidebar content (labels etc) should be visible
  const sidebarContentExpanded = isMobileMenuOpen || isSidebarVisible;

  if (!currentWorkspace) return null

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileMenuOpen && (
        <div
          className="min-[1024px]:hidden fixed inset-0 bg-gray-900/40 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`
        bg-white min-[1024px]:bg-gray-50/50 flex flex-col shrink-0 h-[100dvh] z-52
        fixed min-[1024px]:relative top-0 left-0 z-50
        transition-all duration-200
        min-[1024px]:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0 w-64 shadow-2xl min-[1024px]:shadow-none' : '-translate-x-full'}
        ${isSidebarVisible ? 'min-[1024px]:w-64' : 'min-[1024px]:w-11'}
        border-r border-gray-200
      `}>

        {/* Workspace Dropdown */}
        <div className={`h-14 flex items-center ${sidebarContentExpanded ? 'justify-between px-3' : 'justify-center px-0'} shrink-0 relative border-b border-gray-200 z-50`}>
          <button
            onClick={() => setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen)}
            className={`flex items-center ${sidebarContentExpanded ? 'flex-1 justify-between p-1.5' : 'justify-center p-1.5 w-full'} rounded-lg hover:bg-gray-100/50 transition-colors group text-left min-w-0`}
            title={!sidebarContentExpanded ? currentWorkspace.name : ''}
          >
            <div className={`flex items-center gap-2.5 min-w-0 ${!sidebarContentExpanded ? 'mx-auto' : ''}`}>

              <WorkspaceAvatar
                workspace={currentWorkspace}
                size="sm"
              />

              {sidebarContentExpanded && (
                <div className="flex flex-col min-w-0 text-left">
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <span className="font-semibold text-[14px] text-gray-900 tracking-tight truncate leading-tight">{currentWorkspace.name}</span>
                    <ChevronDown className="h-3.5 w-3.5 text-gray-400 group-hover:text-gray-600 shrink-0" />
                  </div>
                  <div className="flex items-center gap-2 text-[11px] mt-0.5 min-w-0">
                    <span className="text-gray-500 truncate">
                      {currentPlan?.name} {currentPlan.code !== planCodes.ENTERPRISE && "plan"}
                    </span>

                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0 ${roleColors[currentWorkspace.role] || "text-gray-500"
                        }`}
                    >
                      {currentWorkspace.role}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </button>

          {sidebarContentExpanded && (
            <div className="flex items-center gap-1 ml-1 shrink-0">
              <button
                onClick={() => {
                  // Open search modal / command palette
                }}
                className="
                          text-gray-400
                          hover:text-gray-900
                          hover:bg-gray-100
                          p-1.5
                          rounded-md
                          transition-colors
                        "
                title="Search"
              >
                <Search className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </button>

              <button
                onClick={() =>
                  isMobileMenuOpen
                    ? setIsMobileMenuOpen(false)
                    : setIsSidebarVisible(!isSidebarVisible)
                }
                className="
        text-gray-400
        hover:text-gray-900
        hover:bg-gray-100
        p-1.5
        rounded-md
        transition-colors
      "
                title="Collapse Sidebar"
              >
                <PanelLeft className="h-[18px] w-[18px]" strokeWidth={1.5} />
              </button>
            </div>
          )}

          {isWorkspaceDropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsWorkspaceDropdownOpen(false)} />
              <div className="absolute left-4 top-full mt-1 w-[240px] bg-white border border-gray-200/80 rounded-xl shadow-[0_12px_24px_-8px_rgba(0,0,0,0.15)] py-2 z-50 overflow-hidden">
                <div className="border-t border-gray-100/80 mb-1.5" />

                {canUpgradePlan && (
                  <Link to={'upgrade-plan'} onClick={() => { setIsWorkspaceDropdownOpen(false); handleCloseSidebarOnMobile(); }} className="w-[calc(100%-12px)] mx-1.5 flex items-center justify-start gap-2.5 px-2.5 py-1.5 text-[13px] font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-[8px] transition-colors group">
                    <Zap className="h-[15px] w-[15px] text-gray-400 group-hover:text-yellow-500" />
                    Upgrade Plan
                  </Link>
                )}

                <button
                  onClick={() => { setIsSwitchWorkspaceModalOpen(true); setIsWorkspaceDropdownOpen(false); handleCloseSidebarOnMobile() }}
                  className="w-[calc(100%-12px)] mx-1.5 flex items-center justify-start gap-2.5 px-2.5 py-1.5 text-[13px] font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-[8px] transition-colors group"
                >
                  <Layers className="h-[15px] w-[15px] text-gray-400 group-hover:text-gray-600" />
                  Switch Workspace
                </button>

                <div className="border-t border-gray-100/80 my-1.5" />

                {canLeaveWorkspace && (
                  <button
                    onClick={() => { setIsWorkspaceDropdownOpen(false); setIsLeaveModalOpen(true); }}
                    className="w-[calc(100%-12px)] mx-1.5 flex items-center justify-start gap-2.5 px-2.5 py-1.5 text-[13px] font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-[8px] transition-colors group"
                  >
                    <LogOut className="h-[15px] w-[15px] text-red-500 group-hover:text-red-600" />
                    Leave Workspace
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        <nav className={`flex-1 overflow-y-auto ${sidebarContentExpanded ? 'px-3' : 'px-1.5'} py-5 space-y-4`}>



          {/* Home */}
          <div className="pb-4 border-b border-gray-200">
            <SidebarItem
              to={""}
              onClick={handleCloseSidebarOnMobile}
              sidebarContentExpanded={sidebarContentExpanded}
              icon={Home}
            >
              <span>Home</span>
            </SidebarItem>
          </div>

          {/* Starred Goals */}
          {
            starredGoals.length > 0 &&
            <div className="pb-4 border-b border-gray-200">
              {sidebarContentExpanded && (
                <h3 className="text-[11px] font-semibold text-gray-500 tracking-wider px-2.5 mb-2">Starred Goals</h3>
              )}
              <div className="space-y-0.5">
                {starredGoals.map(goal => {
                  const colors = getGoalColors(goal.name);
                  return (
                    <SidebarItem key={goal.id}
                      to={ROUTE_PATHS.GOAL_DASHBOARD(currentWorkspace.slug, goal.id)}
                      onClick={handleCloseSidebarOnMobile}
                      sidebarContentExpanded={sidebarContentExpanded}
                      leading={
                        <div
                          className={`w-[22px] h-[22px] rounded-full flex items-center justify-center text-[9px] font-semibold ${colors.bg} ${colors.text}`}
                        >
                          {goal.name.substring(0, 2).toUpperCase()}
                        </div>
                      }
                    >
                      <span> {goal.name}</span>
                    </SidebarItem>
                  );
                })}
                {sidebarContentExpanded && starredGoals.length === 0 && (
                  <div className="px-2.5 py-1.5 text-[12px] text-gray-400 italic">No starred goals</div>
                )}
              </div>
            </div>
          }

          {/* Manage Team & Settings */}
          <div className="space-y-0.5">

            <SidebarItem to={"manage-team"} sidebarContentExpanded={sidebarContentExpanded} icon={Users} onClick={handleCloseSidebarOnMobile} >
              <span>{currentWorkspace.role !== 'Member' ? 'Manage Team' : 'View Team'}</span>
            </SidebarItem>

            {canManageSettings && (
              <SidebarItem to={"settings"} sidebarContentExpanded={sidebarContentExpanded} icon={Settings} onClick={handleCloseSidebarOnMobile} >
                <span>Settings</span>
              </SidebarItem>
            )}

          </div>

        </nav>

        {/* User Profile Strip */}
        <div className={`shrink-0 border-t border-gray-200 relative ${sidebarContentExpanded ? 'p-4' : 'p-2 flex flex-col items-center'}`}>
          <button
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className={`w-full flex items-center p-2 rounded-xl hover:bg-gray-100/50 transition-colors group ${sidebarContentExpanded ? 'justify-between -mx-2' : 'justify-center mx-0'}`}
            title={!sidebarContentExpanded ? 'Profile' : ''}
          >
            <div className="flex items-center gap-3">
              <MemberAvatar user={currentUser} />
              {sidebarContentExpanded && (
                <div className="flex flex-col min-w-0 text-left">
                  <span className="text-[14px] font-medium text-gray-900 truncate leading-tight">{currentUser.fullName}</span>
                  <span className="text-[12px] text-gray-500 mt-0.5">{currentUser.email}</span>
                </div>
              )}
            </div>
            {sidebarContentExpanded && (
              isProfileDropdownOpen
                ? <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
                : <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 shrink-0" />
            )}
          </button>

          {isProfileDropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsProfileDropdownOpen(false)} />
              <div className="absolute bottom-full left-4 mb-3 w-[240px] bg-white border border-gray-200/80 rounded-xl shadow-[0_12px_24px_-8px_rgba(0,0,0,0.15)] py-2 z-50 overflow-hidden">
                <Link to="my-account" onClick={() => { setIsProfileDropdownOpen(false); handleCloseSidebarOnMobile(); }}>
                  <button className="w-[calc(100%-12px)] mx-1.5 flex items-center gap-2.5 px-2.5 py-1.5 text-[13px] font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-[8px] transition-colors group">
                    <Settings className="h-[15px] w-[15px] text-gray-400 group-hover:text-gray-600" />
                    My Account
                  </button>
                </Link>
                <div className="border-t border-gray-100 my-1.5" />
                <button
                  onClick={logoutUser}
                  disabled={isSigningOut}
                  className="w-[calc(100%-12px)] mx-1.5 flex items-center gap-2.5 px-2.5 py-1.5 text-[13px] font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-[8px] transition-colors group"
                >
                  <LogOut className="h-[15px] w-[15px] text-red-500 group-hover:text-red-600" />
                  {isSigningOut ? "Signing Out.." : "Sign Out"}
                </button>
              </div>
            </>
          )}

          {/* Expand button when collapsed */}
          {!sidebarContentExpanded && (
            <div className="mt-2 border-t border-gray-200/50 pt-2 flex w-full justify-center">
              <button
                onClick={() => setIsSidebarVisible(true)}
                className="text-gray-400 hover:text-gray-900 hover:bg-gray-100 p-1.5 rounded-md transition-colors"
                title="Expand Sidebar"
              >
                <PanelLeft className="h-[18px] w-[18px]" strokeWidth={1.5} />
              </button>
            </div>
          )}
        </div>
      </aside>

      <LeaveWorkspaceModal isOpen={isLeaveModalOpen} onClose={() => setIsLeaveModalOpen(false)} />
      <SwitchWorkspaceModal isOpen={isSwitchWorkspaceModalOpen} onClose={() => setIsSwitchWorkspaceModalOpen(false)} />
    </>
  )
}

export default Sidebar