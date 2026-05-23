import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { Navigate, useNavigate, useSearchParams } from "react-router-dom"
import AuthButton from "../../components/auth/AuthButton"
import AuthLogo from "../../components/auth/AuthLogo"
import PasswordInput from "../../components/auth/PasswordInput"
import { useResetPassword } from "../../hooks/auth/useResetPassword"
import authService from "../../services/authService"
import { validations } from "../../utils/validations"
import { useValidateResetToken } from "../../hooks/auth/useValidateResetToken"
import FullPageLoader from "../../components/ui/FullPageLoader"
import { getErrorMsg } from "../../utils/apiParser.js"


function ResetPasswordPage() {

    const [searchParams] = useSearchParams()
    const reset_token = searchParams.get('token')

    const { isSuccess, isLoading, isError, error } = useValidateResetToken({token: reset_token})

    const { register, handleSubmit, formState: { errors }, getValues } = useForm()


    const navigate = useNavigate()





    const { mutate: resetPassword, isPending } = useResetPassword()

    const handleResetPassword = async ({ password }) => {
        resetPassword({ token: reset_token, password })
    }

    if (isLoading) return <FullPageLoader />

    if (isError) return (
        <Navigate to="/auth/forgot-password?error=invalid_link"
            state={{ toast: getErrorMsg(error), error: true }}
            replace
        />
    )

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
                    {/* <div className="text-[13px] leading-5 text-[#64748B] text-center mt-1">
                        For security reasons, you will be logged out of all devices after
                        password is changed.
                    </div> */}
                </div>

                {/* Form & Actions Section */}
                <form onSubmit={handleSubmit(handleResetPassword)} className="flex flex-col items-stretch w-full mt-[40px] gap-4">

                    <PasswordInput placeholder={"Enter password"} autocomplete="new-password"
                        {...register('password', validations.password)} error={errors.password}
                    />

                    <PasswordInput placeholder={"Confirm password"} autocomplete="new-password"
                        {...register('confirmPassword', {
                            required: "Confirm password is required",
                            validate: (value) => value === getValues('password') || "Passwords do not match"
                        })} error={errors.confirmPassword}
                    />

                    {/* Create Password Button */}
                    <div className="pt-2 w-full">
                        <AuthButton pending={isPending}>
                            {isPending ? "Creating..." : "Create Password"}
                        </AuthButton>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ResetPasswordPage