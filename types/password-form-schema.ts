import { z } from 'zod' // Add new import

export const PasswordFormSchema = z
  .object({
    password: z.string(),
  })
  .required()
