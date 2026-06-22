import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { connectDiscussionSocket } from '../services/websocket'
import useDiscussionHistory from '../hooks/discussion/useDiscussionHistory'

const GroupDiscussionWSContext = createContext(null)

export function GroupDiscussionWSProvider({ workspaceSlug, goalId, children }) {
  const wsRef = useRef(null)
  const seededRef = useRef(false)
  const isPanelOpenRef = useRef(false)  // ← track panel visibility

  const { data: history, isPending: isLoading } = useDiscussionHistory()
  const [messages, setMessages] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  // Your existing WS logic — unchanged
  useEffect(() => {
    if (!workspaceSlug || !goalId) return

    setMessages([])
    seededRef.current = false

    const socket = connectDiscussionSocket(workspaceSlug, goalId, {
      onOpen: () => console.log('[discussion] connected'),
      onMessage: (data) => {
        if (data.type === 'discussion_message') {
          setMessages(prev => [...prev, data])

          // Only increment if panel is closed
          if (!isPanelOpenRef.current) {
            setUnreadCount(prev => prev + 1)
          }
        }
      },
      onClose: (event) => console.log('[discussion] closed', event),
      onError: (error) => console.error('[discussion] error', error),
    })

    wsRef.current = socket
    return () => socket.close()
  }, [workspaceSlug, goalId])

  // Your existing seed logic — unchanged
  useEffect(() => {
    if (history && !seededRef.current) {
      seededRef.current = true
      setMessages(prev => {
        const historyIds = new Set(history.map(m => m.id))
        const liveMessages = prev.filter(m => !historyIds.has(m.id))
        return [...history, ...liveMessages]
      })
    }
  }, [history])

  const sendMessage = useCallback((content) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ content }))
    }
  }, [])

  const onPanelOpen = useCallback(() => {
    isPanelOpenRef.current = true
    setUnreadCount(0)   // clear badge when user opens panel
  }, [])

  const onPanelClose = useCallback(() => {
    isPanelOpenRef.current = false
  }, [])

  return (
    <GroupDiscussionWSContext.Provider value={{
      messages, sendMessage, isLoading,
      unreadCount, onPanelOpen, onPanelClose
    }}>
      {children}
    </GroupDiscussionWSContext.Provider>
  )
}

export const useGroupDiscussionWS = () => {
  const ctx = useContext(GroupDiscussionWSContext)
  if (!ctx) throw new Error('useGroupDiscussionWS must be used inside GroupDiscussionWSProvider')
  return ctx
}