import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import AuthButton from '../../components/auth/AuthButton'
import AuthDivider from '../../components/auth/AuthDivider'
import AuthFormError from '../../components/auth/AuthFormError'
import AuthInput from '../../components/auth/AuthInput'
import AuthLogo from '../../components/auth/AuthLogo'
import GoogleLogin from '../../components/auth/GoogleLogin'
import PasswordInput from '../../components/auth/PasswordInput'
import { useSignup } from '../../hooks/auth/useSignup'
import { getErrorMsg } from '../../utils/errorHandler'
import { validations } from '../../utils/validations'


function SignupPage() {

    const testMode = true

    const { handleSubmit, register, formState: { errors } } = useForm(testMode && {
        defaultValues: {
            fullName: 'Arjun Kumar',
            email: 'arjunraj@gmail.com',
            password: 'passwordA1'
        }
    })

    const { mutate: signup, isPending, error:signupError, isError } = useSignup()

    const handleSignup = async (data) => {
        signup(data)
    }
    

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

                        <GoogleLogin />

                        {/* Divider */}
                        <AuthDivider />

                        {/* Inputs & Signup Button */}
                        <form onSubmit={handleSubmit(handleSignup)} className="flex flex-col items-stretch w-full pb-2 gap-[14px]" noValidate>

                            {
                                isError &&
                                <AuthFormError error={getErrorMsg(signupError)} />
                            }


                            {/* Full Name Input */}
                            <AuthInput type="text" placeholder={"Full name"} autoComplete={'name'}
                                {...register('fullName', validations.fullName)} error={errors.fullName} />

                            {/* Email Input */}
                            <AuthInput type={"email"} placeholder={"Work email"} autoComplete={'email'}
                                {...register('email', validations.email)} error={errors.email}
                            />

                            {/* Password Input */}
                            <PasswordInput placeholder={"Password"} autoComplete={'new-password'}
                                {...register('password', validations.password)} error={errors.password} />

                            {/* Sign Up Button */}
                            <div className="pt-[14px] w-full">
                                <AuthButton loading={isPending}>
                                    {
                                        isPending ? "Sending OTP..." : "Sign up with Email"
                                    }
                                    
                                </AuthButton>
                            </div>

                        </form>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-8 w-full flex justify-center">
                <p className="text-teeming-gray text-center text-[13px] leading-[21px]">
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