import authRoutes from '../routes/authRoutes'

export const isPublicRoute = (pathname) =>
    authRoutes.children.some(route => pathname.includes(route.path))


export const getWorkspaceRedirectPath = ({ workspaces, last_workspace }) => {
    if (workspaces.length === 0) return '/create-workspace'
    if (last_workspace) return `/${last_workspace.slug}/home`
    if (workspaces.length === 1) return `/${workspaces[0].slug}/home`
    return '/select-workspace'
}