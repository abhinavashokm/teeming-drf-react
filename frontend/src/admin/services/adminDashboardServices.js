import api from "../../api/axios"

export const dashboardServices = {
    adminGetDashboardSummary: async () => {
        const res = await api.get('/admin/dashboard/summary/')
        return res.data
    }

}