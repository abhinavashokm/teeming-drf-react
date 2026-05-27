import api from "../api/axios";


export const goalService = {

    createGoal: async (data, slug) => {
        const res = await api.post(`/workspaces/${slug}/goals/`, data)
        return res.data
    },

    updateGoal: async (data, goalId, slug) => {
        const res = await api.patch(`/workspaces/${slug}/goals/${goalId}/`, data)
        return res.data
    },

    fetchAllGoals: async (slug) => {
        const res = await api.get(`/workspaces/${slug}/goals/`)
        return res.data
    },

    deleteGoal: async (goalId, slug) => {
        const res = await api.delete(`/workspaces/${slug}/goals/${goalId}/`)
        return res.data
    },

}