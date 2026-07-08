import { Navigate, Outlet } from "react-router-dom"
import useAuth from "../../hooks/auth/useAuth"
import { ROUTE_PATHS } from "../../constants/routePaths"


function AdminPublicRoute() {

  const { data: user } = useAuth()

  return (
    user?.isStaff
      ? <Navigate to={ROUTE_PATHS.ADMIN_DASHBOARD} replace />
      : <Outlet />

  )
}

export default AdminPublicRoute