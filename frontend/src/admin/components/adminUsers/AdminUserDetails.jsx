import { X } from 'lucide-react';
import useAdminUserDetail from "../../hooks/users/useAdminUserDetails";
import { getAvatarColor } from '../../../utils/styleUtils';
import MemberAvatar from '../../../components/team/MemberAvatar';
import { formatDate } from '../../../utils/timeUtils';


function AdminUserDetails({onClose, userDetails}) {

    return (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-slate-100 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-5">
                        {/* <div className={`w-20 h-20 rounded-full ${getAvatarColor(userDetails.id)} flex items-center justify-center text-2xl font-bold text-white shadow-sm shrink-0`}>
                            {getInitials(userDetails.fullName)}
                        </div> */}
                        <MemberAvatar user={userDetails} size='xl' />
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 mb-1">{userDetails.fullName}</h2>
                            <div className="text-sm text-slate-500 mb-2">{userDetails.email}</div>
                            <div className="flex items-center gap-3">
                                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                                    Joined {formatDate(userDetails.createdAt)}
                                </span>
                                <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider ${userDetails.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                                        userDetails.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                            'bg-red-100 text-red-700'
                                    }`}>
                                    {userDetails.status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Workspaces</h3>
                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                            {userDetails.workspaceCount} Total
                        </span>
                    </div>
                    {/* workspace list renders here from a separate query when needed */}
                </div>
            </div>
        </div>
    )
}

export default AdminUserDetails