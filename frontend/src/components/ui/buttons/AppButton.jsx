
import { Loader2 } from "lucide-react";

function AppButton({
    children,
    type = "button",
    onClick,
    loading = false,
    disabled = false,

    variant = "primary",
    size = "md",

    fullWidth = false,
    className = "",
}) {

    const isDisabled = loading || disabled;

    const baseStyles = `
        inline-flex items-center justify-center gap-2
        rounded-lg
        font-medium
        transition-all duration-200
        focus:outline-none
        disabled:cursor-not-allowed
        disabled:shadow-none
    `;

    const sizeStyles = {
        sm: "px-3 py-1.5 text-[12px]",
        md: "px-4 py-2 text-[13px]",
        lg: "px-5 py-2.5 text-[14px]",
    };

    const variantStyles = {
        primary: `
            bg-[#1D9E75]
            text-white
            border border-[#188764]

            hover:bg-[#15825f]
            hover:-translate-y-[1px]
            hover:shadow-md

            disabled:bg-[#1D9E75]/70
            disabled:border-[#1D9E75]/40
            disabled:text-white/80
        `,

        dark: `
            bg-gray-900
            text-white

            hover:bg-gray-800

            disabled:bg-gray-200
            disabled:text-gray-400
        `,

        secondary: `
            bg-white
            text-gray-700
            border border-gray-200

            hover:bg-gray-50

            disabled:bg-gray-100
            disabled:text-gray-400
        `,

        danger: `
            bg-red-600
            text-white

            hover:bg-red-700

            disabled:bg-red-300
        `,
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isDisabled}
            className={`
                ${baseStyles}
                ${sizeStyles[size]}
                ${variantStyles[variant]}
                ${fullWidth ? "w-full" : ""}
                ${className}
            `}
        >
            {loading && (
                <Loader2
                    className="h-4 w-4 animate-spin"
                    strokeWidth={2.5}
                />
            )}

            {children}
        </button>
    );
}

export default AppButton;

