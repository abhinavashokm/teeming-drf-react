import api from "../api/axios";

const authService = {
    login: async (data) => {
        return await api.post('/auth/login/', data)
    },

    signup: async (data) => {
        return await api.post('/auth/register/', data)
    }
}

export default authService
