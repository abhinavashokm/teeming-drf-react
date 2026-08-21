import api from "../api/axios";


export const discussionService = {
    fetchDiscussionHistory: async (slug, goalId, page) => {
        const res = await api.get(`/workspaces/${slug}/goals/${goalId}/discussion?page=${page}`)
        return res.data
    },
}