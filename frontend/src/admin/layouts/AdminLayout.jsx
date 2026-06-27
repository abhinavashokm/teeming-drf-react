import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import AdminSidebar from '../components/app/AdminSidebar'
import AdminNavbar from '../components/app/AdminNavbar'

const pageTitles = {
    '/admin/dashboard': 'Dashboard',
    '/admin/users': 'Users',
    '/admin/workspaces': 'Workspaces',
    '/admin/plan-settings': 'Plan Management',
    '/admin/billing': 'Billing',
}

function AdminLayout() {
    const [isSidebarVisible, setIsSidebarVisible] = useState(true)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { pathname } = useLocation()

    const title = pageTitles[pathname] ?? 'Admin'

    return (
        <div className="flex h-screen bg-[#F7F6F3] font-sans">
            <AdminSidebar
                isSidebarVisible={isSidebarVisible}
                setIsSidebarVisible={setIsSidebarVisible}
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
            />
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <AdminNavbar
                    title={title}
                    setIsMobileMenuOpen={setIsMobileMenuOpen}
                />
                <div className="flex-1 overflow-auto p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}

export default AdminLayout