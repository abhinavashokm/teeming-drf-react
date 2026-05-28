import InputFieldError from "./InputFieldError"

function FormField({ label, error, optional, children, className = '' }) {
    return (
        <div className={`space-y-1.5 ${className}`}>
            {label && (
                <label className="text-[13px] font-medium text-gray-700 flex items-center justify-between">
                    {label}
                    {optional && (
                        <span className="text-gray-400 font-normal text-[12px]">Optional</span>
                    )}
                </label>
            )}
            {children}
            {error && <InputFieldError errorMessage={error.message} />}
        </div>
    )
}

export default FormField