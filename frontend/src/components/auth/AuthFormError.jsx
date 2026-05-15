
function AuthFormError({ error }) {

    return (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4 text-red-500 shrink-0"
            >
                <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm9-4.5a.75.75 0 011.5 0v5.25a.75.75 0 01-1.5 0V7.5zm.75 8.25a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z"
                    clipRule="evenodd"
                />
            </svg>

            <p className="text-[13px] font-normal text-rose-500">
                {error}
            </p>
        </div>
    )
}

export default AuthFormError