import { elements } from "chart.js";
import WorkspaceLayout from "../layouts/WorkspaceLayout";
import GoalDashboard from "../pages/goal/GoalDashboard";
import HomePage from "../pages/workspace/HomePage";
import ManageTeamPage from "../pages/workspace/ManageTeamPage";
import MyAccountPage from "../pages/workspace/MyAccountPage";
import WorkspaceSettingsPage from "../pages/workspace/WorkspaceSettingsPage";
import SubscriptionPage from "../pages/workspace/SubscriptionPage";



const workspaceRoutes = {
    element: <WorkspaceLayout />,
    children: [
        {
            index: true,
            element: <HomePage />,
            handle: {breadcrumb: 'Home'}
        },{
            path:'manage-team',
            element: <ManageTeamPage/>,
            handle: {breadcrumb: 'Manage Team'}
        },{
            path: 'my-account',
            element: <MyAccountPage/>,
            handle: {breadcrumb: 'My Account'}
        },{
            path: 'settings',
            element: <WorkspaceSettingsPage/>,
            handle: {breadcrumb: 'Settings'}
        },{
            path: 'upgrade-plan',
            element: <SubscriptionPage />,
            handle: {breadcrumb: "Upgrade plan"}
        },{
            path: 'goals/:goalId',
            element: <GoalDashboard />
        }
    ]
}

export default workspaceRoutes