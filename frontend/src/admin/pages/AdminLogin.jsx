import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Layers } from 'lucide-react';
import AuthLogo from '../../components/auth/AuthLogo';
import AdminFormField from '../components/form/AdminFormField';
import AdminInputField from '../components/form/AdminInputField';
import AdminButton from '../components/form/AdminButton';
import { useForm } from 'react-hook-form';
import AdminPasswordInput from '../components/form/AdminPasswordInput';
import { Link } from 'react-router-dom';
import { validations } from '../../utils/validations';
import { useAdminLogin } from '../hooks/auth/useAdminLogin';

export default function AdminLogin() {

  const testMode = true
  const { register, handleSubmit, formState: { errors } } = useForm(testMode && {
    defaultValues: {
      email: "teemingadmin@yopmail.com",
      password: 'passwordA1'
    }
  })

  const { mutate: adminLogin, isPending: isLoginPending } = useAdminLogin()

  const handleLogin = (data) => {
    adminLogin(data)
  }
  console.log("hii")

  return (
    <div className="min-h-screen bg-[#E9E9E9] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-[380px] flex flex-col gap-6">

        {/* Background+Shadow Container */}
        <div className="bg-white rounded-[10px] shadow-[0_8px_10px_-6px_rgba(0,0,0,0.1),0_20px_25px_-5px_rgba(0,0,0,0.1)] p-8 pb-12 flex flex-col gap-[31px]">

          <div className="flex flex-col items-center w-full">

            <AuthLogo />

            <div className="flex flex-col gap-1 w-full items-center text-center">
              <h1 className="font-bold text-[18px] leading-[27px] text-[#1A1A2E]">
                Admin Sign In
              </h1>
              <p className="text-[12px] leading-[18px] text-[#6B7280]">
                Restricted access only
              </p>
            </div>
          </div>

          <form className="flex flex-col gap-[19px] w-full" onSubmit={(e) => e.preventDefault()}>

            <AdminFormField label="Email" error={errors.email}>
              <AdminInputField
                icon={Mail}
                type="email"
                placeholder="Enter email"
                {...register("email", validations.email)}
              />
            </AdminFormField>

            <AdminFormField label="Password" className="pb-[9px]">
              <AdminPasswordInput
                icon={Lock}
                placeholder="Enter password"
                error={errors.password}
                {...register("password", validations.password)}
              />
            </AdminFormField>

            <AdminButton
              onClick={handleSubmit(handleLogin)}
              disabled={isLoginPending}
              loading={isLoginPending}
            >
              Sign in
            </AdminButton>

          </form>

        </div>

        <div className="text-center w-full">
          <p className="text-[12px] leading-[18px] text-[#9CA3AF]">
            Not an admin? <Link to="/" className="font-medium text-[#1D9E75] hover:text-[#15825f] transition-colors">Go to app &rarr;</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
