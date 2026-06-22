import store from "../store/store"

const BASE_URL = import.meta.env.VITE_TUNNELING_MODE === 'true'
  ? import.meta.env.VITE_WS_TEMP_TUNNEL_URL
  : import.meta.env.VITE_WS_BASE_URL

function createSocket(path, { onOpen, onMessage, onError, onClose } = {}) {
    const token = store.getState().auth.accessToken
    const socket = new WebSocket(`${BASE_URL}${path}?token=${token}`)

    socket.onopen = () => onOpen?.()
    socket.onmessage = (event) => onMessage?.(JSON.parse(event.data))
    socket.onerror = (error) => {

        onError?.(error)
    }
    socket.onclose = (event) => onClose?.(event)

    return socket
}

export function connectNotificationSocket(workspaceSlug, callbacks) {
    return createSocket(`/ws/workspaces/${workspaceSlug}/notifications/`, callbacks)
}

export function connectDiscussionSocket(workspaceSlug, goalId, callbacks) {
    return createSocket(`/ws/workspaces/${workspaceSlug}/goals/${goalId}/discussion/`, callbacks)
}