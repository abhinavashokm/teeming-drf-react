import { useQuery } from '@tanstack/react-query'
import { ADMIN_QUERY_KEYS } from '../../constants/queryKeys'
import { adminBillingServices } from '../../services/adminBillingServices'

function useRevenue({ start, end } = {}) {
    return useQuery({
        queryKey: [...ADMIN_QUERY_KEYS.BILLING_REVENUE, { start, end }],
        queryFn: async () => {
            const res = await adminBillingServices.adminGetRevenueTrend({ start, end })
            return res.data
        },
    })
}

export default useRevenue