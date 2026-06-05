import { cn } from "../../../utils/cn"


export default function TextareaField({ focusRing = true, shadow = false, className = '', ...props }) {
    return (
        <textarea
            {...props}
            className={cn(
                'w-full border transition-all focus:outline-none resize-y',
                'text-teeming-text-dark placeholder-teeming-light-gray',
                'py-3.5 px-3.5 pb-8 text-[13px] rounded-xl min-h-[100px]',
                shadow && 'shadow-sm',
                focusRing
                    ? 'bg-white border-gray-200 hover:border-gray-300 focus:border-teeming-green focus:ring-1 focus:ring-teeming-green/20'
                    : 'bg-white border-gray-200 hover:border-gray-300',
                className
            )}
        />
    )
}