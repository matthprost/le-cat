import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Markdown from 'react-markdown'
import { CodeBlock, PreBlock } from '@/components/ui/code-block'

type ChatRenderProps = {
  children: string
  sender: 'user' | 'assistant'
}

export const ChatRender = ({ children, sender }: ChatRenderProps) => {
  return (
    <article
      className={`flex items-center gap-4 ${sender === 'assistant' ? 'flex-row' : 'flex-row-reverse'}`}
    >
      {sender === 'user' ? (
        <Avatar>
          <AvatarImage src="/heisenberg.jpeg" />
          <AvatarFallback>WW</AvatarFallback>
        </Avatar>
      ) : null}
      <div
        className={`${sender === 'user' ? 'bg-gray-100 rounded-xl p-3' : 'animate-in fade-in duration-500'} max-w-[100%] gap-2 flex flex-col`}
      >
        <Markdown
          components={{
            code: CodeBlock,
            pre: PreBlock,
          }}
        >
          {children}
        </Markdown>
      </div>
    </article>
  )
}
