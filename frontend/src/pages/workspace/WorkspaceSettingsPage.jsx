import React, { useState } from 'react';
import { Camera, Building, Globe, Shield, Trash2, ArrowRight, AlertTriangle, Lock, Unlock } from 'lucide-react';
import useWorkspace from '../../hooks/workspace/useWorkspace';


function WorkspaceSettingsPage() {

    const { data:currentWorkspace } = useWorkspace()

    const [isSlugUnlocked, setIsSlugUnlocked] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteConfirmationText, setDeleteConfirmationText] = useState('');

    return (
        <div className="max-w-5xl mx-auto space-y-14 pb-20">

            {/* Page Header */}
            <div className="flex items-end justify-between border-b border-gray-200 pb-6">
                <div>
                    <h1 className="text-[22px] font-semibold text-gray-900 tracking-tight leading-none mb-1.5">Workspace Settings</h1>
                    <p className="text-[13px] text-gray-500">Manage your workspace preferences, branding, and permissions.</p>
                </div>
            </div>

            {/* General Settings Section */}
            <section className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-400" />
                    <div>
                        <h2 className="text-[15px] font-semibold text-gray-900 tracking-tight leading-none">General Details</h2>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Workspace Logo Upload */}
                    <div className="flex items-center gap-6">
                        <div className="h-16 w-16 rounded-xl bg-gray-900 flex items-center justify-center text-white text-xl font-medium shrink-0 relative group cursor-pointer overflow-hidden shadow-sm">
                            A
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="h-5 w-5 text-white" />
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="px-3.5 py-1.5 bg-white border border-gray-200 rounded-lg text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                                Upload new logo
                            </button>
                            <button className="px-3.5 py-1.5 text-[13px] font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                Remove
                            </button>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-[13px] font-medium text-gray-700">Workspace Name</label>
                            <input type="text" defaultValue={currentWorkspace.name} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-[13px] text-gray-900 focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200 transition-colors" />
                        </div>
                        <div className="space-y-3">
                            <div className="space-y-1.5">
                                <label className="text-[13px] font-medium text-gray-700">Workspace URL</label>
                                <div className={`flex items-center rounded-lg overflow-hidden border transition-colors ${isSlugUnlocked ? 'border-amber-300 focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-300 bg-white' : 'border-gray-200 bg-gray-50'}`}>
                                    <div className={`px-3 py-2 border-r text-[13px] flex items-center gap-1.5 whitespace-nowrap ${isSlugUnlocked ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                                        <Globe className="h-3.5 w-3.5" />
                                        teeming.app/
                                    </div>
                                    <input
                                        type="text"
                                        defaultValue={currentWorkspace.slug}
                                        disabled={!isSlugUnlocked}
                                        className={`flex-1 w-full px-3 py-2 text-[13px] focus:outline-none ${isSlugUnlocked ? 'bg-white text-gray-900' : 'bg-gray-50 text-gray-500 cursor-not-allowed'}`}
                                    />
                                    <button
                                        onClick={() => setIsSlugUnlocked(!isSlugUnlocked)}
                                        className={`px-3 py-2 border-l transition-colors ${isSlugUnlocked ? 'text-amber-600 bg-amber-50 border-amber-200 hover:bg-amber-100' : 'text-gray-400 bg-white border-transparent hover:bg-gray-100 hover:text-gray-600'}`}
                                    >
                                        {isSlugUnlocked ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                                    </button>
                                </div>
                            </div>
                            {isSlugUnlocked && (
                                <div className="bg-amber-50 border border-amber-200/60 rounded-lg p-3">
                                    <div className="flex gap-2.5">
                                        <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="text-[12px] font-semibold text-amber-800">Changing your slug will:</h4>
                                            <ul className="text-[12px] text-amber-700/90 mt-1 list-disc pl-4 space-y-0.5">
                                                <li>Break all existing shared links</li>
                                                <li>Break any API integrations using this URL</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end">
                    <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-[13px] font-medium hover:bg-gray-800 transition-colors shadow-sm">
                        Save Changes
                    </button>
                </div>
            </section>

            {/* Danger Zone */}
            <section className="bg-red-50/50 border border-red-100 rounded-xl overflow-hidden">
                <div className="px-6 py-5 border-b border-red-100">
                    <h2 className="text-[15px] font-semibold text-red-900 tracking-tight leading-none">Danger Zone</h2>
                    <p className="text-[13px] text-red-700/80 mt-1">Irreversible and destructive actions.</p>
                </div>

                <div className="p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="max-w-md">
                        <p className="text-[13px] font-medium text-red-900">Delete Workspace</p>
                        <p className="text-[12px] text-red-700/80 mt-1">Permanently delete this workspace and all of its data. This action cannot be undone, and all members will lose access.</p>
                    </div>
                    <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="px-4 py-2 bg-white border border-red-200 rounded-lg text-[13px] font-medium text-red-600 hover:bg-red-50 transition-colors shadow-sm whitespace-nowrap flex items-center gap-2 mt-1 sm:mt-0"
                    >
                        <Trash2 className="h-4 w-4" />
                        Delete Workspace
                    </button>
                </div>
            </section>

            {/* Delete Workspace Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
                    <div
                        className="fixed inset-0 bg-gray-900/40 backdrop-blur-[2px] transition-opacity"
                        onClick={() => setIsDeleteModalOpen(false)}
                    />
                    <div className="bg-white rounded-[16px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] w-full max-w-[440px] overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                                    <AlertTriangle className="h-5 w-5 text-red-600" />
                                </div>
                                <div>
                                    <h2 className="text-[16px] font-semibold text-gray-900">Delete Workspace</h2>
                                    <p className="text-[13px] text-gray-500 mt-0.5">This action cannot be undone.</p>
                                </div>
                            </div>
                            <div className="text-[13px] text-gray-600 mb-5">
                                You are about to permanently delete the <span className="font-semibold text-gray-900">{currentWorkspace.name}</span> workspace. All data, members, and settings will be permanently removed.
                            </div>
                            <div className="mb-2">
                                <label className="text-[13px] font-medium text-gray-900 mb-1.5 block">
                                    Please type <span className="font-bold">{currentWorkspace.slug}</span> to confirm.
                                </label>
                                <input
                                    type="text"
                                    value={deleteConfirmationText}
                                    onChange={(e) => setDeleteConfirmationText(e.target.value)}
                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-[10px] text-[13px] text-gray-900 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 transition-colors"
                                    placeholder={currentWorkspace.slug}
                                />
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3 rounded-b-[16px]">
                            <button
                                onClick={() => {
                                    setIsDeleteModalOpen(false);
                                    setDeleteConfirmationText('');
                                }}
                                className="px-4 py-2 text-[13px] font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-[10px] transition-colors shadow-sm"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={deleteConfirmationText !== currentWorkspace.slug}
                                className="px-4 py-2 text-[13px] font-medium text-white bg-red-600 hover:bg-red-700 rounded-[10px] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Delete Workspace
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

export default WorkspaceSettingsPage