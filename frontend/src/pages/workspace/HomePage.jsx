import {
  Layers,
  PartyPopper,
  Plus,
  X
} from 'lucide-react';
import { useState } from 'react';
import GoalCard from '../../components/goal/GoalCard';
import GoalFormModal from '../../components/goal/GoalFormModal';
import UpgradePlanModal from '../../components/subscription/UpgradePlanModal';
import AppButton from '../../components/ui/buttons/AppButton';
import { PERMISSIONS } from '../../constants/permissions';
import useAuth from '../../hooks/auth/useAuth';
import useGoals from '../../hooks/goal/useGoals';
import useWelcomeBanner from '../../hooks/invite/useWelcomeBanner';
import { useCan } from '../../hooks/permissions/useCan';
import useWorkspace from '../../hooks/workspace/useWorkspace';
import { cn } from '../../utils/cn';
import { workspaceRoles } from '../../constants/workspaceConstants';


function HomePage() {

  const [isGoalFormModalOpen, setIsGoalFormModalOpen] = useState(false);
  const [isUpgradePlanModalOpen, setIsUpgradePlanModalOpen] = useState(false)

  const { data: currentWorkspace } = useWorkspace()
  const currentPlan = currentWorkspace?.subscription?.plan
  const goalCountLimit = currentWorkspace?.limits?.goals
  const goalLimitReached = (goalCountLimit.used === goalCountLimit.max) ?? false

  const { data: currentUser } = useAuth()

  const {
    data,
    isPending: isGoalsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGoals()

  const goals =
    data?.pages.flatMap(
      page => page.goals
    ) ?? []

  const totalGoals =
    data?.pages?.[0]?.pagination?.count ?? 0

  const canManageGoals = useCan(PERMISSIONS.MANAGE_GOALS)

  const { getWelcome, removeWelcome } = useWelcomeBanner()

  const [showWelcome, setShowWelcome] = useState(() => getWelcome(currentWorkspace.slug, currentUser.id))

  const handleRemoveWelcome = () => {
    removeWelcome(currentWorkspace.slug, currentUser.id)
    setShowWelcome(false)
  }

  const handleCreateGoal = () => {

    if (goalLimitReached) {
      setIsUpgradePlanModalOpen(true)
      return
    }

    setIsGoalFormModalOpen(true)
  }

  const handleLoadMoreGoals = () => {

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
                {currentWorkspace.role === workspaceRoles.ADMIN
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

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900 tracking-tight">
                <Layers className="h-5 w-5 text-gray-900" strokeWidth={1.5} />
                Goals
              </h2>

              {goalCountLimit.max && (
                <span
                  className={cn(
                    "inline-flex items-center rounded-full border px-2 py-1 text-[10px] sm:text-[11px] font-medium",
                    goalLimitReached
                      ? "bg-red-50 border-red-200 text-red-700"
                      : "bg-amber-50 border-amber-200 text-amber-700"
                  )}
                >
                  {goalLimitReached
                    ? `Limit Reached (${goalCountLimit.used}/${goalCountLimit.max})`
                    : `${goalCountLimit.used}/${goalCountLimit.max} Used`}
                </span>
              )}
            </div>

            {canManageGoals && (
              <AppButton
                onClick={handleCreateGoal}
                className="w-full sm:w-auto"
              >
                <Plus className="h-3.5 w-3.5" strokeWidth={2} />
                New Goal
              </AppButton>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            {
              isGoalsLoading ?
                [...Array(4)].map((_, i) => (
                  <GoalCard key={i} loading />
                )) :
                goals?.length > 0 ? (
                  goals.map((goal) => (
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



          </div>

          {hasNextPage && (
            <div className="mt-8 flex flex-col items-center gap-3">

              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-medium text-gray-900">
                  {goals.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-900">
                  {totalGoals}
                </span>{" "}
                goals
              </p>

              <AppButton
                loading={isFetchingNextPage}
                onClick={() => fetchNextPage()}
              >
                Load More
              </AppButton>

            </div>
          )}

        </section>
        {/* 
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

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

      <GoalFormModal isOpen={isGoalFormModalOpen} onClose={() => setIsGoalFormModalOpen(false)} />
      <UpgradePlanModal isOpen={isUpgradePlanModalOpen} onClose={() => setIsUpgradePlanModalOpen(false)} currentLimit={goalCountLimit.max} currentUsage={goalCountLimit.used} currentPlan={currentPlan.name} />

    </>
  )
}

export default HomePage