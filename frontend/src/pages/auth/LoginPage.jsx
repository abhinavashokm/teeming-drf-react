import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation } from 'react-router-dom'
import AuthButton from '../../components/auth/AuthButton'
import AuthDivider from '../../components/auth/AuthDivider'
import AuthFormError from '../../components/auth/AuthFormError'
import AuthInput from '../../components/auth/AuthInput'
import AuthLogo from '../../components/auth/AuthLogo'
import GoogleLogin from '../../components/auth/GoogleLogin'
import PasswordInput from '../../components/auth/PasswordInput'
import { useLogin } from '../../hooks/auth/useLogin'
import { getErrorMsg } from '../../utils/apiParser.js'
import { showSuccess } from '../../utils/toast'
import { validations } from '../../utils/validations'
import useInviteToken from '../../hooks/invite/useInvitationToken'
import useResolveInvitation from '../../hooks/invite/useResolveInvitation'
import FullPageLoader from '../../components/ui/FullPageLoader'


function LoginPage() {

    const { data: invitationDetails, isPending: isResolveTokenPending } = useResolveInvitation()
    const invitationToken = useInviteToken()

    //form handling
    const testMode = true
    const { register, handleSubmit, formState: { errors } } = useForm(testMode && {
        defaultValues: {
            password: 'passwordA1'
        }
    })

    //loging handling
    const { mutate: login, isPending, error, isError } = useLogin()
    const handleLogin = async (data) => {
        login(data)
    }


    //success msg after signup (when redirecting after signup)
    // const toastShown = useRef(false)
    // const location = useLocation()

    // useEffect(() => {
    //     if (location.state?.verified && !toastShown.current) {
    //         showSuccess("Email verified successfully, you can now login")
    //         toastShown.current = true
    //         window.history.replaceState({}, '')
    //     }
    // }, [])

    if (!!invitationToken && isResolveTokenPending) return <FullPageLoader />

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

                        <GoogleLogin />

                        {/* Divider */}
                        <AuthDivider />

                        {/* Inputs & Login Button */}
                        <form onSubmit={handleSubmit(handleLogin)} className="flex flex-col items-stretch w-full pb-2 gap-[14px]">

                            {isError && (
                                <AuthFormError error={getErrorMsg(error, "Login failed")} />
                            )}

                            {/* Email Input */}
                            <AuthInput value={invitationDetails?.invitedEmail} readOnly={!!invitationDetails} type={"email"} placeholder={"Work email"} autoComplete={'email'}
                                {...register('email', validations.email)} error={errors.email} />


                            {/* Password Input */}
                            <PasswordInput placeholder={"Password"} autoComplete={'current-password'}
                                {...register('password', { required: "Password is required" })} error={errors.password} />

                            {/* Login Button Container */}
                            <div className="pt-[14px] w-full">
                                <AuthButton loading={isPending} type={'submit'} >Log In</AuthButton>
                            </div>

                        </form>

                        {/* Forgot Password */}
                        <div className="pt-3 w-full flex justify-center">
                            <Link to={'/auth/forgot-password'} className="text-teeming-green font-medium text-[13px] leading-5 hover:underline">
                                Forgot Password?
                            </Link>
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