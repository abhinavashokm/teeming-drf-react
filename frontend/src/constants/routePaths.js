const workspacePath = (slug) => `/w/${slug}`;

export const ROUTE_PATHS = {
    ROOT: '/',
    WORKSPACES: '/workspaces',
    WORKSPACE: workspacePath,
    CREATE_WORKSPACE: '/create-workspace',
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    ADMIN_LOGIN: '/admin/login',
    ADMIN_DASHBOARD: '/admin',
    LOGIN_WITH_INVITE: (token) => `/auth/login?token=${token}`,
    SIGNUP_WITH_INVITE: (token) => `/auth/signup?token=${token}`,
    WORKSPACE_SETTINGS: (slug) => `${workspacePath(slug)}/settings`,
    GOAL_DASHBOARD: (slug, goal_id) => `${workspacePath(slug)}/goals/${goal_id}`,
    UPGRADE_PLAN: (slug) => `${workspacePath(slug)}/upgrade-plan`,
    MANAGE_TEAM: (slug) => `${workspacePath(slug)}/manage-team`,
}