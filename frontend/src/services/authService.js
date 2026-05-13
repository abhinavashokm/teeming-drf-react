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
    }
}

export default authService
