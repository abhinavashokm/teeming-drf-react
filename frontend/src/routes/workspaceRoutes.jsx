import GoalDashboardLayout from "../layouts/GoalDashboardLayout";
import WorkspaceLayout from "../layouts/WorkspaceLayout";
import GoalDashboard from "../pages/goal/GoalDashboard";
import SubscriptionFailedPage from "../pages/subscription/SubscriptionFailedPage";
import SubscriptionPage from "../pages/subscription/SubscriptionPage";
import SubscriptionSuccessPage from "../pages/subscription/SubscriptionSuccessPage";
import HomePage from "../pages/workspace/HomePage";
import ManageTeamPage from "../pages/workspace/ManageTeamPage";
import MyAccountPage from "../pages/workspace/MyAccountPage";
import WorkspaceSettingsPage from "../pages/workspace/WorkspaceSettingsPage";



const workspaceRoutes = {
    element: <WorkspaceLayout />,
    children: [
        {
            index: true,
            element: <HomePage />,
            handle: { breadcrumb: 'Home' }
        }, {
            path: 'manage-team',
            element: <ManageTeamPage />,
            handle: { breadcrumb: 'Manage Team' }
        }, {
            path: 'my-account',
            element: <MyAccountPage />,
            handle: { breadcrumb: 'My Account' }
        }, {
            path: 'settings',
            element: <WorkspaceSettingsPage />,
            handle: { breadcrumb: 'Settings' }
        }, {
            path: 'upgrade-plan',
            element: <SubscriptionPage />,
            handle: { breadcrumb: "Upgrade plan" }
        },
        {
            path: "upgrade-plan/success",
            element: <SubscriptionSuccessPage />,
            handle: { breadcrumb: "Success" }
        }, {
            path: "upgrade-plan/failed",
            element: <SubscriptionFailedPage />,
            handle: { breadcrumb: "Failed" }
        },
        {
            path: 'goals/:goalId',
            element: <GoalDashboardLayout />,
            children: [{
                element: <GoalDashboard />,
                index: true
            }]
        }
    ]
}

export default workspaceRoutes