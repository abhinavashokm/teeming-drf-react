import api from "../../api/axios"

export const adminSubscriptionServices = {
    adminListTransactions: async ({ year = 'all', month = 'all', search = '' } = {}) => {
        const res = await api.get('/admin/transactions/', {
            params: { year, month, search },
        })
        return res.data
    },
}