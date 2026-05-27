import { createBrowserRouter, Navigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import SetupLayout from "../layouts/SetupLayout";
import AcceptInvitationPage from "../pages/invite/AcceptInvitePage";
import CreateWorkspacePage from "../pages/workspace/CreateWorkspacePage";
import authRoutes from "./authRoutes";
import ProtectedRoute from "./guards/ProtectedRoute";
import PublicRoute from "./guards/PublicRoute";
import workspaceRoutes from "./workspaceRoutes";
import SelectWorkspacePage from "../pages/workspace/SelectWorkspacePage";
import ErrorPage from "../pages/error/ErrorPage";
import { errorCodes } from "../constants/errorCodes";

const publicRoutes = {
    element: <PublicRoute />,
    children: [
        { path: "auth", ...authRoutes },
        { path: "/", element: <Navigate to={'/auth/login'} /> }
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
        },
        { path: "error", element: <ErrorPage /> },

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
        children: [publicRoutes, protectedRoutes, acceptInviteRoute, catchPageNotFound]
    }
])

export default router