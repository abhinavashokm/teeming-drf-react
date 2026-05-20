import api from "../api/axios";


export const workspaceService = {

    getMyWorkspaces: async () => {
        const res = await api.get("/workspaces/session/")
        return res.data
    },

    createWorkspace: async (data) => {
        const res = await api.post("/workspaces/", data)
        return res.data
    },

    getWorkspaceHome: async (slug) => {
        const res = await api.get(`/workspaces/${slug}/home/`)
        return res.data
    }

}