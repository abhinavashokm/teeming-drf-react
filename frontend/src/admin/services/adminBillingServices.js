import api from "../../api/axios"

export const adminBillingServices = {
    adminListTransactions: async ({ year = 'all', month = 'all', search = '' } = {}) => {
        const res = await api.get('/admin/transactions/', {
            params: { year, month, search },
        })
        return res.data
    },

    adminGetBillingOverview: async () => {
        const res = await api.get('/admin/billing-overview/')
        return res.data
    },

}