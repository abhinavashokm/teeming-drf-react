import { ThumbsUp } from "lucide-react"
import useLikeIdea from "../../hooks/idea/useLikeIdea"
import useUnlikeIdea from "../../hooks/idea/useUnlikeIdea"

import { useSelector, useDispatch } from 'react-redux';
import { advanceTour, TOUR_STEPS } from '../../store/slices/tourSlice';

const thumbsUpSizes = {
    's': 'w-3.5 h-3.5',
    'm': 'w-4 h-4',
}

function IdeaLikeButton({ ideaId = null, likeCount = 0, isLiked = false, size = 's', readOnly = false, ...props }) {

    /* -------------------------------------------------------------------------- */
    /* Toggle like + new user walkthrough (how to like an idea) */
    /* -------------------------------------------------------------------------- */
    const { mutate: likeIdea, isPending: isLiking } = useLikeIdea()
    const { mutate: unlikeIdea, isPending: isUnliking } = useUnlikeIdea()

    const { active, stepIndex, currentIdeaId } = useSelector((state) => state.tour);
    const dispatch = useDispatch();

    const handleToggleLike = () => {
        if (isLiking || isUnliking) return // guard against double-fire
        if (isLiked) {
            unlikeIdea(ideaId)
        } else {
            likeIdea(ideaId, {
                onSuccess: () => {
                    if (active && stepIndex === TOUR_STEPS.LIKE_IDEA && ideaId === currentIdeaId) {
                        dispatch(advanceTour());
                    }
                }
            })
        }
    }

    return (
        <button
            onClick={(e) => { e.stopPropagation(); handleToggleLike(); }}
            disabled={isLiking || isUnliking || readOnly}
            className={`flex items-center gap-1.5 text-[12px] font-medium transition-colors 
                ${isLiked ? 'text-blue-600' : `text-gray-400 ${readOnly ? 'text-gray-500' : 'hover:text-gray-600'}`}`
            }
            {...props}
        >
            <ThumbsUp
                className={thumbsUpSizes[size]}
                fill={isLiked ? 'currentColor' : 'none'}
            />
            <span className={`${size === 'm' ? 'text-[13px]' : ''}`} >{likeCount}</span>

        </button>
    )
}

export default IdeaLikeButton