import api from "../api/axios";

export const REFRESH_URL = "/auth/refresh/";

const authService = {

    //login with credentials. if invitation token exist : accept invitation
    login: async (data, invitationToken) => {
        let res
        if (invitationToken) {
            res = await api.post(`/auth/login/?token=${invitationToken}`, data)
        } else {
            res = await api.post('/auth/login/', data)
        }

        return res.data
    },

    //create signup session before verification
    signup: async (data) => {
        const res = await api.post('/auth/register/', data)
        return res.data
    },

    //verify signup using otp and create account
    verifyOTP: async (data, invitationToken) => {
        let res

        if (!invitationToken) {
            res = await api.post('/auth/verify-otp/', data)
        } else {
            res = await api.post(`/auth/verify-otp/?token=${invitationToken}`, data)
        }

        return res.data
    },

    //send password reset link to give email
    forgotPassword: async (data) => {

        const res = await api.post('/auth/forgot-password/', data)
        return res.data
    },

    //reset password
    resetPassword: async (data) => {

        const res = await api.post('/auth/reset-password/', data)
        return res.data
    },

    //resend otp
    resendOTP: async (data) => {

        const res = await api.post('/auth/resend-otp/', data)
        return res.data
    },

    //refresh access token
    refresh: async () => {

        const res = await api.post(REFRESH_URL, {}, {
            _skipInterceptor: true //avoid infinite loop
        })
        return res.data
    },

    //get current user session data
    getCurrentUser: async () => {

        const res = await api.get("/auth/me/")
        return res.data
    },

    //blacklist current refresh token
    logout: async () => {

        const res = await api.post('/auth/logout/')
        return res.data
    },

    //login or signup with google api
    googleLogin: async (data) => {

        const res = await api.post("/auth/social/google/", data)
        return res.data
    },

    //verify password reset token
    validateResetToken: async ({ token }) => {
        const res = await api.get(`/auth/validate-reset-token/?token=${token}`)
        return res.data
    },

    updateUserProfile: async (data) => {
        const res = await api.patch(`/auth/me/`, data)
        return res.data
    }
}

export default authService
