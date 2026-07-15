import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useWorkspaceSocketContext } from '../contexts/WorkspaceSocketContext'
import useDiscussionHistory from '../hooks/discussion/useDiscussionHistory'

const GroupDiscussionWSContext = createContext(null)

export function GroupDiscussionWSProvider({ goalId, children }) {
  const { sendJson, subscribe } = useWorkspaceSocketContext()

  const seededRef = useRef(false)
  const isPanelOpenRef = useRef(false)

  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const [messages, setMessages] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  const { data: history, isPending: isLoading } = useDiscussionHistory(page)

  /* ---------------- join/leave lifecycle on goal change ---------------- */
  useEffect(() => {
    if (!goalId) return

    setMessages([])
    setPage(1)
    setHasMore(true)
    setIsFetchingMore(false)
    seededRef.current = false
    sendJson({ type: 'join_discussion', goal_id: goalId })

    return () => {
      sendJson({ type: 'leave_discussion', goal_id: goalId })
    }
  }, [goalId, sendJson])

  /* ---------------- live message/error subscription ---------------- */
  useEffect(() => {
    if (!goalId) return

    const unsubMessage = subscribe('discussion_message', (data) => {
      if (data.goal_id !== goalId) return // guard against late events from a prior room

      setMessages(prev => [...prev, data])
      if (!isPanelOpenRef.current) {
        setUnreadCount(prev => prev + 1)
      }
    })

    const unsubError = subscribe('discussion_error', (data) => {
      if (data.goal_id !== goalId) return
      console.error('[discussion] error', data.error)
    })

    return () => {
      unsubMessage()
      unsubError()
    }
  }, [goalId, subscribe])

  /* ---------------- seed / prepend history ---------------- */
  useEffect(() => {
    if (!history) return

    if (page === 1) {
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
      setMessages(prev => {
        const existingIds = new Set(prev.map(m => m.id))
        const newMessages = history.messages.filter(m => !existingIds.has(m.id))
        return [...newMessages, ...prev]
      })
      setHasMore(history.hasMore)
      setIsFetchingMore(false)
    }
  }, [history, page])

  /* ---------------- actions ---------------- */
  const sendMessage = useCallback((content) => {
    sendJson({ type: 'chat_message', goal_id: goalId, content })
  }, [sendJson, goalId])

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