import React, { useState } from 'react';
import { X, Search, Check, Plus } from 'lucide-react';

export default function SwitchWorkspaceModal({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const workspaces = [
    { id: '1', name: 'Acme Corp', color: 'bg-gray-900', active: true },
    { id: '2', name: 'Client TechFlow', color: 'bg-indigo-500', active: false },
    { id: '3', name: 'Design Studio', color: 'bg-purple-500', active: false },
    { id: '4', name: 'Marketing HQ', color: 'bg-blue-500', active: false },
  ];

  const filteredWorkspaces = workspaces.filter(w => 
    w.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

        {/* Search */}
        <div className="p-3 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" strokeWidth={1.5} />
            <input 
              type="text"
              placeholder="Search workspaces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50/80 border border-gray-200 rounded-[10px] text-[13px] text-gray-900 focus:outline-none focus:ring-4 focus:ring-teeming-green/10 focus:border-teeming-green transition-all placeholder:text-gray-400"
              autoFocus
            />
          </div>
        </div>

        {/* Workspace List */}
        <div className="px-2 pb-3 max-h-[300px] overflow-y-auto">
          <div className="space-y-0.5">
            {filteredWorkspaces.map(workspace => (
              <button
                key={workspace.id}
                className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-[10px] transition-colors group"
                onClick={() => { console.log('Switched to', workspace.name); onClose(); }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-[8px] flex items-center justify-center text-white text-[13px] font-medium shadow-sm ${workspace.color}`}>
                    {workspace.name.charAt(0)}
                  </div>
                  <span className={`text-[13px] font-medium ${workspace.active ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-900'}`}>
                    {workspace.name}
                  </span>
                </div>
                {workspace.active && (
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
        <div className="p-3 border-t border-gray-100 bg-gray-50/50">
          <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-[13px] font-medium text-teeming-green hover:text-white hover:bg-teeming-green rounded-[10px] transition-colors group border border-transparent hover:border-teeming-green/20 hover:shadow-sm">
            <Plus className="h-4 w-4" strokeWidth={2} />
            New Workspace
          </button>
        </div>

      </div>
    </div>
  );
}
