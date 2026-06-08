import { MoreHorizontal } from "lucide-react"
import MemberAvatar from "../team/MemberAvatar"
import { dateToHuman } from "../../utils/timeUtils"
import { CHECKIN_STATUS_LABELS } from "../../constants/outcomeConstants"
import { useState } from "react";
import CheckinActions from "./CheckinActions";


function CheckinDesktopRow({ checkin }) {

    const { createdBy } = checkin
    const [isActionsOpen, setIsActionsOpen] = useState(false);

    return (
        < tr key={checkin.id} className="hover:bg-gray-50/50 transition-colors">
            <td className="px-6 py-4 align-top">
                <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                        <MemberAvatar name={createdBy.fullName} email={createdBy.email} size={'sm'} />
                        <span className="text-[13px] font-medium text-gray-900">{createdBy.fullName}</span>
                    </div>
                    <span className="text-[12px] text-gray-500 ml-8">{dateToHuman(checkin.createdAt)}</span>
                </div>
            </td>
            <td className="px-6 py-4 align-top">
                <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-[12px] font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    {CHECKIN_STATUS_LABELS[checkin.status]}
                </span>
            </td>
            <td className="px-6 py-4 align-top">
                <div className="flex flex-col gap-1 text-[13px]">

                    {
                        checkin?.metricValues?.map(metric => {
                            return (
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">{metric.name}:</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-900">{metric.value}</span>
                                        <span className="text-green-600 text-[11px] font-bold">↑15%</span>
                                    </div>
                                </div>
                            )
                        })
                    }


                </div>
            </td>
            <td className="px-6 py-4 align-top">
                <div className="flex items-start gap-2">
                    {/* <div className="bg-green-100 text-green-700 p-1 rounded shrink-0 mt-0.5">
                                                            <ThumbsUp className="w-3 h-3" />
                                                        </div> */}
                    <p className="text-[13px] text-gray-700 leading-relaxed">
                        {checkin.notes}
                    </p>
                </div>
            </td>
            <td className="px-6 py-4 align-top">
                <CheckinActions
                    onEdit={() => handleEditCheckin(checkin)}
                    onDelete={() => handleDeleteCheckin(checkin.id)}
                    checkin={checkin}
                />
            </td>
        </tr>
    )
}

export default CheckinDesktopRow