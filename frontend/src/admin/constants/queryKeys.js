export const ADMIN_QUERY_KEYS = {
    USERS: ['admin', 'users'],
    USER_DETAIL: (userId) => ['admin', 'users', userId],
    WORKSPACES: ['admin', 'workspaces'],
    PLANS: ['admin', 'plans'],
    TRANSACTIONS: ['admin', 'transactions'],
    BILLING_OVERVIEW: ['admin', "billing-overview"],
}
