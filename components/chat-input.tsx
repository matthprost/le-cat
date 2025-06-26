'use client'

import {
  HTTPValidationError,
  SDKValidationError,
} from '@mistralai/mistralai/models/errors'
import { ArrowUp, LoaderCircle } from 'lucide-react'
import { useState } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type {
  ConversationHistory,
  ConversationResponse,
} from '@mistralai/mistralai/models/components'
import { mistral } from '@/utils/mistral'

type FormInput = {
  input: string
}

type ChatInputProps = {
  conversationId?: string
  callBack: (data: ConversationHistory) => void
}

export const ChatInput = ({ conversationId, callBack }: ChatInputProps) => {
  const { reset, register, handleSubmit } = useForm<FormInput>({
    mode: 'onChange',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit: SubmitHandler<FormInput> = async data => {
    setError('')
    setIsLoading(true)
    try {
      let result: ConversationResponse

      if (!conversationId) {
        result = await mistral.beta.conversations.start({
          stream: true,
          model: 'mistral-small-latest',
          inputs: data.input,
        })
      } else {
        result = await mistral.beta.conversations.append({
          conversationId: conversationId,
          conversationAppendRequest: {
            inputs: data.input,
          },
        })
      }

      const history = await mistral.beta.conversations.getHistory({
        conversationId: result.conversationId,
      })

      callBack(history)
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
