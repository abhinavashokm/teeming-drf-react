import { useQuery } from '@tanstack/react-query'
import { ADMIN_QUERY_KEYS } from '../../constants/queryKeys'
import { dashboardServices } from '../../services/adminDashboardServices'

function useDashboardSummary() {
    return useQuery({
        queryKey: ADMIN_QUERY_KEYS.DASHBOARD_SUMMARY,
        queryFn: async () => {
            const res = await dashboardServices.adminGetDashboardSummary()
            return res.data
        },
    })
}

export default useDashboardSummary
