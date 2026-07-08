export const ADMIN_QUERY_KEYS = {
    USERS: ['admin', 'users'],
    USER_DETAIL: (userId) => ['admin', 'users', userId],
    WORKSPACES: ['admin', 'workspaces'],
    WORKSPACE_DETAILS: (workpsaceId) => ['admin', 'workspace', workpsaceId],
    PLANS: ['admin', 'plans'],
    TRANSACTIONS: ['admin', 'transactions'],
    BILLING_OVERVIEW: ['admin', "billing-overview"],
    DASHBOARD_SUMMARY: ['admin', 'dashboard'],
}
