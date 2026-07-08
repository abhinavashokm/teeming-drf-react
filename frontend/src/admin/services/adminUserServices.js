import api from "../../api/axios"

export const adminUserService = {

    adminListUsers: async ({ search = '', status = 'All', joined='', page = 1 }) => {
        const res = await api.get('/admin/users/', {
            params: {
                search,
                joined: joined.toLowerCase(),
                ...(status !== 'All' && { status: status.toLowerCase() }),
                page,
            }
        })
        return res.data
    },

    adminSuspendUser: async (userId) => {
        const res = await api.patch(`/admin/users/${userId}/suspend/`)
        return res.data
    },

    adminGetUserDetails: async (userId) => {
        const res = await api.get(`/admin/users/${userId}/`)
        return res.data
    },
    
}

