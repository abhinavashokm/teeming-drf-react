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
    pendingInvitations: (slug) => [
        ...root(slug),
        'pendingInvitations'
    ],
    goals: (slug) => [
        ...root(slug),
        'goals'
    ],
}

//can be used directly, no hooks needed
export const globalQueryKeys = {
    auth: ['auth'],
    workspaces: ['workspaces'],
}

