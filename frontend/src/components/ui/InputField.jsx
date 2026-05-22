function InputField({ readOnly, ...props }) {
    return (
        <input
            readOnly={readOnly}
            {...props}
            className={`w-full py-[10px] px-4 border rounded-lg text-[14px] text-teeming-text-dark placeholder-teeming-light-gray focus:outline-none transition-all
        ${readOnly
                    ? 'bg-gray-50 border-teeming-border cursor-not-allowed text-teeming-light-gray'
                    : 'bg-white border-teeming-border focus:ring-1 focus:ring-teeming-green focus:border-teeming-green'
                }`}
        />
    )
}

export default InputField