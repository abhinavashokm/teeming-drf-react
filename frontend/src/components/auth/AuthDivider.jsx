import React from 'react'

function AuthDivider() {
    return (
        <div className="flex flex-row items-center w-full py-[22px]">
            <div className="flex-1 h-px bg-teeming-light-gray opacity-30"></div>

            <div className="px-4">
                <span className="text-teeming-light-gray text-[12px]">
                    or
                </span>
            </div>

            <div className="flex-1 h-px bg-teeming-light-gray opacity-30"></div>
        </div>
    )
}

export default AuthDivider