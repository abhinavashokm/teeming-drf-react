const workspacePath = (slug) => `/w/${slug}`;

export const ROUTE_PATHS = {
    ROOT: '/',
    WORKSPACES: '/workspaces',
    WORKSPACE: workspacePath,
    CREATE_WORKSPACE: '/create-workspace',
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    WORKSPACE_SETTINGS: (slug) => `${workspacePath(slug)}/settings`,
}