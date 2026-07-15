import api from "../../api/axios"

export const adminBillingServices = {
    adminListTransactions: async ({ year = 'all', month = 'all', search = '' } = {}) => {
        const res = await api.get('/admin/transactions/', {
            params: { year, month, search },
        })
        return res.data
    },

    adminGetBillingOverview: async () => {
        const res = await api.get('/admin/billing/revenue/summary/')
        return res.data
    },

    adminGetRevenueTrend: async ({start, end}) => {
        const res = await api.get('/admin/billing/revenue/trend/', {
            params: {start, end}
        })
        return res.data
    },

}