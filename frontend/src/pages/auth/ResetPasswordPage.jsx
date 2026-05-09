function ResetPasswordPage() {
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
                <div className="flex flex-col items-stretch w-full mt-[40px] gap-4">

                    {/* Enter Password Input */}
                    <div className="w-full flex flex-col items-stretch gap-1.5">

                        <label className="text-[12px] font-semibold text-[#334155] pl-0.5 uppercase tracking-[0.05em]">
                            Enter Password
                        </label>

                        <div className="relative w-full">

                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full py-3 pl-4 pr-12 bg-white border border-teeming-border rounded-lg text-[14px] text-teeming-text-dark placeholder-[#CBD5E1] focus:outline-none focus:ring-1 focus:ring-teeming-green focus:border-teeming-green transition-all"
                            />

                            <button className="absolute right-1 top-1/2 -translate-y-1/2 p-2 flex items-center justify-center text-teeming-light-gray hover:text-gray-600 transition-colors">

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password Input */}
                    <div className="w-full flex flex-col items-stretch gap-1.5">

                        <label className="text-[12px] font-semibold text-[#334155] pl-0.5 uppercase tracking-[0.05em]">
                            Confirm Password
                        </label>

                        <div className="relative w-full">

                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full py-3 pl-4 pr-12 bg-white border border-teeming-border rounded-lg text-[14px] text-teeming-text-dark placeholder-[#CBD5E1] focus:outline-none focus:ring-1 focus:ring-teeming-green focus:border-teeming-green transition-all"
                            />

                            <button className="absolute right-1 top-1/2 -translate-y-1/2 p-2 flex items-center justify-center text-teeming-light-gray hover:text-gray-600 transition-colors">

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Create Password Button */}
                    <div className="pt-2 w-full">

                        <button className="w-full py-3 bg-teeming-green hover:bg-emerald-600 rounded-lg shadow-sm transition-colors flex justify-center items-center">

                            <span className="text-white font-medium text-[14px] leading-5 tracking-wide">
                                Create Password
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResetPasswordPage