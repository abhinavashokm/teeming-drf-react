import { Globe } from "lucide-react"

function PrefixInput({ prefix, children }) {
    return (
        <div className="
            flex items-center w-full bg-white 
            border border-gray-200 rounded-xl overflow-hidden 
            hover:border-gray-300 
            focus-within:border-teeming-green 
            focus-within:ring-1 
            focus-within:ring-teeming-green/20 
            transition-all
        ">
            <span className="flex items-center gap-1.5 py-[11px] pl-4 pr-0 text-[14px] font-medium text-gray-500 select-none">
                <Globe className="h-3.5 w-3.5" />
                {prefix}
            </span>
            {children}
        </div>
    )
}

export default PrefixInput