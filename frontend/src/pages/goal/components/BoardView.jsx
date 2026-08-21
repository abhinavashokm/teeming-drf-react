
import { useRef, useEffect } from 'react';
import { useDrag } from '@use-gesture/react';
import KanbanColumn from '../../../components/idea/KanbanColumn';
import { IDEA_STATUS } from '../../../constants/ideaConstants.js';

import { useSelector, useDispatch } from 'react-redux';
import { tourDriver, driveWhenReady } from '../../../utils/tourDriver';
import { TOUR_STEPS } from '../../../store/slices/tourSlice';
import useIdeas from '../../../hooks/idea/useIdeas';



function BoardView({ isDiscussionPanelOpen }) {

    //for mouse click and drag to horizontal scroll for boards
    const scrollRef = useRef(null);

    const bind = useDrag(({ delta: [dx] }) => {
        scrollRef.current.scrollLeft -= dx;
    }, { pointer: { mouse: true } });

    /* -------------------------------------------------------------------------- */
    /* new user walkthrough guide */
    /* -------------------------------------------------------------------------- */
    const { active, stepIndex } = useSelector((state) => state.tour);

    useEffect(() => {
        if (!active) return;

        if (stepIndex === TOUR_STEPS.ADD_IDEA) {
            tourDriver.setSteps([
                {
                    element: '[data-tour="add-idea-btn"]',
                    popover: {
                        title: 'Add your first idea',
                        description: 'This is where your team proposes things to try.',
                        showButtons: ['close'],
                    },
                },
            ]);
            tourDriver.drive();
        }

        if (stepIndex === TOUR_STEPS.LIKE_IDEA) {
            driveWhenReady('[data-tour="like-idea-btn"]', {
                title: 'Like the idea',
                description: 'Give it a thumbs up to show support.',
                showButtons: ['close'],
            });
        }

        if (stepIndex === TOUR_STEPS.MOVE_TO_PLANNED) {
            driveWhenReady('[data-tour="target-idea-card"]', {
                title: 'Move it forward',
                description: 'Click your idea to open it and move it to Planned.',
                showButtons: ['close'],
            });
        }

    }, [active, stepIndex]);


    const { data: ideas = [] } = useIdeas()

    const draftCount = ideas.filter(i => i.status === IDEA_STATUS.DRAFT).length
    const plannedCount = ideas.filter(i => i.status === IDEA_STATUS.PLANNED).length
    const progressCount = ideas.filter(i => i.status === IDEA_STATUS.IN_PROGRESS).length
    const doneCount = ideas.filter(i => i.status === IDEA_STATUS.DONE).length

    return (
        <div className="relative flex flex-col h-[calc(100dvh-120px)]">
            <div className="md:hidden flex gap-1.5 mb-4 shrink-0 pl-8 overflow-x-auto scrollbar-none">
                <button
                    onClick={() => scrollToColumn(IDEA_STATUS.DRAFT)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[11px] font-semibold border border-amber-200 whitespace-nowrap"
                >
                    Idea <span className="font-bold">{draftCount}</span>
                </button>

                <button
                    onClick={() => scrollToColumn(IDEA_STATUS.PLANNED)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-[#378ADD] text-[11px] font-semibold border border-[#378ADD]/30 whitespace-nowrap"
                >
                    Plan <span className="font-bold">{plannedCount}</span>
                </button>

                <button
                    onClick={() => scrollToColumn(IDEA_STATUS.IN_PROGRESS)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-[#378ADD] text-[11px] font-semibold border border-[#378ADD]/30 whitespace-nowrap"
                >
                    Progress <span className="font-bold">{progressCount}</span>
                </button>

                <button
                    onClick={() => scrollToColumn(IDEA_STATUS.DONE)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-[11px] font-semibold border border-green-200 whitespace-nowrap"
                >
                    Done <span className="font-bold">{doneCount}</span>
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