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

    // Seed history once
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

    // WebSocket connection
    useEffect(() => {
        if (!workspaceSlug || !goalId) return

        setMessages([])
        seededRef.current = false

        const socket = connectDiscussionSocket(workspaceSlug, goalId, {
            onMessage: (data) => {
                if (data.type === 'discussion_message') {
                    setMessages(prev => [...prev, data])
                }
            }
        })

        wsRef.current = socket

        return () => socket.close()
    }, [workspaceSlug, goalId])

    const sendMessage = useCallback((content) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ content }))
        }
    }, [])

    return { messages, sendMessage, isLoading }
}

export default useDiscussion