import { useEffect, useState } from "react";
import { connectWorkspaceSocket } from "../../services/websocket";
import useWorkspaceSlug from "../params/useWorkspaceSlug";

export function useWorkspaceSocket() {
    const [notifications, setNotifications] = useState([]);
    const workspaceSlug = useWorkspaceSlug()

    useEffect(() => {
        if (!workspaceSlug) return;

        const socket = connectWorkspaceSocket(workspaceSlug, {
            onMessage: (data) => {
                if (data.type === 'send_notification') {
                    setNotifications(prev => [data, ...prev])
                }
            },
            onOpen: () => {
                console.log("workspace ws connected!!")
            },
            onClose: () => {
                console.log("workspace ws disconnected!!")
            }
        })

        return () => {
            socket.onclose = null; // prevent log on intentional close
            socket.close();
        };
    }, [workspaceSlug]);

    return { notifications };
}