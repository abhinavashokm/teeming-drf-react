import { Lock, Sparkles } from 'lucide-react';
import useAIAssistant from '../../../hooks/ai/useAIAssistant';
import { useState } from 'react';


const suggestions = [
    {
        label: 'Summarize progress',
        type: 'summarize'
    }, {
        label: 'Find blockers',
        type: 'find_blockers'
    },
];


function AIAssistant() {

    const [result, setResult] = useState(null);

    const { mutate: askAI, isPending } = useAIAssistant()

    const handleAskAI = (type, message = null) => {
        const reqData = { type: type }

        if (message) {
            reqData.message = message
        }

        askAI(reqData, {
            onSuccess: (res) => {
                console.log(res.data)
                setResult(res.data);
            }
        })
    }

    return (
        <>
            <div className="mb-5">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#378ADD]" />

                    <h3 className="text-sm font-semibold text-gray-900">
                        Goal Assistant
                    </h3>

                </div>

                <p className="text-xs text-gray-500 mt-1">
                    Ask questions, generate summaries, and get recommendations for this goal.
                </p>

                <div className="mt-3 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    <Lock className="w-3.5 h-3.5 text-slate-500" />

                    <span className="text-[11px] text-slate-600">
                        Responses are visible only to you and won't appear in team discussions.
                    </span>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-5">
                {suggestions.map((item) => (
                    <button
                        key={item.type}
                        onClick={() => handleAskAI(item.type)}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-[#378ADD]/30 hover:bg-[#378ADD]/5 transition-colors"
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            {isPending && (
                <div className="rounded-xl border border-slate-200 bg-white p-4 animate-pulse">
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-4 h-4 text-[#378ADD]" />
                        <span className="text-sm font-medium text-gray-700">
                            Generating insights...
                        </span>
                    </div>

                    <div className="space-y-3">
                        <div className="h-3 bg-slate-200 rounded w-3/4" />
                        <div className="h-3 bg-slate-200 rounded w-full" />
                        <div className="h-3 bg-slate-200 rounded w-5/6" />
                    </div>
                </div>
            )}

            {result && !isPending && (
                <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">

                    <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 bg-slate-50">
                        <Sparkles className="w-4 h-4 text-[#378ADD]" />

                        <div>
                            <h4 className="text-sm font-semibold text-gray-900">
                                AI Goal Summary
                            </h4>

                            <p className="text-[11px] text-gray-500">
                                Generated from goal context and ideas
                            </p>
                        </div>
                    </div>

                    <div className="p-4 space-y-5">

                        <section>
                            <h5 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                                Overview
                            </h5>

                            <p className="text-sm text-gray-700 leading-relaxed">
                                {result.overview}
                            </p>
                        </section>

                        <section>
                            <h5 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                                Progress Status
                            </h5>

                            <p className="text-sm text-gray-700 leading-relaxed">
                                {result.progress_status}
                            </p>
                        </section>

                        <section>
                            <h5 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                                Completed Work
                            </h5>

                            <ul className="space-y-2">
                                {result?.completedItems?.map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start gap-2 text-sm text-gray-700"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section>
                            <h5 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                                Active Work
                            </h5>

                            <ul className="space-y-2">
                                {result?.activeItems?.map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start gap-2 text-sm text-gray-700"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#378ADD] mt-2 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </section>

                    </div>
                </div>
            )}
        </>

    )
}

export default AIAssistant