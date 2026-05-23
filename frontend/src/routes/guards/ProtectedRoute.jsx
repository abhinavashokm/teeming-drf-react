import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"


function ProtectedRoute() {

  // const { user } = useSelector(store => store.auth)

  return (
    // true // user //for testing purpose turn off protected routes
    // ? 
    <Outlet />
    // : <Navigate to={'/auth/login'} replace/>

  )
}

export default ProtectedRoute