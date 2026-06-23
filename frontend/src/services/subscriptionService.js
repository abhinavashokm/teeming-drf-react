import api from "../api/axios";


export const subscriptionService = {
    
    fetchPlans : async (slug) => {
        const res = await api.get(`/workspaces/${slug}/subscriptions`)
        return res.data
    },

    createCheckoutSession : async (slug, data) => {
        const res = await api.post(`/workspaces/${slug}/subscriptions/checkout/`, data)
        return res.data
    },

    fetchCurrentPlan: async (slug) => {
        const res = await api.get(`/workspaces/${slug}/subscriptions/current/`)
        return res.data
    },

    downgradeToFree: async (slug) => {
        const res = await api.post(`/workspaces/${slug}/subscriptions/downgrade-to-free/`)
        return res.data
    },

    resumeSubscription: async (slug) => {
        console.log("here")
        const res = await api.patch(`/workspaces/${slug}/subscriptions/resume/`)
        console.log(res.data)
        return res.data
    },

}