
import { useRef } from 'react';
import { useDrag } from '@use-gesture/react';
import KanbanColumn from '../../../components/idea/KanbanColumn';
import { IDEA_STATUS } from '../../../constants/ideaConstants.js';


function BoardView({ isDiscussionPanelOpen }) {

    //for mouse click and drag to horizontal scroll for boards
    const scrollRef = useRef(null);
    
    const bind = useDrag(({ delta: [dx] }) => {
        scrollRef.current.scrollLeft -= dx;
    }, { pointer: { mouse: true } });


    return (
        <div className="relative flex flex-col h-[calc(100dvh-120px)]">
            <div className="md:hidden flex gap-2 mb-4 shrink-0 pl-8 md:pl-12 lg:pl-16">
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

            <div
                ref={scrollRef}
                {...bind()}
                className={`flex gap-4 md:gap-6 h-full overflow-x-auto scrollbar-hide 
                snap-x snap-mandatory md:snap-none 
                pl-4 md:pl-12 lg:pl-16
                scroll-pl-4 md:scroll-pl-12 lg:scroll-pl-16
            `}>
                <KanbanColumn state={IDEA_STATUS.DRAFT} />
                <KanbanColumn state={IDEA_STATUS.PLANNED} />
                <KanbanColumn state={IDEA_STATUS.IN_PROGRESS} />
                <KanbanColumn state={IDEA_STATUS.DONE} />
                <div className="shrink-0 w-8 md:w-12 lg:w-10" />
            </div>
        </div>
    )
}

export default BoardView