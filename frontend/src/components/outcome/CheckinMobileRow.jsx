import { MoreHorizontal } from "lucide-react"
import MemberAvatar from "../team/MemberAvatar"
import { dateToHuman } from "../../utils/timeUtils"
import { useState } from "react";
import CheckinActions from "./CheckinActions";


function CheckinMobileRow({ checkin }) {

    const { createdBy } = checkin
    const [isActionsOpen, setIsActionsOpen] = useState(false);

    return (
        <div className="p-5 space-y-4 hover:bg-gray-50/50 transition-colors">
            <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-gray-900">
                    {dateToHuman(checkin.createdAt)}
                </span>

                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full text-[12px] font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                        Partial Progress
                    </span>
                    <CheckinActions
                        onEdit={() => handleEditCheckin(checkin)}
                        onDelete={() => handleDeleteCheckin(checkin.id)}
                        checkin={checkin}
                    />
                </div>
            </div>

            <div className="flex items-center justify-between text-[13px]">
                <span className="text-gray-500 font-medium">Checkout:</span>
                <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">57%</span>
                    <span className="text-green-600 text-[11px] font-bold bg-green-50 px-1.5 py-0.5 rounded">↑15%</span>
                </div>
            </div>

            <div className="flex items-start gap-2.5 bg-gray-50 p-3 rounded-xl border border-gray-100">
                {/* <div className="bg-green-100 text-green-700 p-1 rounded shrink-0 mt-0.5">
                                                <ThumbsUp className="w-3 h-3" />
                                            </div> */}
                <p className="text-[13px] text-gray-700 leading-relaxed">
                    {checkin.notes}
                </p>
            </div>

            <div className="flex items-center gap-2 pt-1">
                <MemberAvatar name={createdBy.fullName} email={createdBy.email} />
                <span className="text-[12px] font-medium text-gray-500">{createdBy.fullName}</span>
            </div>
        </div>
    )
}

export default CheckinMobileRow