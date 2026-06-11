import { Sparkles, X } from 'lucide-react';
import { useState } from 'react';

function RightPanel({ onClose, isMobile }) {

    const [comment, setComment] = useState('')

    return (
        <div className="flex flex-col flex-1 min-h-0 bg-white">
            {/* Header — desktop only */}
            {!isMobile && (
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 shrink-0">
                    <h3 className="text-[13px] font-semibold text-gray-900">Discussion</h3>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
                        title="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Scrollable comments */}
            <div className="flex-1 overflow-y-auto min-h-0 p-5 space-y-6">
                <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-[11px] font-medium shrink-0">
                        SM
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[13px] font-semibold text-gray-900">Sarah Miller</span>
                            <span className="text-[11px] text-gray-400">2h ago</span>
                        </div>
                        <div className="bg-gray-50 rounded-2xl rounded-tl-none p-3 border border-gray-100">
                            <p className="text-[13px] text-gray-700 leading-relaxed">
                                I've reviewed the latest session recordings. It seems a lot of users are dropping off when asked to create an account before checkout. Maybe we should introduce a guest checkout option?
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-[11px] font-medium shrink-0">
                        TR
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[13px] font-semibold text-gray-900">Tom Riddle</span>
                            <span className="text-[11px] text-gray-400">Yesterday</span>
                        </div>
                        <div className="bg-gray-50 rounded-2xl rounded-tl-none p-3 border border-gray-100">
                            <p className="text-[13px] text-gray-700 leading-relaxed">
                                Agreed. Guest checkout could be a quick win. I'll mock up some designs for the flow.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-[11px] font-medium shrink-0">
                        SM
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[13px] font-semibold text-gray-900">Sarah Miller</span>
                            <span className="text-[11px] text-gray-400">2h ago</span>
                        </div>
                        <div className="bg-gray-50 rounded-2xl rounded-tl-none p-3 border border-gray-100">
                            <p className="text-[13px] text-gray-700 leading-relaxed">
                                I've reviewed the latest session recordings. It seems a lot of users are dropping off when asked to create an account before checkout. Maybe we should introduce a guest checkout option?
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-[11px] font-medium shrink-0">
                        TR
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[13px] font-semibold text-gray-900">Tom Riddle</span>
                            <span className="text-[11px] text-gray-400">Yesterday</span>
                        </div>
                        <div className="bg-gray-50 rounded-2xl rounded-tl-none p-3 border border-gray-100">
                            <p className="text-[13px] text-gray-700 leading-relaxed">
                                Agreed. Guest checkout could be a quick win. I'll mock up some designs for the flow.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fixed input */}
            <div className="shrink-0 px-4 py-3 bg-white border-t border-gray-100">
                <div className="flex items-center gap-2.5">

                    {/* User avatar */}
                    <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-[11px] font-semibold shrink-0">
                        R
                    </div>

                    {/* Input */}
                    <div className="flex-1 flex items-start bg-gray-100 rounded-2xl px-4 py-2.5 gap-2">
                        <textarea
                            placeholder="Add a comment..."
                            value={comment}
                            onChange={(e) => {
                                setComment(e.target.value)
                                e.target.style.height = 'auto'
                                e.target.style.height = e.target.scrollHeight + 'px'
                            }}
                            rows={1}
                            className="flex-1 bg-transparent text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none resize-none overflow-hidden leading-relaxed"
                        />
                        {comment.trim() && (
                            <button className="text-[#378ADD] text-[13px] font-semibold shrink-0 hover:text-[#2c71b6] transition-colors mt-0.5">
                                Post
                            </button>
                        )}
                    </div>

                    {/* AI toggle */}
                    <button className="p-1.5 text-gray-400 hover:text-[#378ADD] rounded-full hover:bg-[#378ADD]/8 transition-colors shrink-0" title="AI assist">
                        <Sparkles className="w-4 h-4" />
                    </button>
                </div>
            </div>

        </div>
    )
}

export default RightPanel