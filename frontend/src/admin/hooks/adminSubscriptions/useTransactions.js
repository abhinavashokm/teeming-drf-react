import { useQuery } from '@tanstack/react-query'
import { ADMIN_QUERY_KEYS } from '../../constants/queryKeys'
import { adminSubscriptionServices } from '../../services/adminSubscriptionServices'

function useTransactions({ search = '', year = 'all', month = 'all' } = {}) {
    return useQuery({
        queryKey: [...ADMIN_QUERY_KEYS.TRANSACTIONS, { search, year, month }],
        queryFn: async () => {
            const res = await adminSubscriptionServices.adminListTransactions({ search, year, month })
            return res.data.transactions
        },
    })
}

export default useTransactions