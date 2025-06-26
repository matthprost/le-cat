'use client'

import type { ChatCompletionResponse } from '@mistralai/mistralai/models/components'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ChatInput } from '@/components/chat-input'
import { ChatRender } from '@/components/chat-render'
import { SidebarTrigger } from '@/components/ui/sidebar'

export default function Home() {
  const [chat, setChat] = useState<ChatCompletionResponse[]>([])
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const storedChat = localStorage.getItem('chat')
    if (storedChat) {
      setChat(JSON.parse(storedChat))
    }
  }, [])

  const callBack = useCallback((newData: ChatCompletionResponse) => {
    setChat(prevChat => {
      const newChat = [...prevChat, newData]

      localStorage.setItem('chat', JSON.stringify(newChat))

      return newChat
    })

    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollTo({
          top: containerRef.current.scrollHeight,
          behavior: 'smooth',
        })
      }
    }, 10)
  }, [])

  const reset = useCallback(() => {
    setChat([])
    localStorage.removeItem('chat')
  }, [])

  return (
    <div className="grid font-[family-name:var(--font-geist-sans)] w-full">
      <div className="flex p-2" id="topbar">
        <SidebarTrigger />
      </div>

      <main className="flex flex-col h-full row-start-2 items-center sm:items-start overflow-x-hidden">
        <div
          className="flex flex-col w-full px-1 md:px-100 py-20 h-full md:gap-6 gap-4 overflow-x-hidden overflow-y-auto"
          style={{ height: 'calc(100vh - 200px)' }}
          ref={containerRef}
        >
          {chat.map(message => (
            <ChatRender
              sender={message.id.includes('user') ? 'user' : 'assistant'}
              key={message.id}
            >
              {typeof message.choices[0].message.content === 'string'
                ? message.choices[0].message.content
                : 'Unkown data'}
            </ChatRender>
          ))}
          {chat.length === 0 && (
            <ChatRender sender="assistant">
              Welcome to Le Cat demo! Ask me anything.
            </ChatRender>
          )}
        </div>
        <ChatInput chat={chat} callBack={callBack} reset={reset} />
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
