// queryKeys.js
const all = ['workspace']
const root = (slug) => [...all, slug]

//for workspace scoped keys, there is an intermediate hook for passing workspace slug
export const workspaceQueryKeys = {
    all,
    root,
    members: (slug) => [
        ...root(slug),
        'members'
    ],
    onlineMembers: (slug) => [
        ...root(slug),
        'onlineMembers'
    ],
    pendingInvitations: (slug) => [
        ...root(slug),
        'pendingInvitations'
    ],
    goals: (slug) => [
        ...root(slug),
        'goals'
    ],
    goal: (slug, goal_id) => [
        ...root(slug),
        'goal',
        goal_id
    ],

    ideas: (slug, goal_id) => [
        ...root(slug),
        goal_id,
        'ideas'
    ],

    metrics: (slug, goal_id) => [
        ...root(slug),
        goal_id,
        'metrics'
    ],

    checkins: (slug, goal_id) => [
        ...root(slug),
        goal_id,
        "checkins",
    ],

    notifications: (slug) => [
        ...root(slug),
        "notifications",
    ],

    discussions: (slug, goal_id) => [
        ...root(slug),
        goal_id,
        "discussions",
    ],
    ai_assistant_responses: (user_email, slug, goal_id) => [
        user_email,
        ...root(slug),
        goal_id,
        "ai_assistant"
    ]
}

//can be used directly, no hooks needed
export const globalQueryKeys = {
    auth: ['auth'],
    workspaceMemberships: ['memberships'],
    plans: ['plans']
}

