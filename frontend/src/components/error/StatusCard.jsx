import React from "react";

export default function StatusCard({
    icon: Icon,
    title,
    description,
    helperText,
    badge,
    action,
}) {
    return (
        <div className="w-full max-w-[440px] bg-white border border-gray-200 rounded-xl shadow-sm p-8">

            {/* Icon */}
            <div className="mb-5 flex justify-center items-center">
                <div className="w-[60px] h-[60px] bg-amber-50 text-amber-600 rounded-2xl border border-amber-100 shadow-sm flex items-center justify-center">
                    {Icon && <Icon className="w-7 h-7" />}
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col text-center">
                <h1 className="text-gray-900 font-bold text-[22px] leading-tight mb-2">
                    {title}
                </h1>

                <p className="text-[15px] text-gray-600">
                    {description}
                </p>

                {helperText && (
                    <p className="text-[14px] text-gray-400 mt-2">
                        {helperText}
                    </p>
                )}

                {badge && (
                    <div className="mt-4 flex justify-center">
                        <div className="inline-flex items-center gap-2 rounded-full border border-amber-100 bg-amber-50 px-3 py-1.5">
                            <div className="w-2 h-2 rounded-full bg-amber-500" />

                            <span className="text-[12px] font-medium text-amber-700">
                                {badge}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Optional Action */}
            {action && (
                <div className="mt-8">
                    {action}
                </div>
            )}

        </div>
    );
}