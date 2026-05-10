import { useRef, useState } from "react";
import AuthLogo from "../../components/auth/AuthLogo";
import { Link } from "react-router-dom";
import AuthButton from "../../components/auth/AuthButton";

function VerifyOTPPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const inputRefs = useRef([]);

  const handleChange = (value, index) => {
    if (!/^[a-zA-Z0-9]?$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;

    setOtp(updatedOtp);

    // Move to next input
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Move to previous input on backspace
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pastedData = e.clipboardData
      .getData("text")
      .slice(0, otp.length)
      .replace(/[^a-zA-Z0-9]/g, "");

    if (!pastedData) return;

    const updatedOtp = [...otp];

    pastedData.split("").forEach((char, index) => {
      updatedOtp[index] = char;
    });

    setOtp(updatedOtp);

    const focusIndex =
      pastedData.length >= otp.length
        ? otp.length - 1
        : pastedData.length;

    inputRefs.current[focusIndex]?.focus();
  };

  const handleVerify = () => {
    const otpCode = otp.join("");

    console.log("OTP:", otpCode);

    // API call here
  };

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
          <div className="text-[14px] leading-relaxed text-teeming-gray text-center px-4">
            Enter the code we sent to{" "}
            <span className="text-teeming-text-dark font-bold">
              arjun@acmecorp.com
            </span>
          </div>
        </div>

        {/* Form & Actions Section */}
        <div className="flex flex-col items-stretch w-full mt-8 gap-0">

          {/* OTP Inputs */}
          <div className="flex flex-row justify-center gap-2 sm:gap-3 w-full pb-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                autoFocus={index === 0}
                onChange={(e) =>
                  handleChange(e.target.value, index)
                }
                onKeyDown={(e) =>
                  handleKeyDown(e, index)
                }
                onPaste={handlePaste}
                className="w-[46px] h-[54px] sm:w-[52px] sm:h-[60px] bg-white border border-teeming-border rounded-[10px] text-center text-xl sm:text-[22px] font-bold text-teeming-text-dark focus:outline-none focus:ring-1 focus:ring-teeming-green focus:border-teeming-green transition-all shadow-[0_0_8px_0_rgba(29,158,117,0.0)] focus:shadow-[0_0_8px_0_rgba(29,158,117,0.15)]"
              />
            ))}
          </div>

          {/* Verify Button */}
          <div className="w-full pb-6">
            <AuthButton>
              Verify
            </AuthButton>
          </div>

          {/* Resend / Logout Links */}
          <div className="w-full flex justify-center items-center flex-wrap gap-1.5">

            <span className="text-teeming-gray text-[14px] leading-[21px]">
              Don't see a code?
            </span>

            <button className="text-teeming-green font-medium text-[14px] leading-[21px] hover:underline focus:outline-none">
              Resend code
            </button>

            <span className="text-teeming-gray text-[14px] leading-[21px] px-0.5">
              or
            </span>

            <Link to={"/auth/login"} className="text-teeming-green font-medium text-[14px] leading-[21px] hover:underline focus:outline-none">
              Logout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyOTPPage;