import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearAuthError } from "../store/slices/authSlice";

function AuthLayout() {

    const dispatch = useDispatch()
    const location = useLocation()

    useEffect(() => {
        dispatch(clearAuthError())
    }, [location.pathname])

    
    return (
        <div className="min-h-screen w-full flex flex-col justify-center items-center relative overflow-hidden font-sans auth-body">
            <Outlet />
        </div>
    )
}

export default AuthLayout