import { useEffect, useState } from "react";
import { connectWorkspaceSocket } from "../../services/websocket";
import useWorkspaceSlug from "../params/useWorkspaceSlug";
import { useQueryClient } from "@tanstack/react-query";
import useWorkspaceQueryKeys from "../helper/useWorkspaceQueryKeys";

export function useWorkspaceSocket() {
    const [notifications, setNotifications] = useState([]);
    const workspaceSlug = useWorkspaceSlug()
    const queryClient = useQueryClient()
    const workspaceKeys = useWorkspaceQueryKeys()

    useEffect(() => {
        if (!workspaceSlug) return;

        const socket = connectWorkspaceSocket(workspaceSlug, {

            onMessage: (data) => {
                switch (data.type) {

                    case "send_notification":
                        setNotifications((prev) => [data, ...prev]);
                        break;

                    case "presence_update": {
                        //live presence of workspace members
                        console.log(data)
                        queryClient.setQueryData(
                            workspaceKeys.onlineMembers,
                            (old = []) => {
                                if (data.status === "online") {
                                    if (old.includes(data.userId)) return old;
                                    return [...old, data.userId];
                                }
                                return old.filter((id) => id !== data.userId);
                            }
                        );
                        break;
                    }

                    default:
                        break;
                }
                // if (data.type === 'send_notification') {
                //     setNotifications(prev => [data, ...prev])
                // }
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