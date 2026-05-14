import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"


function ProtectedRoute() {

  const { user } = useSelector(store => store.auth)

  return (
    user 
    ? <Outlet />
    : <Navigate to={'/auth/login'} replace/>

  )
}

export default ProtectedRoute