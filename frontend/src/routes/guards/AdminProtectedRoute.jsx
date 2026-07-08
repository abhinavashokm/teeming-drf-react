import { Navigate, Outlet } from "react-router-dom"
import useAuth from "../../hooks/auth/useAuth"
import { ROUTE_PATHS } from "../../constants/routePaths"


function AdminProtectedRoute() {

  const { data: user } = useAuth()

  return (
    user?.isStaff
      ? <Outlet />
      : <Navigate to={ROUTE_PATHS.ADMIN_LOGIN} replace />

  )
}

export default AdminProtectedRoute