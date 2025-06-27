import { z } from 'zod' // Add new import

export const ChatFormSchema = z.object({
  input: z
    .string()
    .min(1, 'Please provide at leat one character for Le Cat to work.')
    .max(
      500,
      'We love hearing from you, but please be more concise and write fewer than 500 characters.',
    ),
})
