import { MoreHorizontal, Pencil, Star, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import useDeleteGoal from '../../hooks/goal/useDeleteGoal';
import { getGoalCardColorClass } from '../../utils/styleUtils';
import GoalFormModal from './GoalFormModal';
import useUnstarGoal from '../../hooks/goal/useUnstarGoal';
import useStarGoal from '../../hooks/goal/useStarGoal';

function GoalCard({ goal }) {

    const { mutate: deleteGoal } = useDeleteGoal()
    const { mutate: starGoal } = useStarGoal()
    const { mutate: unstarGoal } = useUnstarGoal()

    const [menuOpen, setMenuOpen] = useState(false);
    const [isEditGoalModalOpen, setIsEditGoalModalOpen] = useState(false);
    const menuRef = useRef(null);


    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDeleteGoal = () => {
        deleteGoal(goal.id)
    }

    const handleToggleStar = () => {
        if (goal.isStarred) {
            unstarGoal(goal.id)
        } else {
            starGoal(goal.id)
        }
    }


    return (
        <>
            <div className="group border border-gray-200 rounded-[12px] overflow-hidden hover:border-gray-300 transform hover:-translate-y-[2px] transition-all duration-200 cursor-pointer flex flex-col bg-white">
                <div className={`h-28 ${getGoalCardColorClass(goal.id)} p-4 flex flex-col justify-between`}>
                    <div className="flex justify-between items-start">
                        <span className="text-[12px] text-white bg-black/20 px-3 py-1 rounded-[20px] font-medium leading-none">no ideas yet</span>

                        {/* Three dot menu */}
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
                                className="p-1 rounded-md hover:bg-white/20 transition-colors"
                            >
                                <MoreHorizontal className="h-4 w-4 text-white/50 group-hover:text-white transition-colors" strokeWidth={2} />
                            </button>

                            {menuOpen && (
                                <div className="absolute right-0 top-7 w-36 bg-white rounded-[10px] shadow-lg border border-gray-100 z-10 overflow-hidden">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setIsEditGoalModalOpen(true) }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        <Pencil className="w-3.5 h-3.5 text-gray-400" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={handleDeleteGoal}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-red-500 hover:bg-red-50 transition-colors"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        Delete
                                    </button>
                                </div>
                            )}

                        </div>
                    </div>

                    {/* members */}
                    {/* <div className="flex -space-x-1.5 mt-4">
                    <div className="w-6 h-6 rounded-full bg-blue-500 ring-2 ring-[#378ADD] flex items-center justify-center text-[9px] text-white font-medium">JD</div>
                    <div className="w-6 h-6 rounded-full bg-purple-500 ring-2 ring-[#378ADD] flex items-center justify-center text-[9px] text-white font-medium">SM</div>
                </div> */}

                </div>

                <div className="p-4 flex-1 flex flex-col justify-center relative">
                    <h3 className="font-medium text-[14px] text-gray-900 leading-none pr-6">{goal.name}</h3>

                    <button onClick={handleToggleStar} className="absolute bottom-3 right-3 p-1 hover:bg-gray-100 rounded-md transition-colors">
                        <Star className={`h-4 w-4 ${goal.isStarred ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 hover:text-gray-400'}`} />
                    </button>

                </div>

            </div>
            <GoalFormModal goal={goal} isEditMode={true} isOpen={isEditGoalModalOpen} onClose={() => setIsEditGoalModalOpen(false)} />
        </>
    );
}

export default GoalCard;