import { createBrowserRouter, Navigate } from "react-router-dom";
import AdminLayout from "../admin/layouts/AdminLayout";
import AdminBilling from "../admin/pages/AdminBilling";
import AdminDashboard from "../admin/pages/AdminDashboard";
import AdminLogin from "../admin/pages/AdminLogin";
import AdminPlanSettings from "../admin/pages/AdminPlanSettings";
import AdminUsers from "../admin/pages/AdminUsers";
import AdminWorkspaces from "../admin/pages/AdminWorkspaces";
import { errorCodes } from "../constants/errorCodes";
import { ROUTE_PATHS } from "../constants/routePaths";
import AppLayout from "../layouts/AppLayout";
import SetupLayout from "../layouts/SetupLayout";
import ErrorPage from "../pages/error/ErrorPage";
import AcceptInvitationPage from "../pages/invite/AcceptInvitePage";
import CreateWorkspacePage from "../pages/workspace/CreateWorkspacePage";
import SelectWorkspacePage from "../pages/workspace/SelectWorkspacePage";
import authRoutes from "./authRoutes";
import ProtectedRoute from "./guards/ProtectedRoute";
import PublicRoute from "./guards/PublicRoute";
import workspaceRoutes from "./workspaceRoutes";
import adminRoutes from "./adminRoutes";

const publicRoutes = {
    element: <PublicRoute />,
    children: [
        { path: "auth", ...authRoutes },
        { path: "/", element: <Navigate to={ROUTE_PATHS.LOGIN} /> }
    ]
}

const protectedRoutes = {
    element: <ProtectedRoute />,
    children: [
        { path: 'w/:workspaceSlug', ...workspaceRoutes },
        {
            element: <SetupLayout />,
            children: [
                { path: "create-workspace", element: <CreateWorkspacePage /> },
                { path: "workspaces", element: <SelectWorkspacePage /> },
            ]
        }

    ]
}

const acceptInviteRoute = {
    element: <SetupLayout />,
    children: [
        { path: "invite", element: <AcceptInvitationPage /> }
    ]
}

const catchPageNotFound = {
    path: "*",
    element: <ErrorPage type={errorCodes.PAGE_NOT_FOUND} />
}

const router = createBrowserRouter([
    {
        element: <AppLayout />,
        children: [publicRoutes, protectedRoutes, acceptInviteRoute, adminRoutes, catchPageNotFound]
    }
])

export default router