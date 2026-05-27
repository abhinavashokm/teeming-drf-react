import { Loader2 } from "lucide-react";

export default function AppButton({
    children,
    loading = false,
    disabled = false,
    onClick,
    type = "button",
    className = "",
}) {

    const isDisabled = loading || disabled;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isDisabled}
            className={`
                inline-flex items-center justify-center gap-2

                px-4 py-2
                rounded-[10px]

                text-[13px] font-medium
                text-white

                bg-[#1D9E75]
                border border-[#188764]

                shadow-sm

                transition-all duration-200 ease-out

                hover:bg-[#15825f]
                hover:shadow-md
                hover:-translate-y-[1px]

                active:translate-y-0
                active:scale-[0.99]

                focus:outline-none
                focus:ring-4
                focus:ring-[#1D9E75]/15

                disabled:bg-[#1D9E75]/70
                disabled:border-[#1D9E75]/40
                disabled:text-white/80
                disabled:shadow-none
                disabled:cursor-not-allowed
                disabled:hover:translate-y-0

                ${className}
            `}
        >
            {loading && (
                <Loader2
                    className="w-3.5 h-3.5 animate-spin"
                    strokeWidth={2.5}
                />
            )}

            {children}
        </button>
    );
}