'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { PasswordFormSchema } from '@/types/password-form-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle, LockIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, type ComponentProps } from 'react'
import { useForm } from 'react-hook-form'

type FormInput = {
  password: string
}

export const PasswordForm = ({
  className,
  ...props
}: ComponentProps<'div'>) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>({
    mode: 'onChange',
    resolver: zodResolver(PasswordFormSchema),
  })

  const onSubmit = async ({ password }: FormInput) => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setIsLoading(false)

        throw new Error(errorData.error || 'Authentication failed')
      }

      router.replace('/')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
      setIsLoading(false)

      return
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LockIcon size={16} />
            <span>Access Restricted</span>
          </CardTitle>
          <CardDescription>
            This website is password protected. Please enter the password to
            access the content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  {...register('password')}
                />
                {error || errors.password ? (
                  <p className="text-red-500 text-sm">
                    {error ?? errors?.password?.message}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || !!errors?.password}
                >
                  {isLoading ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    'Access'
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
