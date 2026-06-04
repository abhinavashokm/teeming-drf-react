import {
  Menu
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/app/Navbar';
import Sidebar from "../components/app/Sidebar";
import FullPageLoader from '../components/ui/FullPageLoader';
import { errorCodes } from '../constants/errorCodes';
import useWorkspace from '../hooks/workspace/useWorkspace';
import ErrorPage from '../pages/error/ErrorPage';

function WorkspaceLayout() {

  const { data, isPending: isWorkspacePending, isError, error } = useWorkspace()

  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isFullBleed, setIsFullBleed] = useState(false); //for goal dashboard

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 865) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isWorkspacePending) return <FullPageLoader />

  if (error?.response?.status === 404) {
    if (error.response.data?.error?.code === errorCodes.WORKSPACE_NOT_FOUND) {
      return <ErrorPage
        type={errorCodes.WORKSPACE_NOT_FOUND}
      />
    }
    return <ErrorPage
      type={errorCodes.GENERAL}
    />
  }


  return (
    <div className="flex h-screen bg-white font-sans text-gray-900 antialiased selection:bg-teeming-green/20"
    >

      {/* Sidebar */}
      <Sidebar
        isSidebarVisible={isSidebarVisible}
        setIsSidebarVisible={setIsSidebarVisible}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">

        {/* Toggle Navbar & Sidebar Buttons - Pinned to top */}
        <div className="absolute top-0 left-0 h-[44px] flex items-center gap-1 pl-4 z-30 pointer-events-none">
          {!isMobileMenuOpen && (
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="pointer-events-auto min-[865px]:hidden text-gray-400 hover:text-gray-900 hover:bg-gray-100 p-1.5 rounded-md transition-colors"
            >
              <Menu className="h-[20px] w-[20px]" strokeWidth={1.5} />
            </button>
          )}
        </div>

        {/* Navbar */}
        <Navbar setIsMobileMenuOpen={setIsMobileMenuOpen} isScrolled={isScrolled} />

        <main
          className={`flex-1  ${isFullBleed ? "flex flex-col overflow-hidden" : "overflow-y-auto p-8 md:p-12 lg:px-16"}`}
          onScroll={(e) => setIsScrolled(e.target.scrollTop > 10)}
        >
          <Outlet context={{ setIsFullBleed }} />
        </main>

      </div>



    </div>
  )
}

export default WorkspaceLayout