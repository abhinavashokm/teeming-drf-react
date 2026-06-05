
import { cn } from "../../../utils/cn"


export default function InputField({ size = 'md', readOnly, focusRing = true, shadow = false, className = '', ...props }) {
    const sizes = {
        md: 'py-2 px-3 text-[13px] rounded-lg',
        lg: 'py-[11px] px-4 text-[14px] rounded-xl',
    }
    return (
        <input
            readOnly={readOnly}
            {...props}
            className={cn(
                'w-full border transition-all focus:outline-none',
                'text-teeming-text-dark placeholder-teeming-light-gray',
                sizes[size],
                shadow && 'shadow-sm',
                readOnly
                    ? 'bg-gray-50 border-gray-200 cursor-not-allowed text-gray-400'
                    : `bg-white border-gray-200 hover:border-gray-300 ${focusRing ? 'focus:border-teeming-green focus:ring-1 focus:ring-teeming-green/20' : ''}`,
                className
            )}
        />
    )
}