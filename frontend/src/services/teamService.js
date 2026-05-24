import api from "../api/axios"


export const teamService = {

    fetchTeamMembers: async (slug) => {
        const res = await api.get(`/workspaces/${slug}/members/`)
        return res.data
    }

}