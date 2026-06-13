import api from "../api/axios";


export const subscriptionService = {
    
    fetchPlans : async (slug) => {
        const res = await api.get(`/workspaces/${slug}/subscriptions`)
        return res.data
    },

    createCheckoutSession : async (slug, data) => {
        const res = await api.post(`/workspaces/${slug}/subscriptions/checkout/`, data)
        return res.data
    }

}