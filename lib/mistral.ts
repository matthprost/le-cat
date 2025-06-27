import { Mistral } from '@mistralai/mistralai'

// for simplicity we make that key public (which is not recommended in production)
// to reduce spam a protected page is used and the mistral api key will be deleted
// after the end of testing
export const mistral = new Mistral({
  apiKey: process.env['NEXT_PUBLIC_MISTRAL_API_KEY'] ?? '',
})
