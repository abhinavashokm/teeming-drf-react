import api from "../../api/axios"

export const adminPlanService = {

    adminListPlans: async () => {
        const res = await api.get('/admin/plans/')
        return res.data
    },

    createPlan: async (data) => {
        const res = await api.post('/admin/plans/', data)
        return res.data
    },

    suspendPlan: async (planId) => {
        const res = await api.post(`/admin/plans/${planId}/archive/`)
        return res.data
    },

    restorePlan: async (planId) => {
        const res = await api.post(`/admin/plans/${planId}/restore/`)
        return res.data
    },

    updatePlan: async (planId, data) => {
        const res = await api.patch(`/admin/plans/${planId}/`, data)
        return res.data
    },

    updateFreePlan: async (data) => {
        const res = await api.patch('/admin/plans/free/', data)
        return res.data
    },

    createNewPlanVersion: async (planId, data) => {
        const res = await api.post(`/admin/plans/${planId}/new-version/`, data)
        return res.data
    },

}
