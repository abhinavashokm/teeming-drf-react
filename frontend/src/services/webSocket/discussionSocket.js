import store from "../../store/store"

export function connectDiscussionSocket(
    workspaceSlug,
    goalId,
    { onMessage, onError }
) {

    const accessToken = store.getState().auth.accessToken
    const socket = new WebSocket(
        `ws://localhost:8000/ws/workspaces/${workspaceSlug}/goals/${goalId}/discussion/?token=${accessToken}`
    );

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        onMessage?.(data);
    }

    socket.onerror = (error) => {
        onError?.(error);
    };

    return socket;
}