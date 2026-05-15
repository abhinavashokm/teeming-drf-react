import PasswordChangedPage from "../../../pages/auth/PasswordChangedPage"
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

const ResetSuccessGuard = () => {
    const success = useSelector(state => state.auth.passwordResetSuccess)
    if (!success) return <Navigate to="/auth/forgot-password" replace />
    return <PasswordChangedPage />
}

export default ResetSuccessGuard