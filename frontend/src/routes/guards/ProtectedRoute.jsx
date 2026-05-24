import { Navigate, Outlet } from "react-router-dom"
import useAuth from "../../hooks/auth/useAuth"


function ProtectedRoute() {

  const { data: user } = useAuth()

  return (
    user
      ? <Outlet />
      : <Navigate to={'/auth/login'} replace />

  )
}

export default ProtectedRoute