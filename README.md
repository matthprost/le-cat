# Le Cat

The goal of the project is to test out Mistal API with a simple web application that allows users to chat with AI.

Find the deployed version of this application at [https://le-cat.vercel.app/](https://le-cat.vercel.app/).

## Features

- Chat with AI using Mistral API
- Chat history saved in local storage
- Form validation using Zod and React Hook Form
- User-friendly interface
- Responsive design

## Stack

- [TypeScript](https://www.typescriptlang.org/)
- [Next.js](https://nextjs.org/)
- [Mistral TS SDK](https://www.npmjs.com/package/@mistralai/mistralai)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)

## Demo

![demo](https://assets-mp.s3.fr-par.scw.cloud/Screen%20Recording%202025-06-27%20at%2015.36.45.gif)

## Development

Create a `.env` file in the root of your project and add the following environment variables:

```env
NEXT_PUBLIC_MISTRAL_API_KEY=your_mistral_api_key
PASSWORD=your_password
```

> [!CAUTION]
> Do not release this in production or you Mistral API will be compromised.
> The system has been built for local development only in order to test the Mistral API.

Then install the required dependencies:

```bash
pnpm install
```

And run the dev application:

```bash
pnpm dev
```
