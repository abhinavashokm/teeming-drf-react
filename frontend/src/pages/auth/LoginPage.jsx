import { Link } from 'react-router-dom'
import GoogleLogin from '../../components/auth/GoogleLogin'
import AuthInput from '../../components/auth/AuthInput'
import PasswordInput from '../../components/auth/PasswordInput'
import AuthLogo from '../../components/auth/AuthLogo'
import AuthDivider from '../../components/auth/AuthDivider'
import AuthButton from '../../components/auth/AuthButton'
import { useForm } from 'react-hook-form'
import AuthFormError from '../../components/auth/AuthFormError'
import { validations } from '../../utils/validations'
import { useDispatch } from 'react-redux'
import { login } from '../../store/slices/authSlice'
import { useNavigate } from 'react-router-dom'
import { useAuthErrorMsg } from '../../hooks/auth/useAuthErrorMsg'
import { showSuccess } from '../../utils/toast'


function LoginPage() {

    const testMode = false

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { register, handleSubmit, formState: { errors } } = useForm(testMode && {
        defaultValues: {
            email: 'pihoxay220@hidevak.com',
            password: '55555Abhii'
        }
    })


    const handleLogin = async (data) => {
        try {

            await dispatch(login(data)).unwrap()
            showSuccess("login success")
            navigate('/', {replace: true})

        } catch {}
    }

    const authErrorMsg = useAuthErrorMsg()

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

                            {authErrorMsg && (
                                <AuthFormError error={authErrorMsg} />
                            )}

                            {/* Email Input */}
                            <AuthInput type={"email"} placeholder={"Work email"} autoComplete={'email'}
                                {...register('email', validations.email)} error={errors.email} />


                            {/* Password Input */}
                            <PasswordInput placeholder={"Password"} autoComplete={'current-password'}
                                {...register('password', { required: "Password is required" })} error={errors.password} />

                            {/* Login Button Container */}
                            <div className="pt-[14px] w-full">
                                <AuthButton type={'submit'} >Log In</AuthButton>
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