import GoogleButton from '../../components/auth/GoogleButton'
import { Link } from 'react-router-dom'
import InputField from '../../components/ui/InputField'
import PasswordInput from '../../components/auth/PasswordInput'
import AuthLogo from '../../components/auth/AuthLogo'
import AuthDivider from '../../components/auth/AuthDivider'
import AuthButton from '../../components/auth/AuthButton'


function SignupPage() {
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
                                Seconds to sign up!
                            </h1>
                        </div>

                        {/* Subtitle */}
                        <div className="text-[14px] leading-relaxed text-teeming-gray text-center px-4">
                            Already have an account?{" "}
                            <Link to={'/auth/login'} className="text-teeming-green font-medium hover:underline">
                                Sign in
                            </Link>
                        </div>
                    </div>

                    {/* Form & Actions Section */}
                    <div className="flex flex-col items-stretch w-full mt-6 gap-0">

                        <GoogleButton />

                        {/* Divider */}
                        <AuthDivider />

                        {/* Inputs & Signup Button */}
                        <div className="flex flex-col items-stretch w-full pb-2 gap-[14px]">

                            {/* Full Name Input */}
                            <InputField type="text" placeholder={"Full name"} />

                            {/* Email Input */}
                            <InputField type={"email"} placeholder={"Work email"} />

                            {/* Password Input */}
                            <PasswordInput placeholder={"Password"} />

                            {/* Sign Up Button */}
                            <div className="pt-[14px] w-full">
                                <AuthButton>
                                    <Link to={"/auth/verify-otp"}>
                                        Sign up with Email
                                    </Link>
                                </AuthButton>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-8 w-full flex justify-center">
                <p className="text-teeming-gray text-[13px] leading-[21px]">
                    By continuing, you agree to our{" "}
                    <a
                        href="#"
                        className="text-teeming-green font-medium underline hover:text-emerald-700"
                    >
                        Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                        href="#"
                        className="text-teeming-green font-medium underline hover:text-emerald-700"
                    >
                        Privacy Policy
                    </a>
                </p>
            </div>
        </>
    )
}

export default SignupPage