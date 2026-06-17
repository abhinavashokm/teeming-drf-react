import api from "../api/axios";


export const aiService = {

    improveIdea: async (slug, goalId, data) => {
        const res = await api.post(`/workspaces/${slug}/goals/${goalId}/ai/improve-idea/`, data)
        return res.data
    },

    aiAssistant: async (slug, goalId, data) => {
        const res = await api.post(`/workspaces/${slug}/goals/${goalId}/ai/assistant/`, data)
        return res.data
    },

}