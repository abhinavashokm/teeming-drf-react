import { KanbanSquare, BarChart2, Info } from "lucide-react"
import { useOutletContext } from "react-router-dom"


function GoalTabs({ activeView, setActiveView }) {

    const { setIsGoalInfoModalOpen } = useOutletContext()

    return (
        <div className="shrink-0 px-8 pt-4 md:px-12 md:pt-6 lg:px-16  border-b border-gray-200 z-10 w-full">
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

                {/* Mobile Info Button */}
                <button
                    className="md:hidden flex items-center gap-1.5 pb-3 text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors -mb-px"
                    onClick={() => setIsGoalInfoModalOpen(true)}
                    title="View goal details"
                >
                    <Info className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}

export default GoalTabs