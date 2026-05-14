import api from "../api/axios";


const authService = {
    login: async (data) => {
        const res = await api.post('/auth/login/', data)
        return res.data
    },

    signup: async (data) => {
        const res = await api.post('/auth/register/', data)
        return res.data
    },

    verifyOTP: async (data) => {

        const res = await api.post('/auth/verify-otp/', data)
        return res.data
    },

    forgotPassword: async (data) => {

        const res = await api.post('/auth/forgot-password/', data)
        return res.data
    },

    resetPassword: async (data) => {

        const res = await api.post('/auth/reset-password/', data)
        return res.data
    },

    resendOTP: async (data) => {

        const res = await api.post('/auth/resend-otp/', data)
        return res.data
    },

    refresh: async () => {

        const res = await api.post('/auth/refresh/')
        return res.data
    },

    getUser: async () => {

        const res = await api.get("/auth/me/")
        return res.data
    },
}

export default authService
