import { useEffect, useRef, useState, useCallback } from "react";
import { connectWorkspaceSocket } from "../../services/websocket";
import useWorkspaceSlug from "../params/useWorkspaceSlug";
import { useQueryClient } from "@tanstack/react-query";
import useWorkspaceQueryKeys from "../helper/useWorkspaceQueryKeys";

export function useWorkspaceSocket() {
    const [notifications, setNotifications] = useState([]);
    const workspaceSlug = useWorkspaceSlug();
    const queryClient = useQueryClient();
    const workspaceKeys = useWorkspaceQueryKeys();

    const socketRef = useRef(null);
    const listenersRef = useRef({}); // { [type]: Set<fn> }
    const queueRef = useRef([]); // messages waiting for socket to open

    const subscribe = useCallback((type, callback) => {
        if (!listenersRef.current[type]) {
            listenersRef.current[type] = new Set();
        }
        listenersRef.current[type].add(callback);

        return () => {
            listenersRef.current[type]?.delete(callback);
        };
    }, []);

    const sendJson = useCallback((payload) => {
        const socket = socketRef.current;
        if (socket?.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(payload));
        } else {
            // socket not ready yet (still connecting, or reconnecting) — queue it
            queueRef.current.push(payload);
        }
    }, []);

    useEffect(() => {
        if (!workspaceSlug) return;

        const socket = connectWorkspaceSocket(workspaceSlug, {

            onMessage: (data) => {
                switch (data.type) {

                    case "send_notification":
                        setNotifications((prev) => [data, ...prev]);
                        break;

                    case "presence_update": {
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

                    default: {
                        listenersRef.current[data.type]?.forEach((cb) => cb(data));
                        break;
                    }
                }
            },
            onOpen: () => {
                console.log("workspace ws connected!!")
                // flush anything queued while we were connecting
                const queued = queueRef.current;
                queueRef.current = [];
                queued.forEach((payload) => {
                    socket.send(JSON.stringify(payload));
                });
            },
            onClose: () => {
                console.log("workspace ws disconnected!!")
            }
        })

        socketRef.current = socket;

        return () => {
            socket.close(1000, "Component unmounted");
            socketRef.current = null;
        };
    }, [workspaceSlug]);

    return { notifications, sendJson, subscribe };
}