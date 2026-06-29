import { useQuery } from '@tanstack/react-query'
import { ADMIN_QUERY_KEYS } from '../../constants/queryKeys'
import { adminBillingServices } from '../../services/adminBillingServices'

function useTransactions({ search = '', year = 'all', month = 'all' } = {}) {
    return useQuery({
        queryKey: [...ADMIN_QUERY_KEYS.TRANSACTIONS, { search, year, month }],
        queryFn: async () => {
            const res = await adminBillingServices.adminListTransactions({ search, year, month })
            return res.data.transactions
        },
    })
}

export default useTransactions