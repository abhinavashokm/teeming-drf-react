import { Navigate, Outlet } from "react-router-dom"
import useAuth from "../../hooks/auth/useAuth"
import { ROUTE_PATHS } from "../../constants/routePaths"


function ProtectedRoute() {

  const { data: user } = useAuth()

  return (
    user
      ? <Outlet />
      : <Navigate to={ROUTE_PATHS.LOGIN} replace />

  )
}

export default ProtectedRoute