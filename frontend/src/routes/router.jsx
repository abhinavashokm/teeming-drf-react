// router.jsx
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import SetupLayout from "../layouts/SetupLayout";
import AcceptInvitationPage from "../pages/invite/AcceptInvitePage";
import CreateWorkspacePage from "../pages/workspace/CreateWorkspacePage";
import authRoutes from "./authRoutes";
import ProtectedRoute from "./guards/ProtectedRoute";
import PublicRoute from "./guards/PublicRoute";
import workspaceRoutes from "./workspaceRoutes";

const publicRoutes = {
    element: <PublicRoute />,
    children: [
        { path: "auth", ...authRoutes },
        {
            element: <SetupLayout />,
            children: [
                { path: "invite", element: <AcceptInvitationPage /> }
            ]
        }
    ]
}

const protectedRoutes = {
    element: <ProtectedRoute />,
    children: [
        { path: 'w/:workspaceSlug', ...workspaceRoutes },
        {
            element: <SetupLayout />,
            children: [
                { path: "create-workspace", element: <CreateWorkspacePage /> }
            ]
        }
    ]
}

const router = createBrowserRouter([
    {
        element: <AppLayout />,
        children: [publicRoutes, protectedRoutes]
    }
])

export default router