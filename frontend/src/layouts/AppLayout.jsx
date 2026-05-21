import { useEffect } from "react"
import { Toaster } from "react-hot-toast"
import { Outlet, useLocation } from "react-router-dom"
import FullPageLoader from "../components/ui/FullPageLoader"
import { errorCodes } from "../constants/errorCodes"
import useAuth from "../hooks/auth/useAuth"
import { showApiError, showError, showSuccess } from '../utils/toast'


function AppLayout() {

    const { isLoading, isError, error } = useAuth() // runs on mount automatically

    //global errors
    useEffect(() => {

        //hide refresh token errors for now
        if(isError && error?.response?.data?.error?.code !== errorCodes.REFRESH_TOKEN_INVALID){
           //showApiError(error) 
        }

    }, [isError])


    const location = useLocation()

    //show redirecton toast messages if any
    useEffect(() => {
  
        if (location.state?.toast) {

            if (location.state.error) {
                showError(location.state.toast)
            } else {
                showSuccess(location.state.toast)
            }

            window.history.replaceState({}, '')
        }

    }, [location.state])


    if (isLoading) return <FullPageLoader />

    return (
        <>
            <Toaster position="top-center" />
            <Outlet />
        </>
    )
}


export default AppLayout