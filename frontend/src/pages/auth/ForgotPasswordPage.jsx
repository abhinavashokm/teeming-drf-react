import { Link } from "react-router-dom"
import AuthLogo from "../../components/auth/AuthLogo"
import AuthInput from "../../components/auth/AuthInput"
import AuthButton from "../../components/auth/AuthButton"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { forgotPassword } from "../../store/slices/authSlice"


function ForgotPasswordPage() {

    const { register, handleSubmit } = useForm()
    const dispatch = useDispatch()

    const handleForgotPassword = ({email}) => {
        try{
            dispatch(forgotPassword({email}))
        }catch{ }
    }

    return (
        <div className="w-full max-w-[440px] px-6 flex flex-col items-center">

            {/* Main Content Area */}
            <div className="w-full flex flex-col items-stretch pb-10">

                {/* Header Section */}
                <div className="flex flex-col items-center w-full">

                    {/* Logo */}
                    <AuthLogo />

                    {/* Typography */}
                    <div className="flex flex-col pb-1 text-center">
                        <h1 className="text-teeming-text-dark font-bold text-2xl leading-[34px] -tracking-[0.025em]">
                            Forgot your password?
                        </h1>
                    </div>

                    {/* Subtitle */}
                    <div className="text-[14px] leading-relaxed text-teeming-gray text-center px-4">
                        Remember your password?{" "}
                        <a
                            href="login.html"

                        >

                        </a>
                        <Link to={'/auth/login'} className="text-teeming-green font-medium hover:underline">Sign in</Link>
                    </div>
                </div>

                {/* Form & Actions Section */}
                <div className="flex flex-col items-stretch w-full mt-[40px] gap-0">

                    {/* Email Input */}
                    <AuthInput type={"email"} {...register('email')} placeholder={"Work email"} />

                    {/* Send Link Button */}
                    <div className="pt-6 w-full">
                        <AuthButton onClick={handleSubmit(handleForgotPassword)}>
                            Send me the link
                        </AuthButton>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ForgotPasswordPage