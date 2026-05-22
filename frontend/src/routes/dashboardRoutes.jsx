import WorkspaceLayout from "../layouts/WorkspaceLayout";
import HomePage from "../pages/workspace/HomePage";



const dashboardRoutes = {
    path: '/w/:workspaceSlug',
    element: <WorkspaceLayout />,
    children: [
        {
            index: true,
            element: <HomePage />
        }
    ]
}

export default dashboardRoutes