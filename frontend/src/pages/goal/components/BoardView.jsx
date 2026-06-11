
import KanbanColumn from '../../../components/idea/KanbanColumn';
import { IDEA_STATUS } from '../../../constants/ideaConstants.js';


function BoardView({ isRightPanelOpen }) {

    return (
        <div className="flex flex-col h-[calc(100dvh-120px)] -mx-4 px-4 md:mx-0 md:px-0">

            {/* Mobile Tab Switcher */}
            <div className="md:hidden flex gap-2 mb-4 shrink-0">
                <button onClick={() => scrollToColumn(IDEA_STATUS.DRAFT)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-[12px] font-bold border border-amber-200">
                    💡 Idea <span>0</span>
                </button>
                <button onClick={() => scrollToColumn(IDEA_STATUS.IN_PROGRESS)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-[#378ADD] text-[12px] font-bold border border-[#378ADD]/30">
                    ⚡ Progress <span>0</span>
                </button>
                <button onClick={() => scrollToColumn(IDEA_STATUS.DONE)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-[12px] font-bold border border-green-200">
                    ✓ Done <span>0</span>
                </button>
            </div>

            <div className={`flex gap-4 md:gap-6 w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide flex-1 min-h-0 after:content-[''] after:shrink-0 ${isRightPanelOpen ? 'lg:after:w-[340px]' : 'after:w-4'}`}>
                <KanbanColumn state={IDEA_STATUS.DRAFT} />
                <KanbanColumn state={IDEA_STATUS.PLANNED} />
                <KanbanColumn state={IDEA_STATUS.IN_PROGRESS} />
                <KanbanColumn state={IDEA_STATUS.DONE} />
            </div>

        </div>
    )
}

export default BoardView