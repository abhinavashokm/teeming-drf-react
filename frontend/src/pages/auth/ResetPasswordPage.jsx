import { useForm } from "react-hook-form"
import AuthLogo from "../../components/auth/AuthLogo"
import PasswordInput from "../../components/auth/PasswordInput"
import AuthButton from "../../components/auth/AuthButton"
import { useSearchParams } from "react-router-dom"
import { useDispatch } from "react-redux"
import { resetPassword } from "../../store/slices/authSlice"


function ResetPasswordPage() {

    const { register, handleSubmit, formState: { errors } } = useForm()

    const dispatch = useDispatch()

    const [searchParams] = useSearchParams()
    const reset_token = searchParams.get('token')

    const handleResetPassword = ({ password }) => {
        try {
            dispatch(resetPassword({ password, reset_token }))
        } catch { }

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
                            Create a new password!
                        </h1>
                    </div>

                    {/* Subtitle */}
                    <div className="text-[13px] leading-5 text-[#64748B] text-center mt-1">
                        For security reasons, you will be logged out of all devices after
                        password is changed.
                    </div>
                </div>

                {/* Form & Actions Section */}
                <form onSubmit={handleSubmit(handleResetPassword)} className="flex flex-col items-stretch w-full mt-[40px] gap-4">

                    <PasswordInput placeholder={"Enter password"} autocomplete="new-password"
                        {...register('password')} error={errors.password}
                    />

                    <PasswordInput placeholder={"Confirm password"} autocomplete="new-password"
                        {...register('confirmPassword')} error={errors.confirmPassword}
                    />

                    {/* Create Password Button */}
                    <div className="pt-2 w-full">
                        <AuthButton>
                            Create Password
                        </AuthButton>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ResetPasswordPage