import AuthLayout from "../layouts/AuthLayout";
import LoginPage from "../pages/auth/LoginPage";
import SignupPage from "../pages/auth/SignupPage";
import VerifyOTPPage from "../pages/auth/VerifyOTPPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import ResetPasswordSentPage from "../pages/auth/ResetPasswordSentPage";
import PasswordChangedPage from "../pages/auth/PasswordChangedPage";
import ResetSuccessGuard from "./guards/auth/ResetSuccessGuard";



const authRoutes = {
    element: <AuthLayout />,
    children: [
        {
            path: 'login',
            element: <LoginPage />
        },
        {
            path: 'signup',
            element: <SignupPage />
        },
        {
            path: 'verify-otp',
            element: <VerifyOTPPage />
        },
        {
            path: 'forgot-password',
            element: <ForgotPasswordPage />
        },
        {
            path: 'reset-password',
            element: <ResetPasswordPage />
        },
        {
            path: 'reset-password-sent',
            element: <ResetPasswordSentPage />
        },
        {
            path: 'reset-password-success',
            element: <ResetSuccessGuard />
        }
    ]
}

export default authRoutes