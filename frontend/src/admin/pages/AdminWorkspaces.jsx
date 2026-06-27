import React, { useState } from 'react';
import { LayoutDashboard, Users, Layers, Settings, LineChart, Search, ChevronDown, SlidersHorizontal, Download, MoreHorizontal, X, AlertTriangle, Shield } from 'lucide-react';
import AdminSidebar from '../components/app/AdminSidebar';

export default function AdminWorkspaces() {
  const [workspacesList, setWorkspacesList] = useState([
    {
      id: 1,
      initials: 'DS',
      name: 'Design System',
      slug: '@design-system',
      color: 'bg-blue-500',
      owner: { initials: 'EV', name: 'Elena Vance', color: 'bg-pink-500' },
      members: 24,
      goals: 156,
      created: 'Jan 12, 2024',
      plan: 'Pro',
      planColor: 'bg-amber-100 text-amber-700',
      status: 'Active'
    },
    {
      id: 2,
      initials: 'M1',
      name: 'Marketing Q1',
      slug: '@marketing-q1',
      color: 'bg-purple-500',
      owner: { initials: 'DC', name: 'David Chen', color: 'bg-blue-500' },
      members: 8,
      goals: 42,
      created: 'Feb 04, 2024',
      plan: 'Enterprise',
      planColor: 'bg-purple-100 text-purple-700',
      status: 'Active'
    },
    {
      id: 3,
      initials: 'PG',
      name: 'Product Growth',
      slug: '@product-growth',
      color: 'bg-emerald-500',
      owner: { initials: 'SJ', name: 'Sarah Jenkins', color: 'bg-amber-500' },
      members: 15,
      goals: 89,
      created: 'Nov 22, 2023',
      plan: 'Pro',
      planColor: 'bg-amber-100 text-amber-700',
      status: 'Active'
    },
    {
      id: 4,
      initials: 'EL',
      name: 'Engineering Labs',
      slug: '@engineering-labs',
      color: 'bg-red-500',
      owner: { initials: 'MW', name: 'Marcus Wright', color: 'bg-slate-700' },
      members: 12,
      goals: 31,
      created: 'Dec 15, 2023',
      plan: 'Free',
      planColor: 'bg-slate-100 text-slate-700',
      status: 'Active'
    },
    {
      id: 5,
      initials: 'CS',
      name: 'Customer Success',
      slug: '@customer-success',
      color: 'bg-cyan-500',
      owner: { initials: 'AT', name: 'Anna Taylor', color: 'bg-indigo-500' },
      members: 18,
      goals: 64,
      created: 'Oct 28, 2023',
      plan: 'Pro',
      planColor: 'bg-amber-100 text-amber-700',
      status: 'Active'
    }
  ]);

  const [dropdownOpenId, setDropdownOpenId] = useState(null);
  const [viewDetailsWorkspace, setViewDetailsWorkspace] = useState(null);
  const [suspendConfirmWorkspace, setSuspendConfirmWorkspace] = useState(null);

  const [statusFilter, setStatusFilter] = useState('All');
  const [planFilter, setPlanFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWorkspacesList = workspacesList.filter(w => {
    const matchesSearch = w.name.toLowerCase().includes(searchQuery.toLowerCase()) || w.owner.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || w.status === statusFilter;
    const matchesPlan = planFilter === 'All' || w.plan === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  // Modal specific state
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [memberRoleFilter, setMemberRoleFilter] = useState('All');

  const mockMembers = [
    { id: 1, initials: 'EV', name: 'Elena Vance', email: 'elena@example.com', role: 'Owner', color: 'bg-pink-500', joined: 'Jan 12, 2024' },
    { id: 2, initials: 'SJ', name: 'Sarah Jenkins', email: 'sarah@example.com', role: 'Admin', color: 'bg-amber-500', joined: 'Jan 15, 2024' },
    { id: 3, initials: 'DC', name: 'David Chen', email: 'david@example.com', role: 'Member', color: 'bg-blue-500', joined: 'Feb 02, 2024' },
    { id: 4, initials: 'AT', name: 'Anna Taylor', email: 'anna@example.com', role: 'Member', color: 'bg-indigo-500', joined: 'Feb 10, 2024' },
  ];

  const filteredMembers = mockMembers.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) || m.email.toLowerCase().includes(memberSearchQuery.toLowerCase());
    const matchesRole = memberRoleFilter === 'All' || m.role === memberRoleFilter;
    return matchesSearch && matchesRole;
  });

  const toggleDropdown = (e, id) => {
    e.stopPropagation();
    setDropdownOpenId(dropdownOpenId === id ? null : id);
  };

  const handleSuspendConfirm = () => {
    setWorkspacesList(prev => prev.map(w => 
      w.id === suspendConfirmWorkspace.id ? { ...w, status: 'Suspended' } : w
    ));
    setSuspendConfirmWorkspace(null);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const closeDropdown = () => setDropdownOpenId(null);
    document.addEventListener('click', closeDropdown);
    return () => document.removeEventListener('click', closeDropdown);
  }, []);

  return (
<>
          <div className="max-w-6xl mx-auto space-y-6 pb-12">
            
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3 flex-1">
                <div className="relative w-[320px]">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-[14px] w-[14px] text-slate-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search workspaces..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-[36px] bg-white border border-slate-200 rounded-lg pl-9 pr-4 text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                  />
                </div>
                
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-[36px] appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 text-[13px] font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  </div>
                </div>

                <div className="relative">
                  <select
                    value={planFilter}
                    onChange={(e) => setPlanFilter(e.target.value)}
                    className="h-[36px] appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 text-[13px] font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                  >
                    <option value="All">All Plans</option>
                    <option value="Free">Free</option>
                    <option value="Pro">Pro</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="w-[36px] h-[36px] flex items-center justify-center bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors shadow-sm">
                  <SlidersHorizontal className="h-[15px] w-[15px]" />
                </button>
                <button className="w-[36px] h-[36px] flex items-center justify-center bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors shadow-sm">
                  <Download className="h-[15px] w-[15px]" />
                </button>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-3.5 text-[12px] font-bold text-slate-500 uppercase tracking-wider">Workspace</th>
                      <th className="px-6 py-3.5 text-[12px] font-bold text-slate-500 uppercase tracking-wider">Owner</th>
                      <th className="px-6 py-3.5 text-[12px] font-bold text-slate-500 uppercase tracking-wider">Members</th>
                      <th className="px-6 py-3.5 text-[12px] font-bold text-slate-500 uppercase tracking-wider">Goals</th>
                      <th className="px-6 py-3.5 text-[12px] font-bold text-slate-500 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-3.5 text-[12px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredWorkspacesList.length > 0 ? (
                      filteredWorkspacesList.map((workspace, index) => (
                      <tr key={workspace.id} className={`hover:bg-slate-50/50 transition-colors group ${index % 2 !== 0 ? 'bg-slate-50/30' : ''}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg ${workspace.color} flex items-center justify-center text-[12px] font-bold text-white shrink-0`}>
                              {workspace.initials}
                            </div>
                            <div className="flex flex-col items-start">
                              <span className={`text-[14px] font-medium leading-tight mb-1 ${workspace.status === 'Suspended' ? 'text-red-600 line-through' : 'text-slate-900'}`}>{workspace.name}</span>
                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${workspace.planColor}`}>
                                {workspace.plan}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full ${workspace.owner.color} flex items-center justify-center text-[10px] font-bold text-white shrink-0`}>
                              {workspace.owner.initials}
                            </div>
                            <span className="text-[14px] text-slate-700">{workspace.owner.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[14px] text-slate-700 font-medium">{workspace.members}</td>
                        <td className="px-6 py-4 text-[14px] text-slate-700 font-medium">{workspace.goals}</td>
                        <td className="px-6 py-4 text-[14px] text-slate-500">{workspace.created}</td>
                        <td className="px-6 py-4 text-right relative">
                          <button 
                            onClick={(e) => toggleDropdown(e, workspace.id)}
                            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
                          >
                            <MoreHorizontal className="w-[18px] h-[18px]" />
                          </button>

                          {dropdownOpenId === workspace.id && (
                            <div className={`absolute right-8 ${index >= workspacesList.length - 2 ? 'bottom-10 mb-2' : 'top-10 mt-1'} w-44 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50 overflow-hidden text-left`}>
                              <button
                                onClick={() => { setViewDetailsWorkspace(workspace); setDropdownOpenId(null); }}
                                className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center text-left"
                              >
                                View Details
                              </button>
                              <button
                                onClick={() => { setSuspendConfirmWorkspace(workspace); setDropdownOpenId(null); }}
                                className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center text-left font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={workspace.status === 'Suspended'}
                              >
                                Suspend Workspace
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-8 text-center text-slate-500 text-sm">
                          No workspaces found matching your filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[13px] text-slate-500">Showing {filteredWorkspacesList.length} of {workspacesList.length} workspaces</span>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 border border-slate-200 rounded-md text-[13px] font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors" disabled>Previous</button>
                  <button className="px-3 py-1.5 bg-blue-600 border border-blue-600 rounded-md text-[13px] font-medium text-white shadow-sm hover:bg-blue-700 transition-colors">1</button>
                  <button className="px-3 py-1.5 border border-slate-200 rounded-md text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition-colors">2</button>
                  <button className="px-3 py-1.5 border border-slate-200 rounded-md text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition-colors">3</button>
                  <span className="text-slate-400 px-1">...</span>
                  <button className="px-3 py-1.5 border border-slate-200 rounded-md text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition-colors">169</button>
                  <button className="px-3 py-1.5 border border-slate-200 rounded-md text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition-colors">Next</button>
                </div>
              </div>
            </div>

          </div>

      {/* Suspend Confirmation Modal */}
      {suspendConfirmWorkspace && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Suspend Workspace</h3>
              <p className="text-sm text-slate-500">
                Are you sure you want to suspend <span className="font-bold text-slate-700">{suspendConfirmWorkspace.name}</span>? All members will immediately lose access to this workspace.
              </p>
            </div>
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button 
                onClick={() => setSuspendConfirmWorkspace(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200/50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSuspendConfirm}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors"
              >
                Yes, Suspend
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {viewDetailsWorkspace && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 bg-slate-50/50 relative shrink-0">
              <button 
                onClick={() => {
                  setViewDetailsWorkspace(null);
                  setMemberSearchQuery('');
                  setMemberRoleFilter('All');
                }}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors bg-white hover:bg-slate-100 p-1.5 rounded-lg border border-slate-200 shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-start gap-5">
                <div className={`w-20 h-20 rounded-xl ${viewDetailsWorkspace.color} flex items-center justify-center text-3xl font-bold text-white shadow-sm shrink-0`}>
                  {viewDetailsWorkspace.initials}
                </div>
                <div className="flex-1 mt-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-2xl font-bold text-slate-900">{viewDetailsWorkspace.name}</h2>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${viewDetailsWorkspace.planColor}`}>
                      {viewDetailsWorkspace.plan}
                    </span>
                    {viewDetailsWorkspace.status === 'Suspended' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-red-100 text-red-700">
                        Suspended
                      </span>
                    )}
                  </div>
                  <div className="text-[14px] font-medium text-slate-500 mb-3">{viewDetailsWorkspace.slug}</div>
                  
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex flex-col">
                      <span className="text-slate-500 font-medium">Owner</span>
                      <span className="text-slate-900 font-bold">{viewDetailsWorkspace.owner.name}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-slate-500 font-medium">Created</span>
                      <span className="text-slate-900 font-bold">{viewDetailsWorkspace.created}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-slate-500 font-medium">Total Goals</span>
                      <span className="text-slate-900 font-bold">{viewDetailsWorkspace.goals}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Body */}
            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-[16px] font-bold text-slate-900">Workspace Members</h3>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[11px] font-bold rounded-full">
                    {mockMembers.length}
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="relative w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-[14px] w-[14px] text-slate-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search members..."
                      value={memberSearchQuery}
                      onChange={(e) => setMemberSearchQuery(e.target.value)}
                      className="w-full h-[36px] bg-white border border-slate-200 rounded-lg pl-9 pr-4 text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  
                  <div className="relative">
                    <select
                      value={memberRoleFilter}
                      onChange={(e) => setMemberRoleFilter(e.target.value)}
                      className="h-[36px] appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 text-[13px] font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                    >
                      <option value="All">All Roles</option>
                      <option value="Owner">Owner</option>
                      <option value="Admin">Admin</option>
                      <option value="Member">Member</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto bg-white p-6">
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Member</th>
                        <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredMembers.length > 0 ? (
                        filteredMembers.map(member => (
                          <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-3.5">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full ${member.color} flex items-center justify-center text-[11px] font-bold text-white shrink-0`}>
                                  {member.initials}
                                </div>
                                <span className="text-[13px] font-bold text-slate-900">{member.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-3.5 text-[13px] text-slate-500">{member.email}</td>
                            <td className="px-6 py-3.5">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold ${
                                member.role === 'Owner' ? 'bg-emerald-100 text-emerald-700' :
                                member.role === 'Admin' ? 'bg-blue-100 text-blue-700' :
                                'bg-slate-100 text-slate-600'
                              }`}>
                                {member.role === 'Owner' && <Shield className="w-3 h-3" />}
                                {member.role}
                              </span>
                            </td>
                            <td className="px-6 py-3.5 text-[13px] text-slate-500">{member.joined}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="px-6 py-8 text-center text-slate-500 text-sm">
                            No members found matching your search.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
