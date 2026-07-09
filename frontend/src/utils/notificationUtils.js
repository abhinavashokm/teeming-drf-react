import { ROUTE_PATHS } from '../constants/routePaths'

export function resolveNotificationLink(notification, workspaceSlug) {
    switch (notification.notificationType) {
        case 'board_related':
            return ROUTE_PATHS.GOAL_DASHBOARD(workspaceSlug, notification.targetId);
        case 'outcome_related':
            return ROUTE_PATHS.GOAL_DASHBOARD(workspaceSlug, notification.targetId);
        case 'team_related':
            return ROUTE_PATHS.MANAGE_TEAM(workspaceSlug);
        default:
            return null;
    }
}