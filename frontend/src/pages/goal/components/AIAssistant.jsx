import { Lock, Sparkles } from 'lucide-react';


const suggestions = [
    'Summarize progress',
    'Find blockers',
    'Suggest next steps',
    'Generate report',
];


function AIAssistant() {

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
                        key={item}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-[#378ADD]/30 hover:bg-[#378ADD]/5 transition-colors"
                    >
                        {item}
                    </button>
                ))}
            </div>
        </>

    )
}

export default AIAssistant