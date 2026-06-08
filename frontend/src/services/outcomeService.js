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

    deleteMetric: async (slug, metricId) => {
        const res = await api.delete(`/workspaces/${slug}/outcome/metrics/${metricId}/`)
        return res.data
    },

}