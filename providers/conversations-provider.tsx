'use client'

import type { ConversationHistory } from '@mistralai/mistralai/models/components'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

type ContextValues = {
  conversations: ConversationHistory[]
  appendConversation: (newData: ConversationHistory) => void
}

const ConversationContext = createContext<ContextValues | null>(null)

export const useConversations = () => {
  const context = useContext(ConversationContext)

  if (!context) {
    throw new Error(
      'useConversations must be used within a ConversationProvider',
    )
  }

  return context
}

type ConversationProviderProps = {
  children: ReactNode
}

export const ConversationProvider = ({
  children,
}: ConversationProviderProps) => {
  const [conversations, setConversations] = useState<ConversationHistory[]>([])

  // Get the conversations from localStorage when the component mounts
  useEffect(() => {
    const localStorageConversations = localStorage.getItem('conversations')
    const safeLocalStorageConversations = localStorageConversations
      ? JSON.parse(localStorageConversations)
      : []

    setConversations(safeLocalStorageConversations)
  }, [])

  // It will check if the conversations are already in localStorage
  const appendConversation = useCallback((newData: ConversationHistory) => {
    const localStorageChats = localStorage.getItem('conversations')
    const chats = localStorageChats ? JSON.parse(localStorageChats) : []
    const existingChatIndex = chats.find(
      (chat: ConversationHistory) =>
        chat.conversationId === newData.conversationId,
    )

    if (!existingChatIndex) {
      localStorage.setItem('conversations', JSON.stringify([...chats, newData]))
      setConversations([...chats, newData])
    }
  }, [])

  const value = useMemo(
    () => ({
      conversations,
      appendConversation,
    }),
    [conversations, appendConversation],
  )

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  )
}
