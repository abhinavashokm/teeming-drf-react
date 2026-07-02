import { ThumbsUp } from "lucide-react"
import useLikeIdea from "../../hooks/idea/useLikeIdea"
import useUnlikeIdea from "../../hooks/idea/useUnlikeIdea"

const thumbsUpSizes = {
    's': 'w-3.5 h-3.5',
    'm': 'w-4 h-4',
}

function IdeaLikeButton({ ideaId=null, likeCount = 0, isLiked = false, size = 's', readOnly = false }) {


    const { mutate: likeIdea, isPending: isLiking } = useLikeIdea()
    const { mutate: unlikeIdea, isPending: isUnliking } = useUnlikeIdea()

    const handleToggleLike = () => {
        if (isLiking || isUnliking) return // guard against double-fire
        if (isLiked) {
            unlikeIdea(ideaId)
        } else {
            likeIdea(ideaId)
        }
    }

    return (
        <button
            onClick={(e) => { e.stopPropagation(); handleToggleLike(); }}
            disabled={isLiking || isUnliking || readOnly}
            className={`flex items-center gap-1.5 text-[12px] font-medium transition-colors 
                ${isLiked ? 'text-blue-600' : `text-gray-400 ${readOnly ? 'text-gray-500' : 'hover:text-gray-600'}`}`
            }
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