import { format } from 'date-fns';
import { ChevronDown, Download, MoreHorizontal, Search, SlidersHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';
import MemberAvatar from '../../components/team/MemberAvatar';
import DangerConfirmationModal from "../../components/ui/modal/DangerConfirmationModal";
import AdminUserDetails from '../components/adminUsers/AdminUserDetails';
import DataTable from '../components/table/DataTable';
import useAdminSuspendUser from '../hooks/users/useAdminSuspendUser';
import useAdminUsers from '../hooks/users/useAdminUsers';


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

    const users = data?.users ?? []
    const pagination = data?.pagination ?? {}
    const {
        count: totalCount = 0,
        totalPages = 0,
        currentPage = page,
        hasNext = false,
        hasPrevious = false,
    } = pagination

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

    const [isConfirmSuspendOpen, setIsConfirmSuspendOpen] = useState(false)

    const columns = [
        {
            key: 'user',
            header: 'User',
            render: (user) => (
                <div className="flex items-center gap-3">
                    <MemberAvatar user={user} />
                    <span className="text-[14px] font-medium text-slate-900">{user.fullName}</span>
                </div>
            ),
        },
        {
            key: 'email',
            header: 'Email',
            render: (user) => <span className="text-[14px] text-slate-500">{user.email}</span>,
        },
        {
            key: 'workspaces',
            header: 'Workspaces',
            render: (user) => (
                <span className="text-[14px] text-slate-900 font-medium">
                    {user.workspaceCount} Workspace{user.workspaceCount !== 1 ? 's' : ''}
                </span>
            ),
        },
        {
            key: 'joined',
            header: 'Joined',
            render: (user) => (
                <span className="text-[14px] text-slate-500">
                    {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                </span>
            ),
        },
{
    key: 'role',
    header: 'Role',
    render: (user) => (
        <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${user.isStaff ? 'bg-violet-500' : 'bg-slate-300'}`} />
            <span className={`text-[14px] font-medium ${user.isStaff ? 'text-violet-700' : 'text-slate-900'}`}>
                {user.isStaff ? 'Staff' : 'User'}
            </span>
        </div>
    ),
},
        {
            key: 'actions',
            header: 'Actions',
            align: 'right',
            render: (user, index) => (
                <>
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
                            {/* <button
                                onClick={() => { setSuspendConfirmUser(user); setIsConfirmSuspendOpen(true); setDropdownOpenId(null); }}
                                disabled={user.status === 'suspended'}
                                className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center text-left font-medium disabled:opacity-40 disabled:pointer-events-none"
                            >
                                Suspend User
                            </button> */}
                        </div>
                    )}
                </>
            ),
        },
    ];

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

                        {/* <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                                className="h-[36px] appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 text-[13px] font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                            >
                                <option value="All">All Statuses</option>
                                <option value="Active">Active</option>
                                <option value="Suspended">Suspended</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                                <ChevronDown className="h-4 w-4 text-slate-400" />
                            </div>
                        </div> */}
                    </div>

                    {/* <div className="flex items-center gap-2">
                        <button className="w-[36px] h-[36px] flex items-center justify-center bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors shadow-sm">
                            <SlidersHorizontal className="h-[15px] w-[15px]" />
                        </button>
                        <button className="w-[36px] h-[36px] flex items-center justify-center bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors shadow-sm">
                            <Download className="h-[15px] w-[15px]" />
                        </button>
                    </div> */}
                </div>

                <DataTable
                    columns={columns}
                    data={users}
                    isPending={isPending}
                    isError={isError}
                    emptyMessage="No users found matching your filters."
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalCount={totalCount}
                    hasNext={hasNext}
                    hasPrevious={hasPrevious}
                    onPageChange={setPage}
                />
            </div>

            {/* View Details Modal */}
            {viewDetailsUser && (
                <AdminUserDetails userDetails={viewDetailsUser} onClose={() => setViewDetailsUser(null)} />
            )}

            <DangerConfirmationModal
                isOpen={isConfirmSuspendOpen}
                onClose={() => setIsConfirmSuspendOpen(false)}
                onConfirm={handleSuspendConfirm}
                title="Suspend User"
                description="The user will immediately lose access to all workspaces."
                confirmButtonText="Yes, Suspend"
                isLoading={isSuspending}
            />

        </>
    );
}