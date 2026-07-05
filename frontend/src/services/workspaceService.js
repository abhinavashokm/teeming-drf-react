import api from "../api/axios";


export const workspaceService = {

    //get all workspace and last active workspace of user for redirection
    fetchMyWorkspaces: async () => {
        const res = await api.get("/workspaces/session/")
        return res.data
    },

    //initialize workspace on page reload
    fetchWorkspaceBySlug: async (slug) => {
        const res = await api.get(`/workspaces/${slug}/`)
        return res.data
    },

    createWorkspace: async (data) => {
        const res = await api.post("/workspaces/", data)
        return res.data
    },

    updateWorkspace: async (slug, data) => {
        const res = await api.patch(`/workspaces/${slug}/`, data)
        return res.data
    },

    deleteWorkspace: async (slug) => {
        const res = await api.delete(`/workspaces/${slug}/`)
        return res.data
    },

    getWorkspaceHome: async (slug) => {
        const res = await api.get(`/workspaces/${slug}/home/`)
        return res.data
    },

    updateMemberRole: async (slug, data, memberId) => {
        const res = await api.patch(`/workspaces/${slug}/members/${memberId}/`, data)
        return res.data
    },

    removeMember: async (slug, memberId) => {
        const res = await api.delete(`/workspaces/${slug}/members/${memberId}/`)
        return res.data
    },

    leaveWorkspace: async (slug) => {

        const res = await api.delete(`/workspaces/${slug}/members/leave/`)
        return res.data
    },

    createLogoUploadUrl: async (slug, contentType) => {
        const res = await api.post(`/workspaces/${slug}/logo/upload-url/`, { "contentType": contentType })
        return res.data
    },

    //(for saving filekey in the workspace db table)
    saveWorkspaceLogo: async (slug, data) => {
        const res = await api.post(`/workspaces/${slug}/logo/`, data);
        return res.data;
    },

    removeWorkspaceLogo: async (slug) => {
        const res = await api.post(`/workspaces/${slug}/logo/remove/`);
        return res.data;
    },

    fetchOnlineMembers: async (slug) => {
        const res = await api.get(`/workspaces/${slug}/online-members/`);
        return res.data;
    },

}