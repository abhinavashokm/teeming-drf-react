import { Check, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import AppButton from '../ui/buttons/AppButton';
import CancelButton from '../ui/buttons/CancelButton';
import BaseModal from '../ui/modal/BaseModal';
import useMoveIdeaToDone from '../../hooks/idea/useMoveIdeaToDone';

function MoveToDoneModal({ isOpen, onClose, currentIdea }) {

    const { mutate: moveToDone, isPending } = useMoveIdeaToDone()

    const [completionNote, setCompletionNote] = useState('');

    const handleMoveToDone = () => {
        const res = { ideaId: currentIdea.id, data: {} }

        if(completionNote){
            res.data.note = completionNote
        }

        moveToDone(res)
    }

    const handleClose = () => {
        setCompletionNote('');
        onClose();
    };

    return (
        <BaseModal isOpen={isOpen} onClose={handleClose}>

            <BaseModal.Header onClose={handleClose}>
                <span className="px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-md text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Mark as Done
                </span>
            </BaseModal.Header>

            <BaseModal.Body>
                <h2 className="text-[18px] font-semibold text-gray-900 mb-1">Mark idea as done</h2>
                <p className="text-[13px] text-gray-500 mb-5">Optionally add a note about what you found or learned.</p>

                {/* Idea preview */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-5 flex items-start gap-3">
                    <div className="bg-white border border-gray-200 rounded-lg p-1.5 mt-0.5 shrink-0">
                        <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                        <p className="text-[14px] font-semibold text-gray-900 mb-0.5">{currentIdea?.title}</p>
                        <p className="text-[12px] text-gray-400">In Progress</p>
                    </div>
                </div>

                {/* Completion note */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <label className="text-[12px] font-bold text-gray-700 uppercase tracking-wider">
                            Completion note
                        </label>
                        <span className="text-[12px] text-gray-400">(optional)</span>
                    </div>
                    <textarea
                        rows={4}
                        value={completionNote}
                        onChange={e => setCompletionNote(e.target.value)}
                        maxLength={300}
                        placeholder="What did you find out? Any learnings while working on this idea..."
                        className="w-full bg-white border border-gray-200 rounded-xl p-3.5 text-[13px] outline-none focus:border-[#378ADD] focus:ring-1 focus:ring-[#378ADD] transition-shadow resize-none"
                    />
                    <div className="flex justify-end mt-1">
                        <span className="text-[11px] text-gray-400">{completionNote.length} / 300</span>
                    </div>
                </div>
            </BaseModal.Body>

            <BaseModal.Footer>
                <CancelButton onClick={handleClose} />
                <AppButton onClick={handleMoveToDone} loading={isPending} >
                    Mark as Done <Check className="w-4 h-4" />
                </AppButton>
            </BaseModal.Footer>

        </BaseModal>
    );
}

export default MoveToDoneModal;