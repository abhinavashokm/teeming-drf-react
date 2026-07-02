import BaseModal from "../ui/modal/BaseModal"
import AppButton from '../ui/buttons/AppButton'
import { AlertTriangle, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function UpgradePlanModal({
    isOpen,
    onClose,
    currentPlan,
    currentUsage,
    currentLimit,
    limitName = "goal"
}) {

    const navigate = useNavigate()

    const handleUpgrade = () => {
        onClose()
        navigate('upgrade-plan')
    }

    limitName = limitName.toLowerCase()

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            size="sm"
        >
            <BaseModal.Header onClose={onClose}>
                <div>
                    <h2 className="text-base font-semibold text-gray-900">
                        Max {limitName} Limit Reached
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Upgrade your plan to create more {limitName}s.
                    </p>
                </div>
            </BaseModal.Header>

            <BaseModal.Body>

                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 mb-5">
                    <div className="flex items-start gap-3">
                        <AlertTriangle
                            className="h-5 w-5 text-amber-600 shrink-0 mt-0.5"
                        />

                        <div>
                            <p className="text-sm font-medium text-amber-900">
                                You've reached your {limitName} limit
                            </p>

                            <p className="text-sm text-amber-800 mt-1">
                                Your <strong>{currentPlan}</strong> plan allows up to{' '}
                                <strong>{currentLimit}</strong> {limitName}.
                                You currently have{' '}
                                <strong>{currentUsage}</strong> {limitName}.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-gray-200 p-4">
                    <p className="text-sm font-medium text-gray-900 mb-2">
                        Upgrade benefits
                    </p>

                    <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Create up to 100 goals</li>
                        <li>• AI Enhancements</li>
                        <li>• AI Assistant</li>
                        <li>• Export Workspace Data</li>
                    </ul>
                </div>

            </BaseModal.Body>

            <BaseModal.Footer>
                <AppButton
                    variant="secondary"
                    onClick={onClose}
                >
                    Not Now
                </AppButton>

                <AppButton
                    onClick={handleUpgrade}
                >
                    Upgrade Plan
                    <ArrowRight className="h-4 w-4" />
                </AppButton>
            </BaseModal.Footer>

        </BaseModal>
    )
}

export default UpgradePlanModal