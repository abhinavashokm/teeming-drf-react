import { Outlet } from "react-router-dom";
import logo from '../assets/logo.png'

function AuthLayout() {
    return (
        <div className="min-h-screen w-full flex flex-col justify-center items-center relative overflow-hidden font-sans auth-body">
            <Outlet />
        </div>
    )
}

export default AuthLayout