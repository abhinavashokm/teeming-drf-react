function ForgotPasswordPage() {
    return (
        <div className="w-full max-w-[440px] px-6 flex flex-col items-center">

            {/* Main Content Area */}
            <div className="w-full flex flex-col items-stretch pb-10">

                {/* Header Section */}
                <div className="flex flex-col items-center w-full">

                    {/* Logo */}
                    <div className="mb-5 flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-teeming-green rounded-xl shadow-sm flex items-center justify-center">
                            <span className="text-white font-bold text-2xl leading-8 -tracking-[0.05em]">
                                <img
                                    src="./logo.png"
                                    alt=""
                                    className="w-6 h-6 object-contain"
                                />
                            </span>
                        </div>

                        <span className="font-bold text-[20px] text-[#1E293B] leading-7 tracking-[-0.025em]">
                            Teeming
                        </span>
                    </div>

                    {/* Typography */}
                    <div className="flex flex-col pb-1 text-center">
                        <h1 className="text-teeming-text-dark font-bold text-2xl leading-[34px] -tracking-[0.025em]">
                            Forgot your password?
                        </h1>
                    </div>

                    {/* Subtitle */}
                    <div className="text-[14px] leading-relaxed text-teeming-gray text-center px-4">
                        Remember your password?{" "}
                        <a
                            href="login.html"
                            className="text-teeming-green font-medium hover:underline"
                        >
                            Sign in
                        </a>
                    </div>
                </div>

                {/* Form & Actions Section */}
                <div className="flex flex-col items-stretch w-full mt-[40px] gap-0">

                    {/* Email Input */}
                    <div className="w-full flex flex-col items-stretch gap-1.5">

                        <label className="text-[12px] font-semibold text-[#334155] pl-0.5">
                            Email
                        </label>

                        <div className="relative w-full">
                            <input
                                type="email"
                                placeholder="arjun@acmecorp.com"
                                className="w-full py-3 px-4 bg-white border border-teeming-border rounded-lg text-[14px] text-teeming-text-dark placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-teeming-green focus:border-teeming-green transition-all"
                            />
                        </div>
                    </div>

                    {/* Send Link Button */}
                    <div className="pt-6 w-full">
                        <button className="w-full py-3 bg-teeming-green hover:bg-emerald-600 rounded-lg shadow-sm transition-colors flex justify-center items-center">

                            <span className="text-white font-medium text-[14px] leading-5 tracking-wide">
                                Send me the link
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPasswordPage