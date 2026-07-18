import { cn } from "../../../utils/cn"

const getToday = () => new Date().toISOString().split('T')[0]

export default function DateField({
    size = 'md',
    readOnly=false,
    focusRing = true,
    shadow = false,
    disablePast = false,
    className = '',
    value,
    min,
    ...props
}) {
    const sizes = {
        md: 'py-2 px-3 text-[13px] rounded-lg',
        lg: 'py-[11px] px-4 text-[14px] rounded-xl',
    }
    return (
        <input
            type="date"
            readOnly={readOnly}
            value={value}
            min={min ?? (disablePast ? getToday() : undefined)}
            {...props}
            className={cn(
                'w-full border transition-all focus:outline-none',
                sizes[size],
                shadow && 'shadow-sm',
                !value ? '' : 'text-teeming-text-dark',
                readOnly
                    ? 'bg-gray-50 border-gray-200 cursor-not-allowed text-gray-400'
                    : `bg-white border-gray-200 hover:border-gray-300 ${focusRing ? 'focus:border-teeming-green focus:ring-1 focus:ring-teeming-green/20' : ''}`,
                className
            )}
        />
    )
}