import React from 'react';
import { LogOut } from 'lucide-react';

export default function LeaveWorkspaceModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
            <div
                className="fixed inset-0 bg-gray-900/40 backdrop-blur-[2px] transition-opacity"
                onClick={onClose}
            />
            <div className="bg-white rounded-[16px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] w-full max-w-[400px] overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                            <LogOut className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                            <h2 className="text-[16px] font-semibold text-gray-900">Leave Workspace</h2>
                            <p className="text-[13px] text-gray-500 mt-0.5">Are you sure you want to leave?</p>
                        </div>
                    </div>
                    <div className="text-[13px] text-gray-600 mb-2">
                        You will lose access to <span className="font-semibold text-gray-900">Acme Corp</span> and all of its goals and data. An administrator will need to invite you again if you wish to rejoin.
                    </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3 rounded-b-[16px]">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-[13px] font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-[10px] transition-colors shadow-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-[13px] font-medium text-white bg-red-600 hover:bg-red-700 rounded-[10px] transition-colors shadow-sm"
                    >
                        Leave Workspace
                    </button>
                </div>
            </div>
        </div>
    );
}
