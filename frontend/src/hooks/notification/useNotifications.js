import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";

export function useNotifications() {
    const [notifications, setNotifications] = useState([]);
    const token = useSelector((state) => state.auth.accessToken);
    const wsRef = useRef(null);

    useEffect(() => {
        if (!token) return;

        // Close any existing connection first
        if (wsRef.current) {
            wsRef.current.close();
        }

        const ws = new WebSocket(`ws://localhost:8000/ws/notifications/?token=${token}`);
        wsRef.current = ws;

        ws.onopen = () => console.log("✅ WebSocket connected");

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setNotifications((prev) => [data, ...prev]);
        };

        ws.onerror = (err) => console.error("WebSocket error:", err);

        ws.onclose = () => console.log("WebSocket closed");

        return () => {
            ws.onclose = null; // prevent log on intentional close
            ws.close();
        };
    }, [token]);

    return { notifications };
}