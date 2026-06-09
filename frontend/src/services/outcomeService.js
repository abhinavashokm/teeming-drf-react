import api from "../api/axios";


export const outcomeService = {
    createMetrics: async (slug, goalId, data) => {
        const res = await api.post(`/workspaces/${slug}/goals/${goalId}/outcome/metrics/`, data)
        return res.data
    },

    fetchMetrics: async (slug, goalId) => {
        const res = await api.get(`/workspaces/${slug}/goals/${goalId}/outcome/metrics/`)
        return res.data
    },

    getMetric: async (slug, metricId) => {
        const res = await api.get(`/workspaces/${slug}/outcome/metrics/${metricId}/`)
        return res.data
    },

    updateMetric: async (slug, metricId, data) => {
        const res = await api.patch(`/workspaces/${slug}/outcome/metrics/${metricId}/`, data)
        return res.data
    },

    deleteMetric: async (slug, metricId) => {
        const res = await api.delete(`/workspaces/${slug}/outcome/metrics/${metricId}/`)
        return res.data
    },

    createCheckin: async (slug, goalId, data) => {
        const res = await api.post(`/workspaces/${slug}/goals/${goalId}/outcome/checkins/`, data)
        return res.data
    },

    fetchCheckins: async (slug, goalId) => {
        const res = await api.get(`/workspaces/${slug}/goals/${goalId}/outcome/checkins/`)
        return res.data
    },

    fetchCheckin: async (slug, checkinId) => {
        const res = await api.get(`/workspaces/${slug}/outcome/checkins/${checkinId}/`)
        return res.data
    },

    updateCheckin: async (slug, checkinId, data) => {
        const res = await api.patch(`/workspaces/${slug}/outcome/checkins/${checkinId}/`,data)
        return res.data
    },

    deleteCheckin: async (slug, checkinId) => {
        const res = await api.delete(`/workspaces/${slug}/outcome/checkins/${checkinId}/`)
        return res.data
    },


}