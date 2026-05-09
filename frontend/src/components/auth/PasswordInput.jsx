import InputField from "../ui/InputField";
import AuthInput from "./AuthInput";

function PasswordInput({ placeholder }) {
    return (
        <div className="relative w-full">

            <InputField type={"password"} placeholder={placeholder} />

            <button className="absolute right-1 top-1/2 -translate-y-1/2 p-2 flex items-center justify-center text-teeming-light-gray hover:text-gray-600 transition-colors">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
            </button>

        </div>
    )
}

export default PasswordInput