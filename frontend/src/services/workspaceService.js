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

    getWorkspaceHome: async (slug) => {
        const res = await api.get(`/workspaces/${slug}/home/`)
        return res.data
    },

}