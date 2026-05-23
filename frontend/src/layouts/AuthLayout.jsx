import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";


function AuthLayout() {

    const dispatch = useDispatch()
    const location = useLocation()

    
    return (
        <div className="min-h-screen w-full flex flex-col justify-center items-center relative overflow-hidden font-sans shell-bg">
            <Outlet />
        </div>
    )
}

export default AuthLayout