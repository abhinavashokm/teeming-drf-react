import { useState, useEffect } from 'react';
import { Search, ChevronDown, SlidersHorizontal, Download, MoreHorizontal, X, AlertTriangle, Building2, ExternalLink } from 'lucide-react';
import useAdminUsers from '../hooks/users/useAdminUsers';
import useAdminSuspendUser from '../hooks/users/useAdminSuspendUser';
import { format } from 'date-fns';

const avatarColors = ['bg-blue-500', 'bg-pink-500', 'bg-purple-500', 'bg-amber-500', 'bg-emerald-500']

const getInitials = (name) =>
    name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() ?? '??'

const getAvatarColor = (id) =>
    avatarColors[id?.charCodeAt(0) % avatarColors.length] ?? 'bg-slate-500'

export default function AdminUsers() {
    const [dropdownOpenId, setDropdownOpenId] = useState(null);
    const [viewDetailsUser, setViewDetailsUser] = useState(null);
    const [suspendConfirmUser, setSuspendConfirmUser] = useState(null);
    const [statusFilter, setStatusFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);

    const { data, isPending, isError } = useAdminUsers({
        search: searchQuery,
        status: statusFilter,
        page,
    })

    const { mutate: suspendUser, isPending: isSuspending } = useAdminSuspendUser()
    console.log(data)
    const users = data?.users ?? []
    console.log(users)
    const totalCount = data?.total ?? 0

    const toggleDropdown = (e, id) => {
        e.stopPropagation();
        setDropdownOpenId(dropdownOpenId === id ? null : id);
    };

    const handleSuspendConfirm = () => {
        suspendUser(suspendConfirmUser.id, {
            onSuccess: () => setSuspendConfirmUser(null)
        })
    }

    useEffect(() => {
        const closeDropdown = () => setDropdownOpenId(null);
        document.addEventListener('click', closeDropdown);
        return () => document.removeEventListener('click', closeDropdown);
    }, []);

    return (
        <>
            <div className="max-w-6xl mx-auto space-y-6 pb-12">

                {/* Toolbar */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="relative w-[320px]">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-[14px] w-[14px] text-slate-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchQuery}
                                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                                className="w-full h-[36px] bg-white border border-slate-200 rounded-lg pl-9 pr-4 text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                            />
                        </div>

                        <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                                className="h-[36px] appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 text-[13px] font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                            >
                                <option value="All">All Statuses</option>
                                <option value="Active">Active</option>
                                <option value="Pending">Pending</option>
                                <option value="Suspended">Suspended</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                                <ChevronDown className="h-4 w-4 text-slate-400" />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="w-[36px] h-[36px] flex items-center justify-center bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors shadow-sm">
                            <SlidersHorizontal className="h-[15px] w-[15px]" />
                        </button>
                        <button className="w-[36px] h-[36px] flex items-center justify-center bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors shadow-sm">
                            <Download className="h-[15px] w-[15px]" />
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-6 py-3.5 text-[12px] font-bold text-slate-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3.5 text-[12px] font-bold text-slate-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3.5 text-[12px] font-bold text-slate-500 uppercase tracking-wider">Workspaces</th>
                                    <th className="px-6 py-3.5 text-[12px] font-bold text-slate-500 uppercase tracking-wider">Joined</th>
                                    <th className="px-6 py-3.5 text-[12px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3.5 text-[12px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {isPending ? (
                                    [...Array(5)].map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-32" /></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-40" /></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-16" /></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-24" /></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-16" /></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-8 ml-auto" /></td>
                                        </tr>
                                    ))
                                ) : isError ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-red-500 text-sm">
                                            Failed to load users. Please try again.
                                        </td>
                                    </tr>
                                ) : users.length > 0 ? (
                                    users.map((user, index) => (
                                        <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-full ${getAvatarColor(user.id)} flex items-center justify-center text-[11px] font-bold text-white shrink-0`}>
                                                        {getInitials(user.fullName)}
                                                    </div>
                                                    <span className="text-[14px] font-medium text-slate-900">{user.fullName}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-[14px] text-slate-500">{user.email}</td>
                                            <td className="px-6 py-4 text-[14px] text-slate-900 font-medium">
                                                {user.workspaceCount} Workspace{user.workspaceCount !== 1 ? 's' : ''}
                                            </td>
                                            <td className="px-6 py-4 text-[14px] text-slate-500">
                                                {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${
                                                        user.status === 'active' ? 'bg-emerald-500' :
                                                        user.status === 'pending' ? 'bg-amber-500' :
                                                        'bg-red-500'
                                                    }`} />
                                                    <span className={`text-[14px] font-medium capitalize ${
                                                        user.status === 'suspended' ? 'text-red-600' : 'text-slate-900'
                                                    }`}>
                                                        {user.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right relative">
                                                <button
                                                    onClick={(e) => toggleDropdown(e, user.id)}
                                                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
                                                >
                                                    <MoreHorizontal className="w-[18px] h-[18px]" />
                                                </button>

                                                {dropdownOpenId === user.id && (
                                                    <div className={`absolute right-8 ${index >= users.length - 2 ? 'bottom-10 mb-2' : 'top-10 mt-1'} w-40 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50 overflow-hidden text-left`}>
                                                        <button
                                                            onClick={() => { setViewDetailsUser(user); setDropdownOpenId(null); }}
                                                            className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center text-left"
                                                        >
                                                            View Details
                                                        </button>
                                                        <button
                                                            onClick={() => { setSuspendConfirmUser(user); setDropdownOpenId(null); }}
                                                            disabled={user.status === 'suspended'}
                                                            className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center text-left font-medium disabled:opacity-40 disabled:pointer-events-none"
                                                        >
                                                            Suspend User
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-slate-500 text-sm">
                                            No users found matching your filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
                        <span className="text-[13px] text-slate-500">
                            Showing {users.length} of {totalCount} entries
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-3 py-1.5 border border-slate-200 rounded-md text-[13px] font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                            >
                                Previous
                            </button>
                            <span className="px-3 py-1.5 bg-blue-600 border border-blue-600 rounded-md text-[13px] font-medium text-white">
                                {page}
                            </span>
                            <button
                                onClick={() => setPage(p => p + 1)}
                                disabled={users.length < 10}
                                className="px-3 py-1.5 border border-slate-200 rounded-md text-[13px] font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Suspend Confirmation Modal */}
            {suspendConfirmUser && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-6">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Suspend User Account</h3>
                            <p className="text-sm text-slate-500">
                                Are you sure you want to suspend{' '}
                                <span className="font-bold text-slate-700">{suspendConfirmUser.fullName}</span>?
                                They will immediately lose access to all their workspaces.
                            </p>
                        </div>
                        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3">
                            <button
                                onClick={() => setSuspendConfirmUser(null)}
                                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200/50 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSuspendConfirm}
                                disabled={isSuspending}
                                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors disabled:opacity-70"
                            >
                                {isSuspending ? 'Suspending...' : 'Yes, Suspend User'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Details Modal */}
            {viewDetailsUser && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-slate-100 relative">
                            <button
                                onClick={() => setViewDetailsUser(null)}
                                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-5">
                                <div className={`w-20 h-20 rounded-full ${getAvatarColor(viewDetailsUser.id)} flex items-center justify-center text-2xl font-bold text-white shadow-sm shrink-0`}>
                                    {getInitials(viewDetailsUser.fullName)}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 mb-1">{viewDetailsUser.fullName}</h2>
                                    <div className="text-sm text-slate-500 mb-2">{viewDetailsUser.email}</div>
                                    <div className="flex items-center gap-3">
                                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                                            Joined {format(new Date(viewDetailsUser.createdAt), 'MMM dd, yyyy')}
                                        </span>
                                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider ${
                                            viewDetailsUser.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                                            viewDetailsUser.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                            {viewDetailsUser.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Workspaces</h3>
                                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                                    {viewDetailsUser.workspaceCount} Total
                                </span>
                            </div>
                            {/* workspace list renders here from a separate query when needed */}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}