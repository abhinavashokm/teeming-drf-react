import {
  PanelLeft,
  PanelTop
} from 'lucide-react';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/app/Navbar';
import Sidebar from '../components/app/Sidebar';
import useWorkspace from '../hooks/workspace/useWorkspace';
import FullPageLoader from '../components/ui/FullPageLoader';

function WorkspaceLayout() {

  const { data, isPending: isWorkspacePending, isError } = useWorkspace()

  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  if (isWorkspacePending) return <FullPageLoader />

  return (
    <div className="flex h-screen bg-white font-sans text-gray-900 antialiased selection:bg-teeming-green/20"
    >

      {/* Sidebar */}
      {isSidebarVisible && (
        <div
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setIsSidebarVisible(false)}
        />
      )}
      <Sidebar isSidebarVisible={isSidebarVisible} setIsSidebarVisible={setIsSidebarVisible} />

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">

        {/* Toggle Navbar & Sidebar Buttons - Pinned to top */}
        <div className="absolute top-0 left-0 h-[44px] flex items-center gap-1 pl-4 z-30 pointer-events-none">
          {!isSidebarVisible && (
            <button
              onClick={() => setIsSidebarVisible(!isSidebarVisible)}
              className="pointer-events-auto text-gray-400 hover:text-gray-900 hover:bg-gray-100 p-1.5 rounded-md transition-colors"
            >
              <PanelLeft className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </button>
          )}
          <button
            onClick={() => setIsNavbarVisible(!isNavbarVisible)}
            className="pointer-events-auto text-gray-400 hover:text-gray-900 hover:bg-gray-100 p-1.5 rounded-md transition-colors"
          >
            <PanelTop className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </button>
        </div>

        {/* Navbar */}
        <Navbar isNavbarVisible={isNavbarVisible} isScrolled={isScrolled} />

        <main
          className="flex-1  overflow-y-auto p-8 md:p-12 lg:px-16"
          onScroll={(e) => setIsScrolled(e.target.scrollTop > 10)}
        >
          <Outlet />
        </main>

      </div>



    </div>
  )
}

export default WorkspaceLayout