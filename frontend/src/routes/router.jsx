import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import SetupLayout from "../layouts/SetupLayout";
import AcceptInvitationPage from "../pages/invite/AcceptInvitePage";
import CreateWorkspacePage from "../pages/workspace/CreateWorkspacePage";
import authRoutes from "./authRoutes";
import ProtectedRoute from "./guards/ProtectedRoute";
import PublicRoute from "./guards/PublicRoute";
import workspaceRoutes from "./workspaceRoutes";


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