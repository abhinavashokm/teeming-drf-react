import { elements } from "chart.js";
import AdminLayout from "../admin/layouts/AdminLayout";
import AdminBilling from "../admin/pages/AdminBilling";
import AdminDashboard from "../admin/pages/AdminDashboard";
import AdminLogin from "../admin/pages/AdminLogin";
import AdminPlanSettings from "../admin/pages/AdminPlanSettings";
import AdminUsers from "../admin/pages/AdminUsers";
import AdminWorkspaces from "../admin/pages/AdminWorkspaces";


const adminRoutes = {
    path: "admin",
    children: [{
        path: 'login',
        element: <AdminLogin />
    }, {
        element: <AdminLayout />,
        children: [
            {
                path: 'dashboard',
                element: <AdminDashboard />
            }, {
                path: 'users',
                element: <AdminUsers />
            }, {
                path: "workspaces",
                element: <AdminWorkspaces />
            }, {
                path: "plan-settings",
                element: <AdminPlanSettings />
            }, {
                path: "billing",
                element: <AdminBilling />
            }
        ]
    },]
}

export default adminRoutes