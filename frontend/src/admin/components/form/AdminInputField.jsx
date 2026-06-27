import InputField from "../../../components/ui/form/InputField"
import { cn } from "../../../utils/cn"

function AdminInputField({ icon: Icon, className = '', ...props }) {
    return (
        <div className="relative">
            {Icon && (
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <Icon className="h-[14px] w-[14px] text-gray-400" />
                </div>
            )}
            <InputField
                size="lg"
                focusRing={false}
                className={cn(
                    'h-[44px]',
                    'focus:border-[#1A1A2E] focus:ring-2 focus:ring-[#1A1A2E]/20',
                    Icon && 'pl-10',
                    className
                )}
                {...props}
            />
        </div>
    )
}

export default AdminInputField