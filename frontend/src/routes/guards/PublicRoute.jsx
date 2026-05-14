import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"


function PublicRoute() {

  const { user } = useSelector(store => store.auth)

  return (
    user 
    ? <Navigate to={'/'} replace/>
    : <Outlet />

  )
}

export default PublicRoute