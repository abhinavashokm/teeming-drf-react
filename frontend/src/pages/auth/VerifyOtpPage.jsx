import { OTPInput, REGEXP_ONLY_DIGITS } from "input-otp";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthButton from "../../components/auth/AuthButton";
import AuthLogo from "../../components/auth/AuthLogo";
import { useResendOtp } from "../../hooks/auth/useResendOtp";
import { useVerifyOtp } from "../../hooks/auth/useVerifyOtp";
import { ROUTE_PATHS } from "../../constants/routePaths";


function verifyOtpPage() {

  const [otp, setOtp] = useState("");

  const verificationEmail = sessionStorage.getItem('verificationEmail')

  const navigate = useNavigate()

  const handleOtpChange = (otp) => {
    setOtp(otp)
    if (otp.length === 6) {
      verifyOtp({ email: verificationEmail, otp })
    }
  }


  const { mutate: verifyOtp, error: otpError, isError, isPending: verifyOtpPending } = useVerifyOtp({ onError: () => setOtp("") })

  const handleVerify = async () => {
    verifyOtp({ email: verificationEmail, otp })
  };



  const { mutate: resendOtp, error: resendOtpError, isPending: resendOtpPending } = useResendOtp()

  const resendOtpHandler = () => {
    setOtp("")
    resendOtp({ email: verificationEmail })
  }


  //safe guard - only show when there is signup session active
  useEffect(() => {

    if (!verificationEmail) {
      navigate(ROUTE_PATHS.SIGNUP, { state: { toast: "Signup session expired or not found!", error: true }, replace: true })
    }

  }, [])


  if (!verificationEmail) return null

  return (
    <div className="w-full max-w-[420px] px-6 flex flex-col items-center">

      {/* Main Content Area */}
      <div className="w-full flex flex-col items-stretch pb-10">

        {/* Header Section */}
        <div className="flex flex-col items-center w-full">

          {/* Logo */}
          <AuthLogo />

          {/* Typography */}
          <div className="flex flex-col pb-1 text-center">
            <h1 className="text-teeming-text-dark font-bold text-2xl leading-[34px] -tracking-[0.025em]">
              Verify your email
            </h1>
          </div>

          {/* Subtitle */}
          <div className="text-[14px] leading-relaxed text-teeming-gray text-center px-4 flex flex-wrap justify-center gap-x-1">
            <span >Enter the code we sent to </span>
            <span className="text-teeming-text-dark font-bold ">{verificationEmail ?? "your email"}</span>
          </div>
        </div>

        {/* Form & Actions Section */}
        <div className="flex flex-col items-stretch w-full mt-8 gap-0">

          {/* OTP Inputs */}
          <div className="flex flex-row justify-center gap-2 sm:gap-3 w-full pb-8">

            <OTPInput
              value={otp}
              autoFocus
              onChange={handleOtpChange}
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS}  // blocks non-digit input
              render={({ slots }) => (

                <div className="flex flex-row justify-center gap-2 sm:gap-3 w-full">
                  {slots.map((slot, index) => (
                    <div
                      key={index}
                      className={`w-[46px] h-[54px] sm:w-[52px] sm:h-[60px] bg-white border rounded-[10px] text-center text-xl sm:text-[22px] font-bold text-teeming-text-dark transition-all flex items-center justify-center
                          ${slot.isActive
                          ? "border-teeming-green ring-1 ring-teeming-green shadow-[0_0_8px_0_rgba(29,158,117,0.15)]"
                          : "border-teeming-border shadow-[0_0_8px_0_rgba(29,158,117,0.0)]"
                        }`}
                    >
                      {slot.char || ""}
                    </div>
                  ))}
                </div>

              )}

            />

          </div>

          {/* Verify Button */}
          <div className="w-full pb-6">
            <AuthButton onClick={handleVerify} loading={verifyOtpPending} disabled={otp.length !== 6}>
              {verifyOtpPending ? "Verifing..." : "Verify"}
            </AuthButton>
          </div>

          {/* Resend / Logout Links */}
          <div className="w-full flex justify-center items-center flex-wrap gap-1.5">

            <span className="text-teeming-gray text-[14px] leading-[21px]">
              Don't see a code?
            </span>

            <button onClick={resendOtpHandler} disabled={resendOtpPending} className="text-teeming-green font-medium text-[14px] leading-[21px] hover:underline focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline">
              {resendOtpPending ? "Resending..." : "Resend code"}
            </button>

            <span className="text-teeming-gray text-[14px] leading-[21px] px-0.5">
              or
            </span>

            <Link
              to={ROUTE_PATHS.LOGIN}
              className="text-teeming-green font-medium text-[14px] leading-[21px] hover:underline focus:outline-none"
            >
              Logout
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
}

export default verifyOtpPage;