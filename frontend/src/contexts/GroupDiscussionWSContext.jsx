import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { connectDiscussionSocket } from '../services/websocket'
import useDiscussionHistory from '../hooks/discussion/useDiscussionHistory'

const GroupDiscussionWSContext = createContext(null)

export function GroupDiscussionWSProvider({ workspaceSlug, goalId, children }) {
  const wsRef = useRef(null)
  const seededRef = useRef(false)
  const isPanelOpenRef = useRef(false)

  /* -------------------------------------------------------------------------- */
  /* Pagination state                                                           */
  /* -------------------------------------------------------------------------- */
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)

  /* -------------------------------------------------------------------------- */
  /* Messages + unread                                                          */
  /* -------------------------------------------------------------------------- */
  const [messages, setMessages] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  const { data: history, isPending: isLoading } = useDiscussionHistory(page)

  /* -------------------------------------------------------------------------- */
  /* WebSocket connection — reset on room change                                */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (!workspaceSlug || !goalId) return

    setMessages([])
    setPage(1)
    setHasMore(true)
    setIsFetchingMore(false)
    seededRef.current = false

    const socket = connectDiscussionSocket(workspaceSlug, goalId, {
      onOpen: () => console.log('[discussion] connected'),
      onMessage: (data) => {
        if (data.type === 'discussion_message') {
          setMessages(prev => [...prev, data])

          if (!isPanelOpenRef.current) {
            setUnreadCount(prev => prev + 1)
          }
        }
      },
      onClose: (event) => console.log('[discussion] closed'),
      onError: (error) => console.error('[discussion] error', error),
    })

    wsRef.current = socket
    return () => socket.close()
  }, [workspaceSlug, goalId])

  /* -------------------------------------------------------------------------- */
  /* Seed / prepend history when page data arrives                              */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (!history) return

    if (page === 1) {
      // First load — seed once, merge with any live messages already received
      if (!seededRef.current) {
        seededRef.current = true
        setMessages(prev => {
          const historyIds = new Set(history.messages.map(m => m.id))
          const liveMessages = prev.filter(m => !historyIds.has(m.id))
          return [...history.messages, ...liveMessages]
        })
        setHasMore(history.hasMore)
      }
    } else {
      // Subsequent pages — prepend older messages at the top
      setMessages(prev => {
        const existingIds = new Set(prev.map(m => m.id))
        const newMessages = history.messages.filter(m => !existingIds.has(m.id))
        return [...newMessages, ...prev]
      })
      setHasMore(history.hasMore)
      setIsFetchingMore(false)
    }
  }, [history, page])

  /* -------------------------------------------------------------------------- */
  /* Actions                                                                    */
  /* -------------------------------------------------------------------------- */
  const sendMessage = useCallback((content) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ content }))
    }
  }, [])

  const loadMore = useCallback(() => {
    if (!hasMore || isFetchingMore) return
    setIsFetchingMore(true)
    setPage(prev => prev + 1)
  }, [hasMore, isFetchingMore])

  const onPanelOpen = useCallback(() => {
    isPanelOpenRef.current = true
    setUnreadCount(0)
  }, [])

  const onPanelClose = useCallback(() => {
    isPanelOpenRef.current = false
  }, [])

  return (
    <GroupDiscussionWSContext.Provider value={{
      messages, sendMessage, isLoading,
      unreadCount, onPanelOpen, onPanelClose,
      loadMore, hasMore, isFetchingMore,
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