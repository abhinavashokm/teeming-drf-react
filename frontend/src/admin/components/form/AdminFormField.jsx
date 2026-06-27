import FormField from "../../../components/ui/form/FormField"

function AdminFormField({ label, error, optional, children, className = '' }) {
    return (
        <FormField
            error={error}
            optional={optional}
            className={className}
        >
            {label && (
                <label className="font-bold text-[13px] leading-[19.5px] text-[#1A1A2E]">
                    {label}
                    {optional && (
                        <span className="text-gray-400 font-normal text-[12px] ml-2">Optional</span>
                    )}
                </label>
            )}
            {children}
        </FormField>
    )
}

export default AdminFormField