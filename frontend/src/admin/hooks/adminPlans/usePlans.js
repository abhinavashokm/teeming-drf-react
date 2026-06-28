import { useQuery } from '@tanstack/react-query'
import { adminPlanService } from '../../services/adminPlanService'
import { ADMIN_QUERY_KEYS } from '../../constants/queryKeys'

function usePlans() {
    return useQuery({
        queryKey: ADMIN_QUERY_KEYS.PLANS,
        queryFn: async () => {
            const res = await adminPlanService.adminListPlans()
            return res.data
        },
    })
}

export default usePlans
