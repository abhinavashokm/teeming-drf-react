import authRoutes from '../routes/authRoutes'

export const isPublicRoute = (pathname) =>
    authRoutes.children.some(route => pathname.includes(route.path))


export const buildWorkspacePath = (slug) => {
    return slug ? `/${slug}` : '/auth/login' 
}


export const getWorkspaceRedirectPath = ({ workspaces, last_workspace }) => {
    if (workspaces.length === 0) return '/create-workspace'
    if (last_workspace) return buildWorkspacePath(last_workspace?.slug)
    if (workspaces.length === 1) return `/${workspaces[0].slug}`
    return '/select-workspace'
}