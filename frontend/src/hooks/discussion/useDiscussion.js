import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useDiscussionHistory from './useDiscussionHistory'
import useGoalId from '../params/useGoalId'
import { useSelector } from 'react-redux'
import { connectDiscussionSocket } from '../../services/webSocket/discussionSocket'
import useWorkspaceSlug from '../params/useWorkspaceSlug'

function useDiscussion() {

    const wsRef = useRef(null)
    const [messages, setMessages] = useState([])

    const workspaceSlug = useWorkspaceSlug()
    const goalId = useGoalId()

    const { data: history, isPending: isLoading } = useDiscussionHistory()
 
    // Seed state with history once loaded
    useEffect(() => {
        if (history) setMessages([...history]);
    }, [history]);

    // WebSocket connection
    useEffect(() => {

        const socket = connectDiscussionSocket(workspaceSlug, goalId,
            {
                onMessage: (data) => {
                    console.log(data)
                    if (data.type === 'discussion_message') {
                        console.log('inside')
                        setMessages((prev) => [...prev, data]);
                    }else{
                        console.log("outside")
                    }
                },
                onError: (error) => {
                    console.error(error);
                },
            }
        )

        wsRef.current = socket

        return () => {
            socket.close()
        } 

    }, [workspaceSlug, goalId])

    const sendMessage = useCallback((content) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(
                JSON.stringify({ content })
            );
        }
    }, [])


    return {
        messages,
        sendMessage,
        isLoading,
    };
}

export default useDiscussion