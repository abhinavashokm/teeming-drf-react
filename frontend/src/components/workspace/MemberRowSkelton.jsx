import React from 'react'

function MemberRowSkelton() {
    return (
        <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse" />
            <div className="flex flex-col gap-1.5">
                <div className="w-32 h-3 rounded bg-gray-200 animate-pulse" />
                <div className="w-24 h-2.5 rounded bg-gray-200 animate-pulse" />
            </div>
            <div className="ml-auto w-16 h-6 rounded bg-gray-200 animate-pulse" />
        </div>
    )
}

export default MemberRowSkelton