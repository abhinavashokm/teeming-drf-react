import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import AuthButton from '../../components/auth/AuthButton'
import AuthDivider from '../../components/auth/AuthDivider'
import AuthFormError from '../../components/auth/AuthFormError'
import AuthLogo from '../../components/auth/AuthLogo'
import GoogleLogin from '../../components/auth/GoogleLogin'
import FormField from '../../components/ui/form/FormField.jsx'
import InputField from '../../components/ui/form/InputField.jsx'
import PasswordInput from '../../components/ui/form/PasswordInput.jsx'
import FullPageLoader from '../../components/ui/FullPageLoader'
import { ROUTE_PATHS } from '../../constants/routePaths.js'
import { useLogin } from '../../hooks/auth/useLogin'
import useInviteToken from '../../hooks/invite/useInvitationToken'
import useResolveInvitation from '../../hooks/invite/useResolveInvitation'
import { getErrorMsg } from '../../utils/apiParser.js'
import { validations } from '../../utils/validations'


function LoginPage() {

    const { data: invitationDetails, isPending: isResolveTokenPending } = useResolveInvitation()
    const invitationToken = useInviteToken()

    //form handling
    const testMode = true
    const { register, handleSubmit, formState: { errors } } = useForm(testMode && {
        defaultValues: {
            email: invitationDetails?.invitedEmail ?? null,
        }
    })

    //loging handling
    const { mutate: login, isPending, error, isError } = useLogin()
    const handleLogin = async (data) => {
        login(data)
    }

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
                            <Link to={ROUTE_PATHS.SIGNUP} className="text-teeming-green font-medium hover:underline">
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
                            <FormField error={errors.email} >
                                <InputField size='lg' value={invitationDetails?.invitedEmail} readOnly={!!invitationDetails}
                                    type={"email"} placeholder={"Work email"} autoComplete={'email'}
                                    {...register('email', validations.email)} error={errors.email} />
                            </FormField>


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