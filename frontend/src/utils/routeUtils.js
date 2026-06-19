import { ROUTE_PATHS } from '../constants/routePaths'
import authRoutes from '../routes/authRoutes'

export const isPublicRoute = (pathname) =>
    authRoutes.children.some(route => pathname.includes(route.path))


export const buildWorkspacePath = (slug) => {
    return slug ? ROUTE_PATHS.WORKSPACE(slug) : ROUTE_PATHS.WORKSPACES
}


export const getWorkspaceRedirectPath = ({ workspaces }) => {
    if (workspaces.length === 0) return ROUTE_PATHS.CREATE_WORKSPACE
    if (workspaces.length === 1) return buildWorkspacePath(workspaces[0]?.slug)
    return ROUTE_PATHS.WORKSPACES
}