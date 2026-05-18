import DashboardLayout from "../layouts/DashboardLayout";
import HomePage from "../pages/workspace/HomePage";



const dashboardRoutes = {
    element: <DashboardLayout />,
    children: [
        {
            path: 'home',
            element: <HomePage />
        }
    ]
}

export default dashboardRoutes