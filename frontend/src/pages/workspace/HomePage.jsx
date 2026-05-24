import {
  ChevronDown,
  Layers,
  LogOut,
  MoreHorizontal,
  Plus,
  Star
} from 'lucide-react';
import { useState } from 'react';
import InviteModal from '../../components/workspace/InviteModal';
import SwitchWorkspaceModal from '../../components/workspace/SwitchWorkspaceModal';
import useWorkspace from '../../hooks/workspace/useWorkspace';
import CreateGoalModal from '../../components/goal/CreateGoalModal';


function HomePage() {

  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [isSwitchWorkspaceModalOpen, setIsSwitchWorkspaceModalOpen] = useState(false);
  const [favoriteGoals, setFavoriteGoals] = useState(['Checkout Drop-off', 'Launch V2']);
  const [isCreateGoalModalOpen, setIsCreateGoalModalOpen] = useState(false);

  const { data: currentWorkspace } = useWorkspace()
  //const currentWorkspace = null

  return (

    <>
      <div className="max-w-5xl mx-auto space-y-14 pb-20">



        {/* Goals */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900 tracking-tight">
              <Layers className="h-5 w-5 text-gray-900" strokeWidth={1.5} />
              Goals
            </h2>
            <button onClick={() => setIsCreateGoalModalOpen(true)} className="text-[13px] font-medium text-white bg-[#1D9E75] hover:bg-[#15825f] transition-colors flex items-center gap-1 px-4 py-1.5 rounded-[20px]">
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
              <div className="p-4 flex-1 flex flex-col justify-center relative">
                <h3 className="font-medium text-[14px] text-gray-900 leading-none pr-6">Checkout Drop-off</h3>
                <button onClick={(e) => toggleFavorite(e, 'Checkout Drop-off')} className="absolute bottom-3 right-3 p-1 hover:bg-gray-100 rounded-md transition-colors">
                  <Star className={`h-4 w-4 ${favoriteGoals.includes('Checkout Drop-off') ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 hover:text-gray-400'}`} />
                </button>
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
              <div className="p-4 flex-1 flex flex-col justify-center relative">
                <h3 className="font-medium text-[14px] text-gray-900 leading-none pr-6">Reduce Churn</h3>
                <button onClick={(e) => toggleFavorite(e, 'Reduce Churn')} className="absolute bottom-3 right-3 p-1 hover:bg-gray-100 rounded-md transition-colors">
                  <Star className={`h-4 w-4 ${favoriteGoals.includes('Reduce Churn') ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 hover:text-gray-400'}`} />
                </button>
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
              <div className="p-4 flex-1 flex flex-col justify-center relative">
                <h3 className="font-medium text-[14px] text-gray-900 leading-none pr-6">Launch V2</h3>
                <button onClick={(e) => toggleFavorite(e, 'Launch V2')} className="absolute bottom-3 right-3 p-1 hover:bg-gray-100 rounded-md transition-colors">
                  <Star className={`h-4 w-4 ${favoriteGoals.includes('Launch V2') ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 hover:text-gray-400'}`} />
                </button>
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
              <div className="p-4 flex-1 flex flex-col justify-center relative">
                <h3 className="font-medium text-[14px] text-gray-900 leading-none pr-6">Personal Goals</h3>
                <button onClick={(e) => toggleFavorite(e, 'Personal Goals')} className="absolute bottom-3 right-3 p-1 hover:bg-gray-100 rounded-md transition-colors">
                  <Star className={`h-4 w-4 ${favoriteGoals.includes('Personal Goals') ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 hover:text-gray-400'}`} />
                </button>
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

      <InviteModal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} />
      <SwitchWorkspaceModal isOpen={isSwitchWorkspaceModalOpen} onClose={() => setIsSwitchWorkspaceModalOpen(false)} />
      <CreateGoalModal isOpen={isCreateGoalModalOpen} onClose={() => setIsCreateGoalModalOpen(false)} />
    </>
  )
}

export default HomePage