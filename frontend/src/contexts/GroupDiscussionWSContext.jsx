import { useQueryClient } from '@tanstack/react-query'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import useDiscussionHistory from '../hooks/discussion/useDiscussionHistory'
import useWorkspaceQueryKeys from '../hooks/helper/useWorkspaceQueryKeys'
import { useWorkspaceSocketContext } from './WorkspaceSocketContext'

const GroupDiscussionWSContext = createContext(null)

export function GroupDiscussionWSProvider({ goalId, children }) {
  const { sendJson, subscribe } = useWorkspaceSocketContext()

  const isPanelOpenRef = useRef(false)

  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  const { data: history, isPending: isLoading } = useDiscussionHistory(page)

  const queryClient = useQueryClient()
  const workspaceKeys = useWorkspaceQueryKeys()

  const [page1Messages, setPage1Messages] = useState([])   // authoritative — always fully replaced by fresh page-1 fetch
  const [olderMessages, setOlderMessages] = useState([])   // pages 2+, loaded via loadMore
  const [liveMessages, setLiveMessages] = useState([])     // messages received via socket since join

  const messages = useMemo(() => {
    const map = new Map()
    const combined = [...olderMessages, ...page1Messages, ...liveMessages]
    combined.forEach(m => map.set(m.id, m))

    return Array.from(map.values()).sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    )

  }, [olderMessages, page1Messages, liveMessages])

  /* ---------------- join/leave lifecycle on goal change ---------------- */
  useEffect(() => {
    setPage1Messages([])
    setOlderMessages([])
    setLiveMessages([])
    setPage(1)
    setHasMore(true)
    setIsFetchingMore(false)

    if (!goalId) return

    sendJson({ type: 'join_discussion', goal_id: goalId })
    queryClient.invalidateQueries({ queryKey: workspaceKeys.discussions() })

    return () => {
      sendJson({ type: 'leave_discussion', goal_id: goalId })
    }
  }, [goalId, sendJson])

  /* ---------------- live message/error subscription ---------------- */
  useEffect(() => {
    if (!goalId) return

    const unsubMessage = subscribe('discussion_message', (data) => {
      if (data.goal_id !== goalId) return

      setLiveMessages(prev => [...prev, data])
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
      setPage1Messages(history.messages)
      setHasMore(history.hasMore)
      setHasMore(history.hasMore)
    } else {
      setOlderMessages(prev => {
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