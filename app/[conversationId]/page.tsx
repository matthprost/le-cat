import { Conversations } from '@/components/conversations'

type PageParams = {
  params: Promise<{
    conversationId: string
  }>
}

export default async function Page({ params }: PageParams) {
  const { conversationId } = await params

  return <Conversations conversationId={conversationId} />
}
