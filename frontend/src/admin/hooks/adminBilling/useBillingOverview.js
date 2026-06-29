import { useQuery } from '@tanstack/react-query'
import { ADMIN_QUERY_KEYS } from '../../constants/queryKeys'
import { adminBillingServices } from '../../services/adminBillingServices'

function useBillingOverview() {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.BILLING_OVERVIEW,
    queryFn: async () => {
      const res = await adminBillingServices.adminGetBillingOverview()
      return res.data
    },
  })
}

export default useBillingOverview