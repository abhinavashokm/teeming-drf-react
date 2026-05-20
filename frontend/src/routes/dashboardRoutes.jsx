import DashboardLayout from "../layouts/DashboardLayout";
import HomePage from "../pages/workspace/HomePage";



const dashboardRoutes = {
    path: '/:workspaceSlug',
    element: <DashboardLayout />,
    children: [
        {
            index: true,
            element: <HomePage />
        }
    ]
}

export default dashboardRoutes