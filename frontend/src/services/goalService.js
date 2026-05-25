import api from "../api/axios";


export const goalService = {

    createGoal: async (data, slug) => {
        const res = await api.post(`/workspaces/${slug}/goals/`, data)
        return res.data
    },

    fetchAllGoals: async (slug) => {
        const res = await api.get(`/workspaces/${slug}/goals/`)
        return res.data
    },

    deleteGoal: async (goal_id, slug) => {
        const res = await api.delete(`/workspaces/${slug}/goals/${goal_id}/`)
        return res.data
    }

}