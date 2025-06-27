'use client'

import type {
  ConversationHistory,
  MessageOutputEntry,
} from '@mistralai/mistralai/models/components'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ChatInput } from '@/components/chat-input'
import { ChatRender } from '@/components/chat-render'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useConversations } from '@/providers/conversations-provider'
import { mistral } from '@/utils/mistral'
import { LoaderCircle } from 'lucide-react'

type ConversationsProps = {
  conversationId?: string
}

export const Conversations = ({ conversationId }: ConversationsProps) => {
  const router = useRouter()
  const pathname = usePathname()

  const { conversations, appendConversation } = useConversations()

  const [history, setHistory] = useState<ConversationHistory | null>()
  const [isLoading, setIsLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollTo({
          top: containerRef.current.scrollHeight,
          behavior,
        })
      }
    }, 10)
  }, [])

  useEffect(() => {
    if (conversationId) {
      const conversation = conversations.find(
        conv => conv.conversationId === conversationId,
      )
      if (conversation) {
        mistral.beta.conversations
          .getHistory({
            conversationId: conversationId,
          })
          .then(result => {
            setHistory(result)

            scrollToBottom('instant')
          })
          .finally(() => {
            setIsLoading(false)
          })
      }
    } else {
      setIsLoading(false)
    }
  }, [conversationId, conversations, scrollToBottom])

  const callBack = useCallback(
    (newData: ConversationHistory) => {
      setHistory(newData)
      appendConversation(newData)

      if (!pathname.includes(`/${newData.conversationId}`)) {
        router.push(`/${newData.conversationId}`)
      }

      scrollToBottom()
    },
    [appendConversation, pathname, router, scrollToBottom],
  )

  return (
    <div className="grid font-[family-name:var(--font-geist-sans)] w-full">
      <div className="flex p-2" id="topbar">
        <SidebarTrigger />
      </div>

      <main className="flex flex-col h-full row-start-2 items-center sm:items-start overflow-x-hidden">
        <div
          className="flex flex-col w-full px-4 md:px-100 py-20 h-full md:gap-6 gap-4 overflow-x-hidden overflow-y-auto"
          style={{ height: 'calc(100vh - 215px)' }}
          ref={containerRef}
        >
          {isLoading ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <>
              {history?.entries?.map(conversation => {
                // For more simplicty we support only string content in the conversation output
                const conversationOutput = conversation as MessageOutputEntry
                const conversationContent =
                  typeof conversationOutput.content === 'string'
                    ? conversationOutput.content
                    : 'Unsupported content type'

                return (
                  <ChatRender
                    key={conversationOutput.id}
                    sender={
                      conversationOutput.role?.includes('user')
                        ? 'user'
                        : 'assistant'
                    }
                  >
                    {conversationContent}
                  </ChatRender>
                )
              })}
              {history === undefined || history?.entries?.length === 0 ? (
                <ChatRender sender="assistant">
                  Welcome to Le Cat demo! Ask me anything.
                </ChatRender>
              ) : null}
            </>
          )}
        </div>
        <ChatInput
          conversationId={history?.conversationId}
          callBack={callBack}
        />
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-start py-3 px-4">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/#"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/#"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
      </footer>
    </div>
  )
}
