import api from "../../api/axios"

export const adminPlanService = {

    adminListPlans: async () => {
        const res = await api.get('/admin/plans/')
        return res.data
    }

}
