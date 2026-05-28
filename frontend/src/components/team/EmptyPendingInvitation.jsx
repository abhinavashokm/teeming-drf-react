import { Mail } from "lucide-react"

function EmptyPendingInvitations() {

    return (
        <div className="divide divide-gray-100 rounded-xl bg-white">

            <div className="flex flex-col items-center justify-center py-6 px-6 text-center">

                <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Mail className="h-5 w-5 text-gray-500" />
                </div>

                <h3 className="text-[13px] font-medium text-gray-900">
                    No pending invitations
                </h3>

                <p className="mt-1 max-w-sm text-[12px] leading-relaxed text-gray-500">
                    Everyone invited to this workspace has either joined or their invitation has expired.
                </p>

            </div>
        </div>
    )
}

export default EmptyPendingInvitations

