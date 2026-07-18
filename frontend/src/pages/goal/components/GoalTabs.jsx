import { KanbanSquare, BarChart2, Info, ActivitySquare, ExternalLink, ArrowUpRight, History } from "lucide-react"
import { Link } from "react-router-dom"
import { useOutletContext } from "react-router-dom"
import { ROUTE_PATHS } from "../../../constants/routePaths"
import useWorkspaceSlug from "../../../hooks/params/useWorkspaceSlug"
import useGoalId from "../../../hooks/params/useGoalId"

function GoalTabs({ activeView, setActiveView }) {
    const { setIsGoalInfoModalOpen } = useOutletContext()
    const slug = useWorkspaceSlug()
    const goalId = useGoalId()

    return (
        <div className="shrink-0 px-8 pt-4 md:px-12 md:pt-6 lg:px-16 border-b border-gray-200 z-10 w-full">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => setActiveView('board')}
                        className={`flex items-center gap-1.5 pb-3 text-[13px] font-medium transition-colors border-b-2 -mb-px ${activeView === 'board' ? 'border-[#378ADD] text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        <KanbanSquare className="w-4 h-4" />
                        Board
                    </button>
                    <button
                        onClick={() => setActiveView('outcomes')}
                        className={`flex items-center gap-1.5 pb-3 text-[13px] font-medium transition-colors border-b-2 -mb-px ${activeView === 'outcomes' ? 'border-[#378ADD] text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        <BarChart2 className="w-4 h-4" />
                        Outcomes
                    </button>
                </div>

                <div className="flex items-center justify-end gap-2 mb-2">
                    {/* <Link
                        to=""
                        className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[12px] font-medium text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors md:border md:border-dashed md:border-gray-200 md:hover:border-gray-300"
                        title="View activity"
                    >
                        <History className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Activities</span>
                        <ArrowUpRight className="w-3 h-3 opacity-70 hidden sm:inline" />
                    </Link> */}

                    <button
                        className="md:hidden flex items-center justify-center w-7 h-7 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsGoalInfoModalOpen(true)}
                        title="View goal details"
                    >
                        <Info className="w-3.5 h-3.5" />
                    </button>
                </div>

            </div>
        </div>
    )
}

export default GoalTabs