// services/adminWorkspaceServices.js

import api from "../../api/axios"

export const adminWorkspaceService = {

    adminListWorkspaces: async ({ search = '', status = 'All', plan = 'All', page = 1 }) => {
        const res = await api.get('/admin/workspaces/', {
            params: {
                search,
                ...(status !== 'All' && { status: status.toLowerCase() }),
                ...(plan !== 'All' && { plan: plan.toLowerCase() }),
                page,
            }
        })
        return res.data
    },

    adminGetWorkspaceDetails: async (workspaceId) => {
        const res = await api.get(`/admin/workspaces/${workspaceId}/`)
        return res.data
    },

    adminSuspendWorkspace: async (workspaceId) => {
        const res = await api.patch(`/admin/workspaces/${workspaceId}/suspend/`)
        return res.data
    },

}