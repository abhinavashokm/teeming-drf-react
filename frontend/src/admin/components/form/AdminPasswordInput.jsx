import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import InputField from "../../../components/ui/form/InputField"
import InputFieldError from "../../../components/ui/form/InputFieldError"
import { cn } from "../../../utils/cn"

function AdminPasswordInput({ icon: Icon, className = '', error, ...props }) {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="w-full">
            {/* icon + input + eye toggle — fixed height, no error inside */}
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                        <Icon className="h-[14px] w-[14px] text-gray-400" />
                    </div>
                )}
                <InputField
                    size="lg"
                    focusRing={false}
                    type={showPassword ? "text" : "password"}
                    className={cn(
                        'h-[44px] pr-10',
                        'focus:border-[#1A1A2E] focus:ring-2 focus:ring-[#1A1A2E]/20',
                        Icon && 'pl-10',
                        className
                    )}
                    {...props}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 p-2 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
            </div>

            {/* error lives outside the relative wrapper */}
            {error && <InputFieldError errorMessage={error.message} />}
        </div>
    )
}

export default AdminPasswordInput