import api from "../api/axios";


export const subscriptionService = {

    fetchPlans: async (slug) => {
        const res = await api.get(`/workspaces/${slug}/subscriptions`)
        return res.data
    },

    createCheckoutSession: async (slug, data) => {
        const res = await api.post(`/workspaces/${slug}/subscriptions/checkout/`, data)
        return res.data
    },

    fetchCurrentPlan: async (slug) => {
        const res = await api.get(`/workspaces/${slug}/subscriptions/current/`)
        return res.data
    },

    cancelSubscription: async (slug) => {
        const res = await api.post(`/workspaces/${slug}/subscriptions/cancel/`)
        return res.data
    },

    resumeSubscription: async (slug) => {
        console.log("here")
        const res = await api.patch(`/workspaces/${slug}/subscriptions/resume/`)
        console.log(res.data)
        return res.data
    },

    previewUpgrade : async (slug, planId ) => {
        const res = await api.get(`/workspaces/${slug}/subscriptions/upgrade/${planId}/preview/`)
        return res.data
    },

}