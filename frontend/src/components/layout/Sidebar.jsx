import {
  ChevronDown, ChevronRight,
  Home,
  Mail,
  PanelLeft,
  Plus,
  Search,
  Settings
} from 'lucide-react';
import { useState } from 'react';
import useInitializeAuth from '../../hooks/auth/useInitializeAuth';


function Sidebar({ isSidebarVisible, setIsSidebarVisible }) {
  const { data: user } = useInitializeAuth()
  const [activeWorkspace, setActiveWorkspace] = useState(true);

  return (
    <aside className={`bg-gray-50 flex flex-col flex shrink-0 h-screen
    transition-all duration-200 
    fixed md:sticky top-0 left-0 z-40
    ${isSidebarVisible ? 'w-64 border-r border-gray-200' : 'w-0 border-transparent overflow-hidden'}`}>

      {/* Brand logo in sidebar top */}
      <div className="h-14 flex items-center justify-between px-5 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-teeming-green rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white font-semibold text-sm leading-none">T</span>
          </div>
          <span className="font-semibold text-base text-teeming-green tracking-tight">Teeming</span>
        </div>
        <button
          onClick={() => setIsSidebarVisible(!isSidebarVisible)}
          className="text-gray-400 hover:text-gray-900 hover:bg-gray-100 p-1.5 rounded-md transition-colors"
        >
          <PanelLeft className="h-[18px] w-[18px]" strokeWidth={1.5} />
        </button>
      </div>
      <div className="mx-4 border-b border-gray-200 shrink-0"></div>

      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-8">

        {/* Top Nav */}
        <div>
          <div className="flex gap-1 pb-3 border-b border-gray-100">
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
          <div className="pt-3 space-y-2">
            <a href="#" className="flex items-center gap-2.5 px-2.5 py-1.5 text-[13px] font-medium rounded-md border-l-2 border-teeming-green bg-teeming-green/10 text-teeming-green transition-colors">
              <Home className="h-4 w-4 text-teeming-green" strokeWidth={1.5} />
              Home
            </a>
            <a href="#" className="flex items-center gap-2.5 px-2.5 py-1.5 text-[13px] font-medium rounded-md text-gray-600 hover:bg-gray-100/50 transition-colors">
              <Settings className="h-4 w-4 text-gray-400" strokeWidth={1.5} />
              My Account
            </a>
          </div>
        </div>

        {/* My Workspaces */}
        <div>
          <div className="flex items-center justify-between px-2.5 mb-2">
            <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">My Workspaces</h3>
            <button className="text-gray-400 hover:text-gray-600">
              <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </div>
          <div className="space-y-0.5">
            <a href="#" className="flex items-center gap-2.5 px-2.5 py-1.5 text-[13px] font-medium rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 transition-colors">
              <Plus className="h-4 w-4 text-gray-400" strokeWidth={1.5} />
              Add a workspace
            </a>
          </div>
        </div>

        {/* Joined Workspaces */}
        <div>
          <div className="flex items-center justify-between px-2.5 mb-2">
            <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Joined Workspaces</h3>
          </div>
          <div className="space-y-1">
            {/* Active Workspace */}
            <div className="space-y-0.5">
              <button
                onClick={() => setActiveWorkspace(!activeWorkspace)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 text-[13px] font-medium rounded-md hover:bg-gray-100/50 text-gray-900 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-[4px] bg-gray-900 flex items-center justify-center text-white text-[10px] font-medium">
                    A
                  </div>
                  Acme Corp
                </div>
                {activeWorkspace ? (
                  <ChevronDown className="h-3.5 w-3.5 text-gray-400" strokeWidth={2} />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 text-gray-400" strokeWidth={2} />
                )}
              </button>
              {/* Sub-menu */}
              {activeWorkspace && (
                <div className="pl-10 pr-2 py-0.5 space-y-0.5">
                  <a href="#" className="block px-2 py-1.5 text-[13px] font-medium text-gray-600 hover:bg-gray-100/50 rounded-md transition-colors">Checkout drop off</a>
                  <a href="#" className="block px-2 py-1.5 text-[13px] font-medium text-gray-600 hover:bg-gray-100/50 rounded-md transition-colors">Reduce churn</a>
                  <a href="#" className="block px-2 py-1.5 text-[13px] font-medium text-gray-600 hover:bg-gray-100/50 rounded-md transition-colors">Launch v2</a>
                </div>
              )}
            </div>

            {/* Inactive Workspace */}
            <button className="w-full flex items-center justify-between px-2.5 py-1.5 text-[13px] font-medium rounded-md text-gray-600 hover:bg-gray-100/50 hover:text-gray-900 transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-[4px] bg-indigo-500 flex items-center justify-center text-white text-[10px] font-medium">
                  C
                </div>
                Client TechFlow
              </div>
            </button>
          </div>
        </div>

      </nav>

      {/* User Profile Strip */}
      <div className="shrink-0 border-t border-gray-200 px-4 py-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white text-[12px] font-medium shadow-sm shrink-0">
          AJ
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[14px] font-medium text-gray-900 truncate leading-tight">{user.fullName}</span>
          <div className="flex items-center text-[12px] mt-0.5">
            <span className="text-gray-500 truncate">Free plan</span>
            <span className="text-gray-400 mx-1.5">·</span>
            <button className="text-teeming-green font-medium hover:underline truncate">Upgrade</button>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar