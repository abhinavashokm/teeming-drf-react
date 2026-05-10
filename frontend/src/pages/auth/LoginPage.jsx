import { Link } from 'react-router-dom'
import GoogleButton from '../../components/auth/GoogleButton'
import AuthInput from '../../components/auth/AuthInput'
import PasswordInput from '../../components/auth/PasswordInput'
import AuthLogo from '../../components/auth/AuthLogo'
import AuthDivider from '../../components/auth/AuthDivider'
import AuthButton from '../../components/auth/AuthButton'
import { login } from '../../services/authService'
import { useState } from 'react'
import { useForm } from 'react-hook-form'


function LoginPage() {

    const { register, handleSubmit } = useForm()

    const handleLogin = async(data) => {
        try{
            const res_data = await login(data)
            console.log(res_data)
        }catch(error){
            console.log(error.response.data)
        }
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
                    <form onSubmit={handleSubmit(handleLogin)} className="flex flex-col items-stretch w-full mt-6 gap-0">

                        <GoogleButton />

                        {/* Divider */}
                        <AuthDivider />

                        {/* Inputs & Login Button */}
                        <div className="flex flex-col items-stretch w-full pb-2 gap-[14px]">

                            {/* Email Input */}
                            <AuthInput type={"email"} placeholder={"Work email"} {...register('email')} />

                            {/* Password Input */}
                            <PasswordInput placeholder={"Password"} {...register('password')} />

                            {/* Login Button Container */}
                            <div className="pt-[14px] w-full">
                                <AuthButton type={'submit'} >Log In</AuthButton>
                            </div>

                        </div>

                        {/* Forgot Password */}
                        <div className="pt-3 w-full flex justify-center">
                            <Link to={'/auth/forgot-password'} className="text-teeming-green font-medium text-[13px] leading-5 hover:underline">
                                Forgot Password?
                            </Link>
                        </div>

                    </form>
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