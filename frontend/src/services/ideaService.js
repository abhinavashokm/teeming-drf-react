import api from "../api/axios";


export const ideaService = {
    addIdea: async (slug, goalId, data) => {
        const res = await api.post(`/workspaces/${slug}/goals/${goalId}/ideas/`, data)
        return res.data
    },

    fetchIdeas: async (slug, goalId) => {
        const res = await api.get(`/workspaces/${slug}/goals/${goalId}/ideas/`)
        return res.data
    }
}