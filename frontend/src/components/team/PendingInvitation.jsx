import { Clock, Mail } from "lucide-react"
import { formatTimeAgo } from "../../utils/timeUtils"
import useCancelnvitation from "../../hooks/invite/useCancelnvitation"

function PendingInvitation({ invitation }) {
    const { mutate: cancelInvitation, isPending } = useCancelnvitation()
    const invitedTime = formatTimeAgo(invitation.createdAt)

    const handleCancelInvitation = () => {
        cancelInvitation(invitation.id)
    }

    return (
        <div className="p-4 flex items-start justify-between gap-3 hover:bg-gray-50 transition-colors group">
            <div className="flex items-start gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="h-3.5 w-3.5 text-gray-500" />
                </div>
                <div className="min-w-0">
                    <p className="text-[13px] font-medium text-gray-700 break-all">
                        {invitation.email}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 mt-1 gap-0.5 text-[12px] text-gray-500">
                        <span>
                            Invited by{" "}
                            <span className="text-gray-700 font-medium">
                                {invitation.invitedBy.fullName}
                            </span>
                        </span>
                        <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 shrink-0" />
                            <span>{invitedTime}</span>
                        </div>
                    </div>
                </div>
            </div>
            <button
                onClick={handleCancelInvitation}
                disabled={isPending}
                className="px-2.5 py-1.5 border border-transparent rounded-lg text-[11px] font-medium text-red-600 hover:bg-red-50 transition-colors shrink-0"
            >
                {isPending ? "Canceling" : "Cancel"}
            </button>
        </div>
    )
}

export default PendingInvitation