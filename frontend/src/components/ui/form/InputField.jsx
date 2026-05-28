function InputField({ size = 'md', readOnly, focusRing = true, className = '', ...props }) {

    const sizes = {
        md: 'py-2 px-3 text-[13px] rounded-lg',      // goal, account pages
        lg: 'py-[11px] px-4 text-[14px] rounded-xl',  // workspace, auth pages
    }

    return (
        <input
            readOnly={readOnly}
            {...props}
            className={`
                w-full border transition-all focus:outline-none
                text-teeming-text-dark placeholder-teeming-light-gray
                ${sizes[size]}
                ${readOnly
                    ? 'bg-gray-50 border-gray-200 cursor-not-allowed text-gray-400'
                    : `bg-white border-gray-200 hover:border-gray-300  ${focusRing ? 'focus:border-teeming-green focus:ring-1 focus:ring-teeming-green/20' : ''}`
                }
                ${className}
            `}
        />
    )
}

export default InputField