import { Mistral } from '@mistralai/mistralai'

export const mistral = new Mistral({
  apiKey: process.env['NEXT_PUBLIC_MISTRAL_API_KEY'] ?? '',
})
