import api from "../api/axios";


export const notificationService = {
    fetchNotifications: async (slug) => {
        const res = await api.get(`/workspaces/${slug}/notifications/`)
        return res.data
    },
    markAllAsRead: async (slug) => {
        const res = await api.patch(`/workspaces/${slug}/notifications/`)
        return res.data
    },
    clearAll: async (slug) => {
        const res = await api.delete(`/workspaces/${slug}/notifications/`)
        return res.data
    },
    markAsRead: async (slug, notificationId) => {
        const res = await api.patch(`/workspaces/${slug}/notifications/${notificationId}/`)
        return res.data
    },
}