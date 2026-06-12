import api from "../api/axios";


export const discussionService = {
    fetchDiscussionHistory: async (slug, goalId) => {
        const res = await api.get(`/workspaces/${slug}/goals/${goalId}/discussion/`)
        return res.data
    },
}