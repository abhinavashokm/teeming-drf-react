import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/home/HomePage";
import AppLayout from "../layouts/AppLayout";
import PublicRoute from "./guards/PublicRoute";
import ProtectedRoute from "./guards/ProtectedRoute";
import authRoutes from "./authRoutes";
import dashboardRoutes from "./dashboardRoutes";
import CreateWorkspacePage from "../pages/workspace/CreateWorkspacePage";



const router = createBrowserRouter([
    {
        element: <AppLayout />,
        children: [
            {
                element: <PublicRoute />,
                children: [{
                    path: "auth",
                    ...authRoutes
                }]
            },
            {
                element: <ProtectedRoute />,
                children: [{
                    ...dashboardRoutes,
                },{
                     element: <CreateWorkspacePage/>,
                     path: "create-workspace"
                }
                   
                ]
            }

        ]

    }
])


export default router