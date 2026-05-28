import { Link, useLocation, useNavigate } from "react-router-dom"
import AuthLogo from "../../components/auth/AuthLogo"
import { useEffect } from "react"
import { ROUTE_PATHS } from "../../constants/routePaths"

function ResetLinkSentPage() {

    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if (!location.state?.fromForgotPassword) {
            navigate(ROUTE_PATHS.LOGIN, { replace: true })
        }
    }, [])

    if (!location.state?.fromForgotPassword) return null

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
                        <h1 className="text-teeming-text-dark font-bold text-xl sm:text-2xl leading-[34px] -tracking-[0.025em]">
                            Recovery link sent!
                        </h1>
                    </div>

                    {/* Subtitle */}
                    <div className="text-[13px] text-[#64748B] text-center mt-1">
                        Remember password? {" "}

                        <Link to={ROUTE_PATHS.LOGIN} className="text-[#3B82F6] font-medium hover:underline" >
                            Sign in
                        </Link>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResetLinkSentPage