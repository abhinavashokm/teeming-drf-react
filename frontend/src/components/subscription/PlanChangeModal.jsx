import { Check, Minus } from 'lucide-react';
import BaseModal from "../ui/modal/BaseModal"


function formatLimit(value) {
    return value === null || value === undefined ? 'Unlimited' : value;
}

function PlanChangeModal({ open, onClose, comparison }) {
    if (!comparison) return null;

    const renderValue = (row, val) => {
        if (row.kind === 'feature') {
            return val
                ? <Check className="w-4 h-4 text-green-600 mx-auto" />
                : <Minus className="w-4 h-4 text-gray-300 mx-auto" />;
        }
        if (row.kind === 'limit') {
            return formatLimit(val);
        }
        return val;
    };

    return (
        <BaseModal
            isOpen={open}
            onClose={onClose}
            size="lg"
            sheetBreakpoint="md"
        >
            <BaseModal.Header onClose={onClose}>
                <div className="min-w-0">
                    <h2 className="text-[15px] font-semibold text-gray-900 truncate">
                        What's changing on {comparison.planName}
                    </h2>
                    {comparison.renewsOn && (
                        <p className="text-[12.5px] text-gray-500 mt-0.5">
                            Your current terms apply until your plan renews on{' '}
                            <span className="text-gray-700 font-medium">{comparison.renewsOn}</span>.
                        </p>
                    )}
                </div>
            </BaseModal.Header>

            <BaseModal.Body>
                <div className="grid grid-cols-3 text-[13px] font-medium text-gray-400 pb-3 border-b border-gray-100">
                    <span>Feature</span>
                    <span className="text-center">
                        Your plan
                        {comparison?.currentVersion && (
                            <span className="text-gray-300"> (v{comparison.currentVersion})</span>
                        )}
                    </span>
                    <span className="text-center">
                        Latest plan
                        {comparison.latestVersion && (
                            <span className="text-gray-300"> (v{comparison.latestVersion})</span>
                        )}
                    </span>
                </div>

                {comparison.rows.map((row, idx) => (
                    <div
                        key={idx}
                        className={`grid grid-cols-3 items-center py-3 text-[14px] ${idx !== comparison.rows.length - 1 ? 'border-b border-gray-50' : ''
                            }`}
                    >
                        <span className="text-gray-700">{row.name}</span>
                        <span className="text-center text-gray-500">
                            {renderValue(row, row.current)}
                        </span>
                        <span
                            className={`text-center font-medium flex items-center justify-center gap-1 ${row.changed ? 'text-gray-900' : 'text-gray-500'
                                }`}
                        >
                            {renderValue(row, row.latest)}
                            {row.changed && (
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                            )}
                        </span>
                    </div>
                ))}
            </BaseModal.Body>

            <BaseModal.Footer className="justify-start">
                <p className="text-[12.5px] text-gray-400">
                    Changes marked with <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 align-middle mx-0.5" /> will automatically apply when your plan renews. No action is needed.
                </p>
            </BaseModal.Footer>
        </BaseModal>
    );
}

export default PlanChangeModal