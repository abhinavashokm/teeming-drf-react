import AuthLayout from "../layouts/AuthLayout";
import LoginPage from "../pages/auth/LoginPage";
import SignupPage from "../pages/auth/SignupPage";
import VerifyOtpPage from "../pages/auth/VerifyOtpPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import ResetLinkSentPage from "../pages/auth/ResetLinkSentPage";
import PasswordResetSuccessPage from "../pages/auth/PasswordResetSuccessPage";



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
            element: <VerifyOtpPage />
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
            element: <ResetLinkSentPage />
        },
        {
            path: 'reset-password-success',
            element: <PasswordResetSuccessPage />
        }
    ]
}

export default authRoutes