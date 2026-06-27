import { useEffect } from "react"
import { Toaster } from "react-hot-toast"
import { Outlet, useLocation } from "react-router-dom"
import FullPageLoader from "../components/ui/FullPageLoader"
import { errorCodes } from "../constants/errorCodes"
import useAuth from "../hooks/auth/useAuth"
import { showError, showSuccess } from '../utils/toast'


function AppLayout() {

    const { data, isLoading, isSuccess, isError, error } = useAuth() // runs on mount automaticallyz

    //global errors
    useEffect(() => {

        //hide refresh token errors for now
        if (isError && error?.response?.data?.error?.code !== errorCodes.REFRESH_TOKEN_INVALID) {
            //showApiError(error) 
        }

    }, [isError])


    const location = useLocation()

    //show redirecton toast messages if any
    useEffect(() => {

        const toastData = location.state?.toast

        if (toastData) {

            if (toastData?.type === 'success') {
                showSuccess(toastData?.message)

            } else {
                showError(toastData?.message)
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