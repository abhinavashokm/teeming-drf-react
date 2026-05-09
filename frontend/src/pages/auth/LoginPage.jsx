import { Link } from 'react-router-dom'
import GoogleButton from '../../components/auth/GoogleButton'
import AuthInput from '../../components/auth/AuthInput'
import PasswordInput from '../../components/auth/PasswordInput'
import AuthLogo from '../../components/auth/AuthLogo'

function LoginPage() {
    return (
        <>
            <div className="w-full max-w-[400px] px-6 flex flex-col items-center">
                {/* Main Content Area */}
                <div className="w-full flex flex-col items-stretch pb-10">

                    {/* Header Section */}
                    <div className="flex flex-col items-center w-full">

                        {/* Logo */}
                        <AuthLogo />

                        {/* Typography */}
                        <div className="flex flex-col pb-1 text-center">
                            <h1 className="text-teeming-text-dark font-bold text-2xl leading-[34px] -tracking-[0.025em]">
                                Welcome back!
                            </h1>
                        </div>

                        {/* Subtitle */}
                        <div className="text-[14px] leading-relaxed text-teeming-gray text-center px-4">
                            Don't have an account?{" "}
                            <Link to={'/auth/signup'} className="text-teeming-green font-medium hover:underline">
                                Sign up
                            </Link>
                        </div>
                    </div>

                    {/* Form & Actions Section */}
                    <div className="flex flex-col items-stretch w-full mt-6 gap-0">

                        <GoogleButton />

                        {/* Divider */}
                        <div className="flex flex-row items-center w-full py-[22px]">
                            <div className="flex-1 h-px bg-teeming-light-gray opacity-30"></div>

                            <div className="px-4">
                                <span className="text-teeming-light-gray text-[12px]">
                                    or
                                </span>
                            </div>

                            <div className="flex-1 h-px bg-teeming-light-gray opacity-30"></div>
                        </div>

                        {/* Inputs & Login Button */}
                        <div className="flex flex-col items-stretch w-full pb-2 gap-[14px]">

                            {/* Email Input */}
                            <AuthInput type={"email"} placeholder={"Work email"} />

                            {/* Password Input */}
                            <PasswordInput placeholder={"Password"} />

                            {/* Login Button Container */}
                            <div className="pt-[14px] w-full">
                                <button className="w-full py-[10px] bg-teeming-green hover:bg-emerald-600 rounded-lg shadow-sm transition-colors flex justify-center items-center">
                                    <span className="text-white font-medium text-[14px] leading-5 tracking-wide">
                                        Log In
                                    </span>
                                </button>
                            </div>

                        </div>

                        {/* Forgot Password */}
                        <div className="pt-3 w-full flex justify-center">
                            <a
                                href="#"
                                className="text-teeming-green font-medium text-[13px] leading-5 hover:underline"
                            >
                                Forgot Password?
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-8 w-full flex justify-center">
                <a
                    href="#"
                    className="text-teeming-text-light text-[13px] leading-4 hover:underline"
                >
                    Need help?
                </a>
            </div>
        </>
    )
}

export default LoginPage