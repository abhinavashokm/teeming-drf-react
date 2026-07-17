import { ChevronDown } from 'lucide-react'
import { cn } from "../../../utils/cn"

export default function SelectField({
    size = 'md',
    readOnly,
    focusRing = true,
    shadow = false,
    className = '',
    options,
    placeholder,
    children,
    ...props
}) {
    const sizes = {
        md: 'py-2 pl-3 pr-9 text-[13px] rounded-lg',
        lg: 'py-[11px] pl-4 pr-10 text-[14px] rounded-xl',
    }

    return (
        <div className="relative">
            <select
                disabled={readOnly}
                {...props}
                className={cn(
                    'w-full border transition-all focus:outline-none appearance-none',
                    'text-teeming-text-dark',
                    sizes[size],
                    shadow && 'shadow-sm',
                    readOnly
                        ? 'bg-gray-50 border-gray-200 cursor-not-allowed text-gray-400'
                        : `bg-white border-gray-200 hover:border-gray-300 cursor-pointer ${focusRing ? 'focus:border-teeming-green focus:ring-1 focus:ring-teeming-green/20' : ''}`,
                    className
                )}
            >
                {placeholder && (
                    <option value="" disabled={props.required}>
                        {placeholder}
                    </option>
                )}
                {options
                    ? options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.display ?? opt.label}
                        </option>
                    ))
                    : children}
            </select>

            <ChevronDown
                className={cn(
                    'absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none',
                    readOnly ? 'text-gray-300' : 'text-gray-400'
                )}
            />
        </div>
    )
}