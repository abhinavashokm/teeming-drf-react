import { Loader2 } from "lucide-react"
import { useSelector } from "react-redux"


function AuthButton({ children, type = 'submit', disabled = false, ...props }) {
    const { loading } = useSelector(store => store.auth)

    return (
        <button
            {...props}
            disabled={loading || disabled}
            className="w-full py-[10px]
                bg-teeming-green hover:bg-emerald-600
                disabled:bg-emerald-500 disabled:cursor-not-allowed
                rounded-lg shadow-sm transition-colors
                flex justify-center items-center gap-2"
        >

            <span className="text-white font-medium text-[14px] leading-5 tracking-wide">
                {children}
            </span>

            {loading && (
                <Loader2 className="h-4 w-4 text-white animate-spin" />
            )}
        </button>
    )
}

export default AuthButton