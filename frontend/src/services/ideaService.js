import api from "../api/axios";


export const ideaService = {
    addIdea: async (slug, goalId, data) => {
        const res = await api.post(`/workspaces/${slug}/goals/${goalId}/ideas/`, data)
        return res.data
    },

    fetchIdeas: async (slug, goalId) => {
        const res = await api.get(`/workspaces/${slug}/goals/${goalId}/ideas/`)
        return res.data
    },

    updateIdea: async (slug, ideaId, data) => {
        const res = await api.patch(`/workspaces/${slug}/ideas/${ideaId}/`, data)
        return res.data
    },

    deleteIdea: async (slug, ideaId) => {
        const res = await api.delete(`/workspaces/${slug}/ideas/${ideaId}/`)
        return res.data
    },

    moveIdeaToProgress: async (slug, ideaId) => {
        const res = await api.post(`/workspaces/${slug}/ideas/${ideaId}/move-progress/`)
        return res.data
    },

    moveIdeaToDone: async (slug, ideaId, data) => {
        const res = await api.post(`/workspaces/${slug}/ideas/${ideaId}/move-done/`, data)
        return res.data
    },

    moveIdeaToPlanned: async (slug, ideaId, data) => {
        const res = await api.post(`/workspaces/${slug}/ideas/${ideaId}/move-planned/`, data)
        return res.data
    },

    likeIdea: async (slug, ideaId) => {
        const res = await api.post(`/workspaces/${slug}/ideas/${ideaId}/like/`)
        return res.data
    },

    unlikeIdea: async (slug, ideaId) => {
        const res = await api.delete(`/workspaces/${slug}/ideas/${ideaId}/like/`)
        return res.data
    },

}