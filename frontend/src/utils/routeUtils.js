import authRoutes from '../routes/authRoutes'

export const isPublicRoute = (pathname) =>
    authRoutes.children.some(route => pathname.includes(route.path))