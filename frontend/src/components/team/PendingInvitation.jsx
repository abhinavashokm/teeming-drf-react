import { Clock, Mail } from "lucide-react"
import { formatDateTime } from "../../utils/timeUtils"

function PendingInvitation({ invitation }) {

    const invitedTime = formatDateTime(invitation.createdAt)

    return (
        <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group">

            <div className="flex items-center gap-3 min-w-0">

                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <Mail className="h-3.5 w-3.5 text-gray-500" />
                </div>

                <div className="min-w-0">

                    <p className="text-[13px] font-medium text-gray-700 truncate">
                        {invitation.email}
                    </p>

                    <div className="flex items-center gap-3 mt-1 text-[12px] text-gray-500">

                        <span className="truncate">
                            Invited by{" "}
                            <span className="text-gray-700 font-medium">
                                {invitation.invitedBy.fullName}
                            </span>
                        </span>

                        <span className="w-1 h-1 rounded-full bg-gray-300 shrink-0"></span>

                        <div className="flex items-center gap-1 shrink-0">
                            <Clock className="h-3 w-3" />
                            <span>{ invitedTime }</span>
                        </div>

                    </div>

                </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">

                <button className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-[11px] font-medium text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
                    Resend
                </button>

                <button className="px-2.5 py-1.5 border border-transparent rounded-lg text-[11px] font-medium text-red-600 hover:bg-red-50 transition-colors">
                    Cancel
                </button>

            </div>

        </div>
    )
}

export default PendingInvitation

