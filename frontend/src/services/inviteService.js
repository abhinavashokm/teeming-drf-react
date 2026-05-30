import api from "../api/axios"


export const inviteService = {

    //Invite people to the workspace by email.
    sendInvitations: async (slug, data) => {
        const res = await api.post(`/workspaces/${slug}/invitations/`, data)
        return res.data
    },

    fetchPendingInvitations: async (slug) => {
        const res = await api.get(`/workspaces/${slug}/invitations/`)
        return res.data
    },

    cancelInvitation: async (slug, invitation_id) => {
        const res = await api.delete(`/workspaces/${slug}/invitations/${invitation_id}/`)
        return res.data
    },

    //Resolve an invite token and return invitation details.
    resolveInvite: async (token) => {
        const res = await api.get(`/invitations/${token}/`)
        return res.data
    },

    acceptInvitation: async (token) => {
        const res = await api.post(`/invitations/${token}/accept/`)
        return res.data
    },

}