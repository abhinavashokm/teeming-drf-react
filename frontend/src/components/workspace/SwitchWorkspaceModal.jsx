import React, { useState } from 'react';
import { X, Search, Check, Plus } from 'lucide-react';
import useMyWorkspaces from '../../hooks/workspace/useMyWorkspaces';
import useWorkspace from "../../hooks/workspace/useWorkspace"
import useSwitchWorkspace from '../../hooks/workspace/useSwitchWorkspace';

export default function SwitchWorkspaceModal({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: currentWorkspace } = useWorkspace()

  const { data: myWorkspaces } = useMyWorkspaces()
  const { mutate: switchWorkspace } = useSwitchWorkspace()

  if (!isOpen) return null;

  // const workspaces = [
  //   { id: '1', name: 'Acme Corp', color: 'bg-gray-900', active: true },
  //   { id: '2', name: 'Client TechFlow', color: 'bg-indigo-500', active: false },
  //   { id: '3', name: 'Design Studio', color: 'bg-purple-500', active: false },
  //   { id: '4', name: 'Marketing HQ', color: 'bg-blue-500', active: false },
  // ];

  const COLORS = [
    'bg-gray-900', 'bg-indigo-500', 'bg-purple-500',
    'bg-blue-500', 'bg-emerald-500', 'bg-rose-500', 'bg-amber-500'
  ]

  const getWorkspaceColor = (name) => {
    const index = name.charCodeAt(0) % COLORS.length
    return COLORS[index]
  }

  const filteredWorkspaces = myWorkspaces?.workspaces?.filter(w =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) ?? [];

  const handleSwitchWorkspace = (workspace) => {
    if (currentWorkspace.slug === workspace.slug) {
      onClose()
      return
    }
    switchWorkspace(workspace)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/30 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-[16px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] w-full max-w-[400px] overflow-hidden transform transition-all m-4 border border-gray-100">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-[16px] font-semibold text-gray-900 tracking-tight">Switch Workspace</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        {/* Workspace List */}
        <div className="px-2 pb-3 max-h-[300px] overflow-y-auto">
          <div className="space-y-0.5">
            {filteredWorkspaces.map(workspace => (
              <button
                key={workspace.id}
                className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-[10px] transition-colors group"
                onClick={() => { handleSwitchWorkspace(workspace) }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-[8px] flex items-center justify-center text-white text-[13px] font-medium shadow-sm ${getWorkspaceColor(workspace.name)}`}>
                    {workspace.name[0]}
                  </div>
                  <span className={`text-[13px] font-medium ${workspace.active ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-900'}`}>
                    {workspace.name}
                  </span>
                </div>
                {workspace.slug == currentWorkspace.slug && (
                  <Check className="h-4 w-4 text-teeming-green mr-2" strokeWidth={2.5} />
                )}
              </button>
            ))}
            {filteredWorkspaces.length === 0 && (
              <div className="py-8 text-center text-gray-400 text-[13px]">
                No workspaces found
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-2 border-t border-gray-100 bg-gray-50/60">
          <button
            className="w-full flex items-center gap-3 p-2.5 rounded-[10px] hover:bg-white transition-all border border-transparent hover:border-gray-200 hover:shadow-sm group"
          >
            <div className="w-8 h-8 rounded-[8px] flex items-center justify-center bg-gray-100 text-gray-600 group-hover:bg-teeming-green/10 group-hover:text-teeming-green transition-colors">
              <Plus className="h-4 w-4" strokeWidth={2.2} />
            </div>

            <div className="flex flex-col items-start">
              <span className="text-[13px] font-medium text-gray-800">
                Create Workspace
              </span>

              <span className="text-[11px] text-gray-400">
                Start a separate workspace for another team
              </span>
            </div>
          </button>
        </div>

      </div>
    </div>
  );
}
