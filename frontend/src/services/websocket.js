import store from "../store/store"

const BASE_URL = import.meta.env.VITE_TUNNELING_MODE === 'true'
  ? import.meta.env.VITE_WS_TEMP_TUNNEL_URL
  : import.meta.env.VITE_WS_BASE_URL

const HEARTBEAT_INTERVAL = 25000       // send ping every 25s
const PONG_TIMEOUT = 10000             // must get pong within 10s of a ping, else treat as dead
const MAX_RECONNECT_DELAY = 30000
const INITIAL_RECONNECT_DELAY = 1000
const JITTER_FACTOR = 0.3              // ±30% randomness on reconnect delay

function createSocket(path, { onOpen, onMessage, onError, onClose } = {}) {
  let socket = null
  let heartbeatTimer = null
  let pongTimeoutTimer = null
  let reconnectTimer = null
  let reconnectDelay = INITIAL_RECONNECT_DELAY
  let shouldReconnect = true
  let manuallyClosed = false

  function getUrl() {
    const token = store.getState().auth.accessToken
    return `${BASE_URL}${path}?token=${token}`
  }

  function getDelayWithJitter(baseDelay) {
    // adds up to ±30% randomness so many clients reconnecting at once
    // don't all retry at the exact same moment (thundering herd)
    const jitter = baseDelay * JITTER_FACTOR * (Math.random() * 2 - 1) // range: -30% to +30%
    return Math.max(0, Math.round(baseDelay + jitter))
  }

  function startHeartbeat() {
    stopHeartbeat()
    heartbeatTimer = setInterval(() => {
      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: "ping" }))
        waitForPong()
      }
    }, HEARTBEAT_INTERVAL)
  }

  function stopHeartbeat() {
    clearInterval(heartbeatTimer)
    clearTimeout(pongTimeoutTimer)
  }

  function waitForPong() {
    clearTimeout(pongTimeoutTimer)
    pongTimeoutTimer = setTimeout(() => {
      console.warn("No pong received, terminating stale connection")
      socket?.close(4008, "Heartbeat timeout")
    }, PONG_TIMEOUT)
  }

  function clearPongWait() {
    clearTimeout(pongTimeoutTimer)
  }

  function connect() {
    socket = new WebSocket(getUrl())

    socket.onopen = () => {
      reconnectDelay = INITIAL_RECONNECT_DELAY // reset backoff on success
      startHeartbeat()
      onOpen?.()
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === "pong") {
        clearPongWait()
        return
      }
      onMessage?.(data)
    }

    socket.onerror = (error) => {
      onError?.(error)
    }

    socket.onclose = (event) => {
      stopHeartbeat()
      onClose?.(event)

      if (manuallyClosed) return

      if (event.code === 4001 || event.code === 4003) {
        shouldReconnect = false
      }

      if (shouldReconnect) {
        const delay = getDelayWithJitter(reconnectDelay)
        reconnectTimer = setTimeout(() => connect(), delay)
        reconnectDelay = Math.min(reconnectDelay * 2, MAX_RECONNECT_DELAY)
      }
    }
  }

  connect()

  return {
    get readyState() {
      return socket?.readyState
    },
    send: (data) => {
      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(typeof data === "string" ? data : JSON.stringify(data))
      }
    },
    close: (code, reason) => {
      manuallyClosed = true
      shouldReconnect = false
      clearTimeout(reconnectTimer)
      stopHeartbeat()
      socket?.close(code, reason)
    },
    set onclose(fn) {
      onClose = fn
    },
  }
}

export function connectWorkspaceSocket(workspaceSlug, callbacks) {
  return createSocket(`/ws/workspaces/${workspaceSlug}/`, callbacks)
}

export function connectDiscussionSocket(workspaceSlug, goalId, callbacks) {
  return createSocket(`/ws/workspaces/${workspaceSlug}/goals/${goalId}/discussion/`, callbacks)
}