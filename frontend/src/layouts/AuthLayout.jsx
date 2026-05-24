import { Outlet } from "react-router-dom";


function AuthLayout() {
    
    return (
        <div className="min-h-screen w-full flex flex-col justify-center items-center relative overflow-hidden font-sans shell-bg">
            <Outlet />
        </div>
    )
}

export default AuthLayout