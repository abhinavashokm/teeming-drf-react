import api from "../../api/axios"

export const adminUserService = {

    adminListUsers: async ({ search = '', status = 'All', page = 1 }) => {
        const res = await api.get('/admin/users/', {
            params: {
                search,
                ...(status !== 'All' && { status: status.toLowerCase() }),
                page,
            }
        })
        console.log(res.data)
        return res.data
    },

    adminSuspendUser: async (userId) => {
        const res = await api.patch(`/admin/users/${userId}/suspend/`)
        return res.data
    }
}

