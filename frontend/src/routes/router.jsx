import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/home/HomePage";
import AppLayout from "../layouts/AppLayout";
import PublicRoute from "./guards/PublicRoute";
import ProtectedRoute from "./guards/ProtectedRoute";
import authRoutes from "./authRoutes";
import workspaceRoutes from "./workspaceRoutes";
import CreateWorkspacePage from "../pages/workspace/CreateWorkspacePage";
import AcceptInvitationPage from "../pages/invite/AcceptInvitePage";
import SetupLayout from "../layouts/SetupLayout";


const router = createBrowserRouter([
    {
        element: <AppLayout />,
        children: [
            {
                element: <PublicRoute />,
                children: [{
                    path: "auth",
                    ...authRoutes
                }, {
                    element: <SetupLayout />,
                    children: [
                        {
                            element: <AcceptInvitationPage />,
                            path: "invite"
                        }]
                }]
            },
            {
                element: <ProtectedRoute />,
                children: [{
                    ...workspaceRoutes,
                }, {
                    element: <SetupLayout />,
                    children: [
                        {
                            element: <CreateWorkspacePage />,
                            path: "create-workspace"
                        }
                    ]
                }

                ]
            }

        ]

    }
])


export default router