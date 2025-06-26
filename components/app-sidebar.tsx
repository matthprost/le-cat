'use client'

import { ChevronUp, MessageCircle, PlusIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import Link from 'next/link'
import { useConversations } from '@/providers/conversations-provider'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import type { MessageOutputEntry } from '@mistralai/mistralai/models/components'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export const AppSidebar = () => {
  const router = useRouter()
  const pathname = usePathname()
  const { conversations } = useConversations()

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2 justify-between">
            <div className="flex gap-2 items-center">
              <MessageCircle size={16} />
              <span>Chats</span>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => router.push('/')}
                >
                  <PlusIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>New chat</p>
              </TooltipContent>
            </Tooltip>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {conversations.map(conversation => {
                // For more simplicty we support only string content in the conversation output
                const conversationOutput = conversation
                  .entries[0] as MessageOutputEntry
                const conversationContent =
                  typeof conversationOutput.content === 'string'
                    ? conversationOutput.content
                    : 'Unsupported content type'

                return (
                  <SidebarMenuItem key={conversation.conversationId}>
                    <SidebarMenuButton
                      isActive={pathname.includes(conversation.conversationId)}
                      asChild
                    >
                      <Link href={`/${conversation.conversationId}`}>
                        <span>{conversationContent}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Avatar>
                    <AvatarImage src="/heisenberg.jpeg" />
                    <AvatarFallback>WW</AvatarFallback>
                  </Avatar>
                  Heisenberg (Walter. W)
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
