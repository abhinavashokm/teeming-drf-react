import InputField from "../ui/InputField";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import InputFieldError from "../ui/InputFieldError";


function PasswordInput({ error, ...props }) {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="w-full">
            
            <div className="relative">
                <InputField type={showPassword ? "text" : "password"} {...props} />

                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 p-2 flex items-center justify-center text-teeming-light-gray hover:text-gray-600 transition-colors">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>

            {
                error &&
                <InputFieldError errorMessage={error.message} />
            }

        </div>
    )
}

export default PasswordInput
