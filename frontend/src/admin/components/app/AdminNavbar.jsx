import { Menu } from 'lucide-react'
import useAuth from '../../../hooks/auth/useAuth'

function AdminNavbar({ title = "Dashboard", setIsMobileMenuOpen }) {
    const { data: currentUser } = useAuth()

    const initials = currentUser?.fullName
        ?.split(' ')
        .map(n => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase() ?? 'SA'

    return (
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.05)] z-10">

            <div className="flex items-center gap-4">
                {/* Mobile hamburger */}
                <button
                    className="min-[1024px]:hidden text-slate-500 hover:text-slate-900 p-1.5 rounded-md hover:bg-slate-100 transition-colors"
                    onClick={() => setIsMobileMenuOpen(true)}
                >
                    <Menu className="h-5 w-5" strokeWidth={2} />
                </button>

                <h1 className="text-[20px] font-bold text-slate-900">{title}</h1>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex flex-col items-end">
                        <span className="text-sm font-bold text-slate-900 leading-none mb-1">
                            {currentUser?.fullName ?? 'Super Admin'}
                        </span>
                        <span className="text-[11px] font-medium text-slate-500 leading-none">System Access</span>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                        {initials}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default AdminNavbar