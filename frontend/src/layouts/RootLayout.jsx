import { Outlet } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { initializeUser } from "../store/slices/authSlice"
import { useEffect } from "react"
import FullPageLoader from "../components/ui/FullPageLoader"
import { Toaster } from "react-hot-toast"
import { errorCodes } from "../constants/errorCodes"
import { showError } from '../utils/toast'
import { errorMessages } from "../constants/errorMessages"


function RootLayout() {

    const dispatch = useDispatch()
    const { authLoading, error } = useSelector(store => store.auth)

    useEffect(() => {
        if(error?.error?.code === errorCodes.RATE_LIMITED){
            showError("Too many requests. Please try again later.")
        }else if(error?.error?.code === errorCodes.TOKEN_ERROR){
            showError("Authentication token missing. Please login again.")
        }
    },[error])

    useEffect(() => {
        dispatch(initializeUser())  // thunk → calls /auth/token/refresh/
    }, [])

    return (
        authLoading
            ?
            <FullPageLoader />
            :
            <>
                <Toaster position="top-center" />
                <Outlet />
            </>
    )
}

export default RootLayout