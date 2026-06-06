import { ArrowRight, Check, Users, X } from 'lucide-react';
import { useReducer } from 'react';
import { Command } from 'cmdk';
import useWorkspace from '../../hooks/workspace/useWorkspace';
import useInviteMembers from '../../hooks/invite/useInviteMembers';
import AppButton from '../ui/buttons/AppButton';
import CancelButton from '../ui/buttons/CancelButton';
import BaseModal from '../ui/modal/BaseModal';

const initialState = {
    inputValue: '',
    selectedEmails: [],
    role: 'member',
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_INPUT':
            return { ...state, inputValue: action.payload }
        case 'SELECT_EMAIL':
            if (state.selectedEmails.includes(action.payload)) return state
            return { ...state, selectedEmails: [...state.selectedEmails, action.payload], inputValue: '' }
        case 'REMOVE_EMAIL':
            return { ...state, selectedEmails: state.selectedEmails.filter(email => email !== action.payload) }
        case 'SET_ROLE':
            return { ...state, role: action.payload }
        case 'RESET':
            return initialState
        default:
            return state
    }
}

export default function InviteModal({ isOpen, onClose }) {

    const { data: currentWorkspace } = useWorkspace()
    const { mutate: inviteMembers, isPending: isInvitePending } = useInviteMembers()

    const [state, dispatch] = useReducer(reducer, initialState)

    const handleClose = () => {
        dispatch({ type: 'RESET' })
        onClose()
    }

    const handleInviteMember = () => {
        inviteMembers({ emails: state.selectedEmails, role: state.role }, {
            onSuccess: () => handleClose()
        })
    }

    const trimmedInput = state?.inputValue.trim().toLowerCase()
    const isAlreadySelected = state.selectedEmails.includes(trimmedInput)

    return (
        <BaseModal isOpen={isOpen} onClose={handleClose} size="md">

            <BaseModal.Header onClose={handleClose}>
                <div className="flex items-center gap-1.5 bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1.5 rounded-lg">
                    <Users className="w-3.5 h-3.5" strokeWidth={2.5} />
                    <span className="tracking-wide mt-[1px]">Invite team</span>
                </div>
            </BaseModal.Header>

            <BaseModal.Body>
                <h2 className="text-[18px] font-medium text-gray-900 mb-1">Invite your team</h2>
                <p className="text-sm text-gray-500 mb-6">Add teammates to collaborate on goals together</p>

                {/* Workspace row */}
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 mb-6">
                    <div className="w-9 h-9 rounded-[10px] bg-emerald-600 text-white font-medium text-sm flex items-center justify-center shrink-0">
                        {currentWorkspace.name[0]}
                    </div>
                    <span className="text-[14px] font-medium text-gray-900">{currentWorkspace.name}</span>
                </div>

                {/* Label */}
                <div className="mb-3">
                    <label className="text-[12px] font-bold text-gray-700 uppercase tracking-wider mb-1 block">
                        Invite by email
                    </label>
                    <p className="text-[13px] text-gray-500">Type an email address and select it to add</p>
                </div>

                {/* Selected chips */}
                {state.selectedEmails.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                        {state.selectedEmails.map(email => (
                            <div key={email} className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-md py-1 px-1.5">
                                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[9px] font-bold shrink-0">
                                    {email.slice(0, 2).toUpperCase()}
                                </div>
                                <span className="text-[12px] font-medium text-gray-700 truncate max-w-[160px]">{email}</span>
                                <button onClick={() => dispatch({ type: 'REMOVE_EMAIL', payload: email })}>
                                    <X className="w-3 h-3 text-gray-400 hover:text-red-500" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Combobox */}
                <Command className="border border-gray-200 rounded-xl overflow-hidden shadow-sm" shouldFilter={false}>
                    <Command.Input
                        value={state.inputValue}
                        onValueChange={(val) => dispatch({ type: 'SET_INPUT', payload: val })}
                        placeholder="Type an email address..."
                        className="w-full px-3.5 py-2.5 text-[13px] outline-none border-b border-gray-100"
                    />
                    <Command.List className="max-h-[108px] sm:max-h-[180px] overflow-y-auto">
                        {trimmedInput.length === 0 ? (
                            <div className="py-5 text-center text-[13px] text-gray-400">
                                Start typing an email to add
                            </div>
                        ) : (
                            <Command.Item
                                value={trimmedInput}
                                onSelect={() => dispatch({ type: 'SELECT_EMAIL', payload: trimmedInput })}
                                disabled={isAlreadySelected}
                                className={`flex items-center justify-between px-3 py-2.5 cursor-pointer transition-colors ${isAlreadySelected ? 'bg-blue-50 cursor-default' : 'hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                                        {trimmedInput[0]?.toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="text-[13px] font-medium text-gray-900">{trimmedInput}</div>
                                        <div className="text-[11px] text-gray-400">
                                            {isAlreadySelected ? 'Already added' : 'Click to add'}
                                        </div>
                                    </div>
                                </div>
                                <div className={`w-3 h-3 rounded-full border-1 flex items-center justify-center shrink-0 transition-all ${isAlreadySelected
                                    ? 'bg-[#378ADD] border-[#378ADD]'
                                    : 'border-gray-300 bg-white'
                                    }`}>
                                    {isAlreadySelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                                </div>
                            </Command.Item>
                        )}
                    </Command.List>
                </Command>

            </BaseModal.Body>

            <BaseModal.Footer className="flex-row justify-between gap-4 py-4 px-5">
                {/* Role */}
                <div className="flex items-center gap-2">
                    <span className="hidden sm:flex text-[13px] text-gray-500 font-medium">Role</span>
                    <select
                        value={state.role}
                        onChange={e => dispatch({ type: 'SET_ROLE', payload: e.target.value })}
                        className="text-[13px] border border-gray-200 rounded-lg bg-white text-gray-800 px-2.5 py-1.5 cursor-pointer outline-none hover:bg-gray-50 transition-colors shadow-sm font-medium focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                    >
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                    <CancelButton onClick={handleClose} className="hidden sm:flex" />
                    <AppButton
                        onClick={handleInviteMember}
                        loading={isInvitePending}
                        disabled={isInvitePending || state.selectedEmails.length === 0}
                    >
                        Send invites <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </AppButton>
                </div>
            </BaseModal.Footer>

        </BaseModal>
    )
}