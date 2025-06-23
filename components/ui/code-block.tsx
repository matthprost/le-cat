import { ReactNode } from 'react'

type CodeBlockProps = {
  children?: ReactNode
}

export const CodeBlock = ({ children }: CodeBlockProps) => {
  return (
    <code className="text-sm text-gray-800 whitespace-break-spaces">
      {children}
    </code>
  )
}

export const PreBlock = ({ children }: CodeBlockProps) => {
  return <pre className="bg-gray-100 p-4 rounded-lg">{children}</pre>
}
