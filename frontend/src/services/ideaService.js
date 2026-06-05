import api from "../api/axios";


export const ideaService = {
    addIdea: async (slug, goalId, data) => {
        const res = await api.post(`/workspaces/${slug}/goals/${goalId}/ideas/`, data)
        return res.data
    },
}