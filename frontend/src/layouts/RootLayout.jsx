import { Outlet } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { initializeUser } from "../store/slices/authSlice"
import { useEffect } from "react"
import FullPageLoader from "../components/ui/FullPageLoader"


function RootLayout() {

    const dispatch = useDispatch()
    const authLoading = useSelector(store => store.auth.authLoading)

    useEffect(() => {
        dispatch(initializeUser())  // thunk → calls /auth/token/refresh/
    }, [])

    return (
        authLoading 
        ?
        <FullPageLoader/> 
        :
        <Outlet />
    )
}

export default RootLayout