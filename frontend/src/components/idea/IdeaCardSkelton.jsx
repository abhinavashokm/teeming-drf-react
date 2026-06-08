import { IDEA_STATUS } from '../../constants/ideaConstants.js';


function IdeaCardSkeleton({ state }) {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm animate-pulse relative overflow-hidden">

            {state === 'in_progress' && (
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gray-200" />
            )}

            {/* Title row */}
            <div className={`flex items-start gap-2.5 ${state === 'in_progress' ? 'mb-4' : 'mb-3'}`}>

                {state === 'draft' && (
                    <div className="w-6 h-6 rounded-full bg-gray-200 shrink-0 mt-0.5" />
                )}

                <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-[85%] mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-[55%]" />
                </div>

                <div className="w-4 h-4 rounded bg-gray-200 shrink-0" />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">

                {state === IDEA_STATUS.DRAFT && (
                    <>
                        <div className="h-3 w-10 bg-gray-200 rounded" />
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-20 bg-gray-200 rounded" />
                            <div className="h-3 w-14 bg-gray-200 rounded" />
                        </div>
                    </>
                )}

                {state === IDEA_STATUS.IN_PROGRESS && (
                    <>
                        <div className="flex -space-x-1.5">
                            <div className="w-6 h-6 rounded-full bg-gray-200" />
                            <div className="w-6 h-6 rounded-full bg-gray-200" />
                        </div>

                        <div className="h-6 w-20 bg-gray-200 rounded-md" />
                    </>
                )}

                {state === IDEA_STATUS.DONE && (
                    <>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-gray-200" />
                            <div className="w-5 h-5 rounded-full bg-gray-200" />
                            <div className="h-3 w-16 bg-gray-200 rounded" />
                        </div>

                        <div className="h-3 w-14 bg-gray-200 rounded" />
                    </>
                )}
            </div>
        </div>
    );
}

export default IdeaCardSkeleton