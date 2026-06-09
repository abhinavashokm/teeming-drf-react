import api from "../api/axios";


export const notificationService = {
    fetchNotifications: async (slug) => {
        const res = await api.get(`/workspaces/${slug}/notifications/`)
        return res.data
    },
    markAsRead: (slug, notification_id) => {
        api.patch(`/workspaces/${slug}/notifications/${notification_id}/`)
    },
    markAllAsRead: (slug) => {
        api.patch(`/workspaces/${slug}/notifications/mark-all-read/`)
    },
}