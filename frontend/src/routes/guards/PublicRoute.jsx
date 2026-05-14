import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"


function PublicRoute() {

  const { accessToken } = useSelector(store => store.auth)

  return (
    accessToken 
    ? <Navigate to={'/'} replace/>
    : <Outlet />

  )
}

export default PublicRoute