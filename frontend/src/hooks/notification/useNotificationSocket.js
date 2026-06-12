import { useEffect, useState } from "react";
import { connectNotificationSocket } from "../../services/websocket";
import useWorkspaceSlug from "../params/useWorkspaceSlug";

export function useNotificationSocket() {
    const [notifications, setNotifications] = useState([]);
    const workspaceSlug = useWorkspaceSlug()

    useEffect(() => {
        if (!workspaceSlug) return;

        const socket = connectNotificationSocket(workspaceSlug, {
            onMessage: (data) => {
                if (data.type === 'send_notification') {
                    setNotifications(prev => [data, ...prev])
                }
            }
        })

        return () => {
            socket.onclose = null; // prevent log on intentional close
            socket.close();
        };
    }, [workspaceSlug]);

    return { notifications };
}