import { useCallback, useEffect, useRef, useState } from 'react'
import { connectDiscussionSocket } from '../../services/websocket';
import useGoalId from '../params/useGoalId'
import useWorkspaceSlug from '../params/useWorkspaceSlug'
import useDiscussionHistory from './useDiscussionHistory'

function useDiscussion() {

    const wsRef = useRef(null)
    const seededRef = useRef(false)

    const workspaceSlug = useWorkspaceSlug()
    const goalId = useGoalId()

    const { data: history, isPending: isLoading } = useDiscussionHistory()
    const [messages, setMessages] = useState([])

    // WebSocket connection + reset — must run BEFORE the seed effect below,
    // so a freshly-cached `history` (available synchronously on remount)
    // doesn't get wiped out after it's already been seeded.
    useEffect(() => {
        if (!workspaceSlug || !goalId) return

        setMessages([])
        seededRef.current = false

        const socket = connectDiscussionSocket(workspaceSlug, goalId, {
            onOpen: () => console.log('[discussion] connected'),
            onMessage: (data) => {
                if (data.type === 'discussion_message') {
                    setMessages(prev => [...prev, data])
                }
            },
            onClose: (event) => console.log('[discussion] closed', { code: event.code, reason: event.reason, wasClean: event.wasClean }),
            onError: (error) => console.error('[discussion] error', error),
        })

        wsRef.current = socket

        return () => socket.close()
    }, [workspaceSlug, goalId])

    // Seed history once per room, whenever it becomes available
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
            console.log("ws is open")
            wsRef.current.send(JSON.stringify({ content }))
        } else {
            console.log("websocket is not open")
        }
    }, [])

    return { messages, sendMessage, isLoading }
}

export default useDiscussion