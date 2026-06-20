import { Sparkles } from "lucide-react";
import { formatDateTime } from "../../utils/timeUtils";

import React from 'react'

function AIResponseBubble({ response, actionMap }) {

    const isCustomChat = response.type !== 'custom_chat' 

    return (
        <div className="rounded-lg border border-slate-200 bg-white">

            {/* <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#378ADD]" />

                    <span className="text-xs font-medium text-slate-700">
                        {actionMap[response.type]?.responseTitle}
                    </span>
                </div>

                <span className="text-[11px] text-slate-400">
                    {formatDateTime(response.createdAt)}
                </span>
            </div> */}

            <div className="p-4 space-y-4">
                {response.content.sections.map((section, index) => (
                    <div key={index}>
                        {isCustomChat &&
                            <h4 className="text-xs font-medium text-slate-500 mb-2">
                                {section.title}
                            </h4>
                        }

                        {section.type === 'text' && (
                            <p className="text-sm text-slate-700 leading-relaxed">
                                {section.body}
                            </p>
                        )}

                        {section.type === 'list' && (
                            <ul className="space-y-1.5">
                                {section.body.map((item, itemIndex) => (
                                    <li
                                        key={itemIndex}
                                        className="flex gap-2 text-sm text-slate-700"
                                    >
                                        <span className="text-slate-400 mt-[2px]">
                                            •
                                        </span>

                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>

        </div>
    )
}

export default AIResponseBubble