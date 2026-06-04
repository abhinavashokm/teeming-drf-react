import WorkspaceLayout from "../layouts/WorkspaceLayout";
import GoalDashboard from "../pages/goal/GoalDashboard";
import HomePage from "../pages/workspace/HomePage";
import ManageTeamPage from "../pages/workspace/ManageTeamPage";
import MyAccountPage from "../pages/workspace/MyAccountPage";
import WorkspaceSettingsPage from "../pages/workspace/WorkspaceSettingsPage";



const workspaceRoutes = {
    element: <WorkspaceLayout />,
    children: [
        {
            index: true,
            element: <HomePage />
        },{
            path:'manage-team',
            element: <ManageTeamPage/>
        },{
            path: 'my-account',
            element: <MyAccountPage/>
        },{
            path: 'settings',
            element: <WorkspaceSettingsPage/>
        },{
            path: 'goals',
            element: <GoalDashboard />
        }
    ]
}

export default workspaceRoutes