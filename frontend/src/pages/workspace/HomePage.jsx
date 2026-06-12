import {
  Layers,
  PartyPopper,
  Plus,
  X
} from 'lucide-react';
import { useState } from 'react';
import GoalCard from '../../components/goal/GoalCard';
import GoalFormModal from '../../components/goal/GoalFormModal';
import InviteModal from '../../components/workspace/InviteModal';
import SwitchWorkspaceModal from '../../components/workspace/SwitchWorkspaceModal';
import { PERMISSIONS } from '../../constants/permissions';
import useGoals from '../../hooks/goal/useGoals';
import { useCan } from '../../hooks/permissions/useCan';
import useWorkspace from '../../hooks/workspace/useWorkspace';
import useWelcomeBanner from '../../hooks/invite/useWelcomeBanner';
import useAuth from '../../hooks/auth/useAuth';
import AppButton from '../../components/ui/buttons/AppButton';


function HomePage() {

  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [isSwitchWorkspaceModalOpen, setIsSwitchWorkspaceModalOpen] = useState(false);

  const [isGoalFormModalOpen, setIsGoalFormModalOpen] = useState(false);
  const { data: currentWorkspace } = useWorkspace()
  const { data: currentUser } = useAuth()

  const { data: Goals } = useGoals()

  const canManageGoals = useCan(PERMISSIONS.MANAGE_GOALS)

  const { getWelcome, removeWelcome } = useWelcomeBanner()

  const [showWelcome, setShowWelcome] = useState(() => getWelcome(currentWorkspace.slug, currentUser.id))

  const handleRemoveWelcome = () => {
    removeWelcome(currentWorkspace.slug, currentUser.id)
    setShowWelcome(false)
  }

  return (

    <>
      <div className="max-w-5xl mx-auto space-y-14 pb-20">

        {showWelcome && (
        
            <div className="flex items-center gap-3.5 bg-[#E1F5EE] border border-[#5DCAA5] rounded-2xl px-4 py-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#1D9E75] flex items-center justify-center shrink-0">
                <PartyPopper className="h-5 w-5 text-white" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-medium text-[#085041]">Welcome to {currentWorkspace.name}!</p>
                <p className="text-[12px] text-[#0F6E56] leading-relaxed mt-0.5">
                  {currentWorkspace.role === 'Admin'
                    ? `Hey ${currentUser.fullName.split(' ')[0]}! You've been added as an admin. You can manage goals, invite members, and configure settings.`
                    : `Hey ${currentUser.fullName.split(' ')[0]}! You've been added as a member. Explore goals and start contributing to ideas.`
                  }
                </p>
              </div>
              <button onClick={handleRemoveWelcome} className="p-1 rounded-md hover:bg-[#9FE1CB] transition-colors">
                <X className="h-4 w-4 text-[#0F6E56]" strokeWidth={2} />
              </button>
            </div>
  
        )}

        {/* Goals */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900 tracking-tight">
              <Layers className="h-5 w-5 text-gray-900" strokeWidth={1.5} />
              Goals
            </h2>

            {
              canManageGoals &&

              <AppButton onClick={() => setIsGoalFormModalOpen(true)} >
                <Plus className="h-3.5 w-3.5" strokeWidth={2} />
                New Goal
              </AppButton>
            }


          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Goal 1 */}

            {
              Goals?.length > 0 ? (
                Goals.map((goal) => (
                  <GoalCard key={goal.id} goal={goal} />
                ))
              ) : (
                <div className="col-span-full border border-dashed border-gray-300 rounded-2xl bg-white py-14 px-8 flex flex-col items-center justify-center text-center">

                  <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-5">
                    <Layers
                      className="h-7 w-7 text-gray-400"
                      strokeWidth={1.7}
                    />
                  </div>

                  <h3 className="text-[15px] font-semibold text-gray-900 mb-1.5">
                    No goals yet
                  </h3>

                  <p className="text-[13px] text-gray-500 max-w-sm leading-relaxed mb-5">
                    {currentWorkspace.role === 'Member' ?
                      "No goals in the workspace yet"
                      :

                      " Create your first goal to organize ideas, track progress, and align your workspace around outcomes."
                    }

                  </p>

                </div>
              )
            }


            {/* <div className="group border border-gray-200 rounded-[12px] overflow-hidden hover:border-gray-300 transform hover:-translate-y-[2px] transition-all duration-200 cursor-pointer flex flex-col bg-white">
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
            </div> */}

          </div>
        </section>

        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900 tracking-tight">Assigned Ideas</h2>
              <a href="#" className="text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors">View all</a>
            </div>

            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
              
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
        </div> */}

      </div>

      <InviteModal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} />
      <SwitchWorkspaceModal isOpen={isSwitchWorkspaceModalOpen} onClose={() => setIsSwitchWorkspaceModalOpen(false)} />
      <GoalFormModal isOpen={isGoalFormModalOpen} onClose={() => setIsGoalFormModalOpen(false)} />

    </>
  )
}

export default HomePage