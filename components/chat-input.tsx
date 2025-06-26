'use client'

import { Mistral } from '@mistralai/mistralai'
import type {
  ChatCompletionRequest,
  ChatCompletionResponse,
} from '@mistralai/mistralai/models/components'
import {
  HTTPValidationError,
  SDKValidationError,
} from '@mistralai/mistralai/models/errors'
import { ArrowUp, LoaderCircle, RotateCw } from 'lucide-react'
import { useState } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const mistral = new Mistral({
  apiKey: process.env['NEXT_PUBLIC_MISTRAL_API_KEY'] ?? '',
})

type FormInput = {
  input: string
}

type ChatInputProps = {
  chat: ChatCompletionResponse[]
  callBack: (data: ChatCompletionResponse) => void
  reset?: () => void
}

export const ChatInput = ({
  chat,
  callBack,
  reset: chatReset,
}: ChatInputProps) => {
  const { reset, register, handleSubmit } = useForm<FormInput>({
    mode: 'onChange',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit: SubmitHandler<FormInput> = async data => {
    setError('')
    setIsLoading(true)
    try {
      const oldMessages: ChatCompletionRequest['messages'] = chat.map(
        message => ({
          role: message.id.includes('user') ? 'user' : 'assistant',
          content:
            typeof message.choices[0].message.content === 'string'
              ? message.choices[0].message.content
              : 'Unknown data',
        }),
      )

      const result = await mistral.chat.complete({
        model: 'mistral-small-latest',
        messages: [
          ...oldMessages,
          {
            role: 'user',
            content: data.input,
          },
        ],
      })

      // to save user input we simulate a first response
      callBack({
        id: `user-${Date.now()}`,
        object: 'chat.completion',
        created: Date.now(),
        model: 'mistral-small-latest',
        choices: [
          {
            index: 0,
            finishReason: 'stop',
            message: { content: data.input },
          },
        ],
        usage: {
          promptTokens: data.input.length,
          completionTokens: 0,
          totalTokens: data.input.length,
        },
      })

      callBack(result)
      reset()
    } catch (error) {
      switch (true) {
        case error instanceof SDKValidationError: {
          console.error(error.pretty())
          setError(error.message)
          return
        }
        case error instanceof HTTPValidationError: {
          console.error(error)
          setError(error.message)
          return
        }
        default: {
          console.error('An unexpected error occurred:', error)
          setError('An unexpected error occurred. Please try again later.')
          throw error
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-1 align-center justify-center w-full md:px-120 p-4">
      <div className="flex flex-col gap-2 rounded-lg p-2 w-full bg-gray-100">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-2 flex-row w-full">
            <Input
              className="bg-transparent border-0 shadow-none focus:ring-0 focus:border-0 focus:shadow-none active:shadow-none"
              placeholder="Ask Le Cat"
              {...register('input', { required: true })}
            />
            {!isLoading ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    disabled={isLoading}
                    variant="ghost"
                    onClick={chatReset}
                  >
                    <RotateCw />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reset chat</p>
                </TooltipContent>
              </Tooltip>
            ) : null}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <ArrowUp />
              )}
            </Button>
          </div>
        </form>
        {error ? <p className="text-red-600 text-sm px-3">{error}</p> : null}
      </div>
      <small className="text-gray-600 text-center">
        Le Cat can make mistakes. Please verify the information provided.
      </small>
    </div>
  )
}
