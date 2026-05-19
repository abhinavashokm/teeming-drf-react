import api from "../api/axios";


export const workspaceService = {

    getMyWorkspaces: async () => {
        const res = await api.get("/workspaces/me/")
        return res.data
    }

}