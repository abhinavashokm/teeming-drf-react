import { Check, Users, X, ArrowRight } from 'lucide-react';
import { useEffect, useReducer, useRef } from 'react';
import useWorkspace from '../../hooks/workspace/useWorkspace';
import useInviteMembers from '../../hooks/invite/useInviteMembers'
import AppButton from '../ui/buttons/AppButton';
import CancelButton from '../ui/buttons/CancelButton';
import BaseModal from '../ui/modal/BaseModal';

const initialState = {
    inputValue: '',
    isDropdownOpen: false,
    selectedEmails: [],
    role: 'member',
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_INPUT':
            return { ...state, inputValue: action.payload, isDropdownOpen: action.payload.length > 0 }
        case 'SELECT_EMAIL':
            if (state.selectedEmails.includes(action.payload)) return state
            return { ...state, selectedEmails: [...state.selectedEmails, action.payload], inputValue: '', isDropdownOpen: false }
        case 'REMOVE_EMAIL':
            return { ...state, selectedEmails: state.selectedEmails.filter(email => email !== action.payload) }
        case 'SET_DROPDOWN_OPEN':
            return { ...state, isDropdownOpen: action.payload }
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

    const [state, inviteDispatch] = useReducer(reducer, initialState)
    const dropdownRef = useRef(null)

    const handleClose = () => {
        inviteDispatch({ type: 'RESET' })
        onClose()
    }

    const handleInviteMember = () => {
        inviteMembers({ emails: state.selectedEmails, role: state.role }, {
            onSuccess: () => handleClose()
        })
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                inviteDispatch({ type: 'SET_DROPDOWN_OPEN', payload: false })
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

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

                {/* Email section */}
                <div className="mb-2.5">
                    <label className="text-[13px] font-medium text-gray-900 mb-1 block">Invite by email</label>
                    <p className="text-[13px] text-gray-500">Enter email addresses to send invitations</p>
                </div>

                <div className="relative" ref={dropdownRef}>
                    {/* Chip input box */}
                    <div className="border border-gray-300 rounded-xl p-2.5 flex flex-wrap gap-2 items-center min-h-[48px] cursor-text focus-within:ring-2 focus-within:ring-emerald-600/20 focus-within:border-emerald-600 bg-white transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                        {state.selectedEmails.map((selectedEmail) => (
                            <div key={selectedEmail} className="flex items-center gap-1.5 bg-gray-100 border border-gray-200 rounded-lg px-2.5 py-1 text-[13px] shrink-0 text-gray-800">
                                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 bg-blue-100 text-blue-700">
                                    {selectedEmail.slice(0, 2)}
                                </div>
                                <span className="truncate max-w-[200px] font-medium">{selectedEmail}</span>
                                <button className="hover:bg-gray-200 rounded-full p-0.5 transition-colors shrink-0 ml-0.5">
                                    <X
                                        onClick={() => inviteDispatch({ type: 'REMOVE_EMAIL', payload: selectedEmail })}
                                        className="w-3 h-3 text-gray-400 hover:text-gray-600"
                                        strokeWidth={2.5}
                                    />
                                </button>
                            </div>
                        ))}

                        <div className="w-full">
                            <input
                                type="text"
                                placeholder="Add email..."
                                className="w-full border-none outline-none bg-transparent text-[13px] text-gray-800 py-0.5 placeholder-gray-400"
                                value={state.inputValue}
                                onChange={(e) => inviteDispatch({ type: 'SET_INPUT', payload: e.target.value.trimStart().toLowerCase() })}
                                onFocus={(e) => {
                                    if (e.target.value.length > 0) inviteDispatch({ type: 'SET_DROPDOWN_OPEN', payload: true })
                                }}
                            />
                        </div>
                    </div>

                    {/* Suggestion dropdown */}
                    {state.isDropdownOpen && state.inputValue?.length > 0 && (
                        <div className="absolute top-[calc(100%+6px)] left-0 right-0 bg-white border border-gray-200 rounded-xl z-50 overflow-hidden shadow-md">
                            <div className="px-3 py-2 text-[11px] text-gray-400 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">
                                Suggestions from {currentWorkspace.name}
                            </div>
                            <div className="flex flex-col bg-white max-h-[220px] overflow-y-auto">
                                <div
                                    onClick={() => inviteDispatch({ type: 'SELECT_EMAIL', payload: state.inputValue.trim().toLowerCase() })}
                                    className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-gray-50 min-h-[44px] transition-colors group"
                                >
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 bg-amber-500 text-white">
                                        {state.inputValue?.[0]}
                                    </div>
                                    <div className="flex flex-col overflow-hidden min-w-0">
                                        <span className="text-[12px] text-gray-500 truncate">{state.inputValue}</span>
                                    </div>
                                    <div className={`ml-auto w-3 h-3 rounded-full border-2 flex items-center justify-center shrink-0 transition-all
                                        ${state.selectedEmails.includes(state.inputValue)
                                            ? 'bg-emerald-600 border-emerald-600'
                                            : 'border-gray-300 bg-white group-hover:border-gray-400'
                                        }`}>
                                        {state.selectedEmails.includes(state.inputValue) && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </BaseModal.Body>

            <BaseModal.Footer className="flex-col sm:flex-row sm:justify-between gap-3">
                {/* Role */}
                <div className="flex items-center gap-2">
                    <span className="text-[13px] text-gray-500 font-medium">Role</span>
                    <select
                        value={state.role}
                        onChange={(e) => inviteDispatch({ type: 'SET_ROLE', payload: e.target.value })}
                        className="text-[13px] border border-gray-200 rounded-lg bg-white text-gray-800 px-2.5 py-1.5 cursor-pointer outline-none hover:bg-gray-50 transition-colors shadow-sm font-medium focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                    >
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                    <CancelButton onClick={handleClose} className="flex-none" />
                    <AppButton
                        onClick={handleInviteMember}
                        disabled={isInvitePending || state.selectedEmails.length === 0}
                    >
                        {isInvitePending ? (
                            <>
                                <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                                Sending...
                            </>
                        ) : (
                            <>Send invites <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} /></>
                        )}
                    </AppButton>
                </div>
            </BaseModal.Footer>

        </BaseModal>
    )
}