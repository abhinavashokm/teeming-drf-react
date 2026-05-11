
function AuthButton({children, type='submit', ...props}) {
    return (
        <button {...props} className="w-full py-[10px] bg-teeming-green hover:bg-emerald-600 rounded-lg shadow-sm transition-colors flex justify-center items-center">
            <span className="text-white font-medium text-[14px] leading-5 tracking-wide">
                {children}
            </span>
        </button>
    )
}

export default AuthButton