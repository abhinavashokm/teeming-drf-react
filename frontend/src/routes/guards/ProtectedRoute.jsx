import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"


function ProtectedRoute() {

  const { accessToken } = useSelector(store => store.auth)

  return (
    accessToken 
    ? <Outlet />
    : <Navigate to={'/auth/login'} replace/>

  )
}

export default ProtectedRoute