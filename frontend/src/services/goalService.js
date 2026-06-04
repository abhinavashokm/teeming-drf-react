import api from "../api/axios";


export const goalService = {

    createGoal: async (slug, data) => {
        const res = await api.post(`/workspaces/${slug}/goals/`, data)
        return res.data
    },

    fetchAllGoals: async (slug) => {
        const res = await api.get(`/workspaces/${slug}/goals/`)
        return res.data
    },

    fetchGoal: async (slug, goalId) => {
        const res = await api.get(`/workspaces/${slug}/goals/${goalId}`)
        return res.data
    },

    updateGoal: async (slug, goalId, data) => {
        const res = await api.patch(`/workspaces/${slug}/goals/${goalId}/`, data)
        return res.data
    },

    deleteGoal: async (slug, goalId) => {
        const res = await api.delete(`/workspaces/${slug}/goals/${goalId}/`)
        return res.data
    },

    starGoal: async (slug, goalId) => {
        console.log("bro")
        const res = await api.post(`/workspaces/${slug}/goals/${goalId}/star/`)
        return res.data
    },

    unStarGoal: async (slug, goalId) => {
        const res = await api.delete(`/workspaces/${slug}/goals/${goalId}/star/`)
        return res.data
    },

}