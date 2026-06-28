import { ChevronDown, ChevronRight, LayoutDashboard, Users, Layers, Settings, LineChart, LogOut, PanelLeft } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import useAuth from '../../../hooks/auth/useAuth';
import useLogout from '../../../hooks/auth/useLogout';
import AuthLogo from '../../../components/auth/AuthLogo'

const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Workspaces', path: '/admin/workspaces', icon: Layers },
    { name: 'Plan Management', path: '/admin/plan-settings', icon: Settings },
    { name: 'Billing', path: '/admin/billing', icon: LineChart },
];

function AdminSidebarItem({ icon: Icon, to, children, expanded }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center ${expanded ? 'gap-3 px-3' : 'justify-center px-0'} py-2.5 rounded-lg transition-colors
                ${isActive ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`
            }
        >
            {({ isActive }) => (
                <>
                    <Icon
                        className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-blue-400' : ''}`}
                        strokeWidth={2.5}
                    />
                    {expanded && <span className="font-medium text-sm">{children}</span>}
                </>
            )}
        </NavLink>
    )
}

function AdminSidebar({ isSidebarVisible, setIsSidebarVisible, isMobileMenuOpen, setIsMobileMenuOpen }) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { data: currentUser } = useAuth()
    const { mutate: logoutUser, isPending: isSigningOut } = useLogout()

    const expanded = isMobileMenuOpen || isSidebarVisible;

    const handleCloseMobile = () => setIsMobileMenuOpen(false)

    const initials = currentUser?.fullName
        ?.split(' ')
        .map(n => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase() ?? 'AU'

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
                bg-[#1A1A2E] text-white flex flex-col shrink-0 h-[100dvh]
                fixed min-[1024px]:relative top-0 left-0 z-50
                transition-all duration-200
                min-[1024px]:translate-x-0
                ${isMobileMenuOpen ? 'translate-x-0 w-64 shadow-2xl min-[1024px]:shadow-none' : '-translate-x-full'}
                ${isSidebarVisible ? 'min-[1024px]:w-64' : 'min-[1024px]:w-[58px]'}
                border-r border-white/10
            `}>

                {/* Logo */}
                <div className={`h-14 flex items-center shrink-0 border-b border-white/10
                    ${expanded ? 'justify-between px-4' : 'justify-center px-0'}
                `}>
                    <div className={`flex items-center gap-3 ${!expanded ? 'mx-auto' : ''}`}>
                        <AuthLogo size='sm' />
                        {expanded && (
                            <div className="flex flex-col">
                                <span className="font-bold text-[18px] leading-tight tracking-tight">Teeming</span>
                                <span className="mt-1 text-[10px] font-medium uppercase tracking-wider text-slate-300 bg-white/10 px-2 py-0.5 rounded w-fit">
                                    Admin Panel
                                </span>
                            </div>
                        )}
                    </div>

                    {expanded && (
                        <button
                            onClick={() =>
                                isMobileMenuOpen
                                    ? setIsMobileMenuOpen(false)
                                    : setIsSidebarVisible(false)
                            }
                            className="text-slate-400 hover:text-white hover:bg-white/10 p-1.5 rounded-md transition-colors"
                            title="Collapse Sidebar"
                        >
                            <PanelLeft className="h-[18px] w-[18px]" strokeWidth={1.5} />
                        </button>
                    )}
                </div>

                {/* Nav */}
                <nav className={`flex-1 overflow-y-auto py-6 space-y-1 ${expanded ? 'px-3' : 'px-2'}`}>
                    {navItems.map(item => (
                        <AdminSidebarItem
                            key={item.path}
                            to={item.path}
                            icon={item.icon}
                            expanded={expanded}
                        >
                            {item.name}
                        </AdminSidebarItem>
                    ))}
                </nav>

                {/* Profile strip */}
                <div className={`shrink-0 border-t border-white/10 relative ${expanded ? 'p-4' : 'p-2 flex flex-col items-center'}`}>

                    {isProfileOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                            <div className="absolute bottom-full left-4 right-4 mb-2 bg-[#252542] border border-white/10 rounded-lg shadow-xl z-50 py-1 overflow-hidden">
                                <button
                                    onClick={() => { logoutUser(); setIsProfileOpen(false); }}
                                    disabled={isSigningOut}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors text-left"
                                >
                                    <LogOut className="w-4 h-4 text-slate-400" />
                                    {isSigningOut ? 'Signing Out...' : 'Sign Out'}
                                </button>
                            </div>
                        </>
                    )}

                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className={`w-full flex items-center p-2 rounded-xl hover:bg-white/5 transition-colors group
                            ${expanded ? 'justify-between -mx-2' : 'justify-center mx-0'}
                            ${isProfileOpen ? 'bg-white/10' : ''}
                        `}
                        title={!expanded ? 'Profile' : ''}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center shrink-0">
                                <span className="text-xs font-bold">{initials}</span>
                            </div>
                            {expanded && (
                                <div className="flex flex-col min-w-0 text-left">
                                    <span className="text-sm font-medium text-white truncate leading-tight">{currentUser?.fullName ?? 'Admin User'}</span>
                                    <span className="text-[11px] text-slate-400 truncate">{currentUser?.email}</span>
                                </div>
                            )}
                        </div>
                        {expanded && (
                            isProfileOpen
                                ? <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                                : <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-white shrink-0" />
                        )}
                    </button>

                    {/* Expand button when collapsed */}
                    {!expanded && (
                        <div className="mt-2 border-t border-white/10 pt-2 flex w-full justify-center">
                            <button
                                onClick={() => setIsSidebarVisible(true)}
                                className="text-slate-400 hover:text-white hover:bg-white/10 p-1.5 rounded-md transition-colors"
                                title="Expand Sidebar"
                            >
                                <PanelLeft className="h-[18px] w-[18px]" strokeWidth={1.5} />
                            </button>
                        </div>
                    )}
                </div>
            </aside>
        </>
    )
}

export default AdminSidebar