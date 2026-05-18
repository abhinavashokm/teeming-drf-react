import {
    ChevronDown,
    Layers,
    LogOut,
    MoreHorizontal,
    Plus,
    Settings,
    Users
} from 'lucide-react';
import { useState } from 'react';

function HomePage() {

    const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);

    return (

        <>

            {/* Content */}


          <div className="max-w-5xl mx-auto space-y-14 pb-20">

            {/* Workspace Header Minimal */}
            <div className="flex items-end justify-between border-b border-gray-200 pb-6">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-gray-900 rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-white font-semibold text-2xl">A</span>
                </div>
                <div>
                  <div className="relative">
                    <button 
                      onClick={() => setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen)}
                      className="flex items-center gap-2 mb-1 hover:opacity-80 transition-opacity"
                    >
                      <h1 className="text-[22px] font-semibold text-gray-900 tracking-tight leading-none">Acme Corp</h1>
                      <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                    </button>
                    
                    {isWorkspaceDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsWorkspaceDropdownOpen(false)}></div>
                        <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 z-50 transition-all duration-150 ease-out">
                          <div className="px-3 py-2 border-b border-gray-100 mb-1">
                            <div className="flex items-center gap-2 mb-0.5">
                              <div className="w-4 h-4 bg-gray-900 rounded-[4px] flex items-center justify-center">
                                <span className="text-white font-medium text-[9px] leading-none">A</span>
                              </div>
                              <span className="text-[13px] font-semibold text-gray-900 leading-none">Acme Corp</span>
                            </div>
                            <div className="text-[11px] text-gray-500 pl-6 leading-none">
                              Free plan · Admin
                            </div>
                          </div>
                          <div className="flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-gray-600 hover:bg-gray-50 rounded-lg mx-1 transition-colors cursor-pointer">
                            <Settings className="h-4 w-4 text-gray-400" />
                            Settings
                          </div>
                          <div className="flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-gray-600 hover:bg-gray-50 rounded-lg mx-1 transition-colors cursor-pointer">
                            <Users className="h-4 w-4 text-gray-400" />
                            Manage Team
                          </div>
                          <div className="border-t border-gray-100 mt-1 pt-1 mx-1"></div>
                          <div className="flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-red-500 hover:bg-red-50 rounded-lg mx-1 transition-colors cursor-pointer">
                            <LogOut className="h-4 w-4" />
                            Leave Workspace
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[13px]">
                    <span className="text-gray-500">Free plan</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-teeming-green font-medium">Member</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="px-3 py-1.5 bg-gray-900 border border-transparent rounded-md text-[13px] font-medium text-white hover:bg-gray-800 transition-colors shadow-sm">
                  + Invite Members
                </button>
              </div>
            </div>

            {/* Goals */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900 tracking-tight">
                  <Layers className="h-5 w-5 text-gray-900" strokeWidth={1.5} />
                  Goals
                </h2>
                <button className="text-[13px] font-medium text-white bg-[#1D9E75] hover:bg-[#15825f] transition-colors flex items-center gap-1 px-4 py-1.5 rounded-[20px]">
                  <Plus className="h-3.5 w-3.5" strokeWidth={2} />
                  New Goal
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Goal 1 */}
                <div className="group border border-gray-200 rounded-[12px] overflow-hidden hover:border-gray-300 transform hover:-translate-y-[2px] transition-all duration-200 cursor-pointer flex flex-col bg-white">
                  <div className="h-28 bg-[#378ADD] p-4 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span className="text-[12px] text-white bg-black/20 px-3 py-1 rounded-[20px] font-medium leading-none">3 ideas · 1 in progress</span>
                      <MoreHorizontal className="h-4 w-4 text-white/50 group-hover:text-white transition-colors" strokeWidth={2} />
                    </div>
                    <div className="flex -space-x-1.5 mt-4">
                      <div className="w-6 h-6 rounded-full bg-blue-500 ring-2 ring-[#378ADD] flex items-center justify-center text-[9px] text-white font-medium">JD</div>
                      <div className="w-6 h-6 rounded-full bg-purple-500 ring-2 ring-[#378ADD] flex items-center justify-center text-[9px] text-white font-medium">SM</div>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-center">
                    <h3 className="font-medium text-[14px] text-gray-900 leading-none">Checkout Drop-off</h3>
                  </div>
                </div>

                {/* Goal 2 */}
                <div className="group border border-gray-200 rounded-[12px] overflow-hidden hover:border-gray-300 transform hover:-translate-y-[2px] transition-all duration-200 cursor-pointer flex flex-col bg-white">
                  <div className="h-28 bg-[#1D9E75] p-4 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span className="text-[12px] text-white bg-black/20 px-3 py-1 rounded-[20px] font-medium leading-none">8 ideas · 5 in progress</span>
                      <MoreHorizontal className="h-4 w-4 text-white/50 group-hover:text-white transition-colors" strokeWidth={2} />
                    </div>
                    <div className="flex -space-x-1.5 mt-4">
                      <div className="w-6 h-6 rounded-full bg-blue-500 ring-2 ring-[#1D9E75] flex items-center justify-center text-[9px] text-white font-medium">JD</div>
                      <div className="w-6 h-6 rounded-full bg-pink-500 ring-2 ring-[#1D9E75] flex items-center justify-center text-[9px] text-white font-medium">AW</div>
                      <div className="w-6 h-6 rounded-full bg-amber-500 ring-2 ring-[#1D9E75] flex items-center justify-center text-[9px] text-white font-medium">KL</div>
                      <div className="w-6 h-6 rounded-full bg-white ring-2 ring-[#1D9E75] flex items-center justify-center text-[9px] text-gray-500 font-medium">+2</div>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-center">
                    <h3 className="font-medium text-[14px] text-gray-900 leading-none">Reduce Churn</h3>
                  </div>
                </div>

                {/* Goal 3 */}
                <div className="group border border-gray-200 rounded-[12px] overflow-hidden hover:border-gray-300 transform hover:-translate-y-[2px] transition-all duration-200 cursor-pointer flex flex-col bg-white">
                  <div className="h-28 bg-[#EF9F27] p-4 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span className="text-[12px] text-white bg-black/20 px-3 py-1 rounded-[20px] font-medium leading-none">2 ideas · 2 in progress</span>
                      <MoreHorizontal className="h-4 w-4 text-white/50 group-hover:text-white transition-colors" strokeWidth={2} />
                    </div>
                    <div className="flex -space-x-1.5 mt-4">
                      <div className="w-6 h-6 rounded-full bg-blue-600 ring-2 ring-[#EF9F27] flex items-center justify-center text-[9px] text-white font-medium">JD</div>
                      <div className="w-6 h-6 rounded-full bg-teal-500 ring-2 ring-[#EF9F27] flex items-center justify-center text-[9px] text-white font-medium">TR</div>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-center">
                    <h3 className="font-medium text-[14px] text-gray-900 leading-none">Launch V2</h3>
                  </div>
                </div>

                {/* Goal 4 */}
                <div className="group border border-gray-200 rounded-[12px] overflow-hidden hover:border-gray-300 transform hover:-translate-y-[2px] transition-all duration-200 cursor-pointer flex flex-col bg-white">
                  <div className="h-28 bg-[#8B5CF6] p-4 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span className="text-[12px] text-white bg-black/20 px-3 py-1 rounded-[20px] font-medium leading-none">2 ideas · 2 in progress</span>
                      <MoreHorizontal className="h-4 w-4 text-white/50 group-hover:text-white transition-colors" strokeWidth={2} />
                    </div>
                    <div className="flex -space-x-1.5 mt-4">
                      <div className="w-6 h-6 rounded-full bg-indigo-500 ring-2 ring-[#8B5CF6] flex items-center justify-center text-[9px] text-white font-medium">AJ</div>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-center">
                    <h3 className="font-medium text-[14px] text-gray-900 leading-none">Personal Goals</h3>
                  </div>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* My Assigned Ideas */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-gray-900 tracking-tight">Assigned Ideas</h2>
                  <a href="#" className="text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors">View all</a>
                </div>

                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                  {/* Idea 1 */}
                  <div className="p-4 flex items-center justify-between border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors group cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div>
                        <h4 className="text-[13px] font-medium text-gray-900 mb-0.5">Simplify address form</h4>
                        <p className="text-[12px] text-gray-500">Acme Corp · Increase Conversion</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0 ml-4">
                      <span className="text-[11px] font-medium text-[#378ADD] bg-[#378ADD]/12 px-[10px] py-[2px] rounded-[20px] flex items-center gap-1.5">
                        <span className="text-[8px]">●</span> In progress
                      </span>
                      <span className="text-[11px] text-[#EF9F27] font-medium">May 25</span>
                    </div>
                  </div>

                  {/* Idea 2 */}
                  <div className="p-4 flex items-center justify-between border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors group cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div>
                        <h4 className="text-[13px] font-medium text-gray-900 mb-0.5">Write copy for onboarding flow</h4>
                        <p className="text-[12px] text-gray-500">Acme Corp · Launch V2</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0 ml-4">
                      <span className="text-[11px] font-medium text-[#378ADD] bg-[#378ADD]/12 px-[10px] py-[2px] rounded-[20px] flex items-center gap-1.5">
                        <span className="text-[8px]">●</span> In progress
                      </span>
                      <span className="text-[11px] text-gray-400">May 28</span>
                    </div>
                  </div>

                  {/* Idea 3 */}
                  <div className="p-4 flex items-center justify-between border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors group cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div>
                        <h4 className="text-[13px] font-medium text-gray-900 mb-0.5">Redesign onboarding screen</h4>
                        <p className="text-[12px] text-gray-500">TechFlow · User Growth</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0 ml-4">
                      <span className="text-[11px] font-medium text-[#378ADD] bg-[#378ADD]/12 px-[10px] py-[2px] rounded-[20px] flex items-center gap-1.5">
                        <span className="text-[8px]">●</span> In progress
                      </span>
                      <span className="text-[11px] text-gray-400">Jun 2</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Recently Active */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-gray-900 tracking-tight">Recent Activity</h2>
                  <a href="#" className="text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors">View all</a>
                </div>

                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                  <div className="p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100 last:border-0">
                    <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-medium text-[11px] shrink-0">SM</div>
                    <div>
                      <p className="text-[13px] text-gray-600 leading-relaxed">
                        <span className="font-medium text-gray-900">Sarah Miller</span> completed <span className="font-medium text-gray-900">Update API docs</span>
                      </p>
                      <span className="text-[11px] text-gray-400 block mt-0.5">2 hours ago · Acme Corp</span>
                    </div>
                  </div>

                  <div className="p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100 last:border-0">
                    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium text-[11px] shrink-0">JD</div>
                    <div>
                      <p className="text-[13px] text-gray-600 leading-relaxed">
                        <span className="font-medium text-gray-900">John Doe</span> added a comment on <span className="font-medium text-gray-900">Checkout Drop-off</span>
                      </p>
                      <span className="text-[11px] text-gray-400 block mt-0.5">5 hours ago · Acme Corp</span>
                    </div>
                  </div>

                  <div className="p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100 last:border-0">
                    <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-medium text-[11px] shrink-0">TR</div>
                    <div>
                      <p className="text-[13px] text-gray-600 leading-relaxed">
                        <span className="font-medium text-gray-900">Tom Riddle</span> created a new goal <span className="font-medium text-gray-900">Launch V2</span>
                      </p>
                      <span className="text-[11px] text-gray-400 block mt-0.5">Yesterday · Acme Corp</span>
                    </div>
                  </div>
                </div>
              </section>
            </div>

          </div>
       

        </>
    )
}

export default HomePage