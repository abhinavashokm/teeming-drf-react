import WorkspaceLayout from "../layouts/WorkspaceLayout";
import HomePage from "../pages/workspace/HomePage";
import ManageTeamPage from "../pages/workspace/ManageTeamPage";
import MyAccountPage from "../pages/workspace/MyAccountPage";
import WorkspaceSettingsPage from "../pages/workspace/WorkspaceSettingsPage";



const workspaceRoutes = {
    path: 'w/:workspaceSlug',
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
        }
    ]
}

export default workspaceRoutes