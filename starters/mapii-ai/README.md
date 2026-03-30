# mapii.ai — Next.js Starter

A minimal, production-ready starter for [mapii.ai](https://mapii.ai) built with:

- **[Next.js 15](https://nextjs.org)** — App Router
- **[@primer/react](https://primer.style/react)** — GitHub's design system components
- **[@primer/primitives](https://primer.style/foundations/primitives)** — Design tokens (colors, spacing, typography)
- **[Vercel AI SDK](https://sdk.vercel.ai)** — Streaming AI chat
- **TypeScript** — End-to-end type safety

---

## File Tree

```
starters/mapii-ai/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts        # Streaming chat API (Edge runtime)
│   ├── chat/
│   │   └── page.tsx            # AI chat UI (useChat hook)
│   ├── globals.css             # Primer Primitives token imports + base styles
│   ├── layout.tsx              # Root layout — theme attrs + Providers + AppShell
│   └── page.tsx                # Home / landing page
├── components/
│   ├── app-shell.tsx           # Header nav + main content wrapper
│   └── providers.tsx           # ThemeProvider + BaseStyles (client component)
├── lib/
│   └── utils.ts                # Shared utility helpers
├── public/                     # Static assets
├── .env.example                # Required environment variable template
├── .gitignore
├── next.config.ts
├── package.json
├── tsconfig.json
└── vercel.json
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- An [OpenAI API key](https://platform.openai.com/api-keys) (required for the `/chat` page)

### 1. Install dependencies

```bash
cd starters/mapii-ai
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and set your API key:

```
OPENAI_API_KEY=sk-...
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Pages

| Route    | Description                              |
| -------- | ---------------------------------------- |
| `/`      | Landing page with links to chat and docs |
| `/chat`  | AI chat powered by the Vercel AI SDK     |

---

## Primer Setup

### Theme attributes

The root `<html>` element in `app/layout.tsx` carries three attributes that
control Primer's colour mode:

```html
<html
  data-color-mode="auto"
  data-light-theme="light"
  data-dark-theme="dark"
>
```

`data-color-mode="auto"` follows the OS preference. Change to `"light"` or
`"dark"` to pin a specific theme.

### CSS token imports

`app/globals.css` imports the Primer Primitives CSS files that expose all
design tokens as CSS custom properties (`--bgColor-default`, `--space-3`, etc.):

```css
@import '@primer/primitives/dist/css/functional/themes/light.css';
@import '@primer/primitives/dist/css/functional/themes/dark.css';
@import '@primer/primitives/dist/css/functional/size/size.css';
@import '@primer/primitives/dist/css/functional/typography/typography.css';
@import '@primer/primitives/dist/css/base/motion/motion.css';
```

### Providers

`components/providers.tsx` wraps the tree in Primer's `ThemeProvider` and
`BaseStyles`. All Primer components must be descendants of these providers.

---

## AI Chat

`app/chat/page.tsx` is a client component that uses the `useChat` hook from
the Vercel AI SDK:

```tsx
const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
  api: '/api/chat',
})
```

The corresponding API route at `app/api/chat/route.ts` runs on the **Edge
runtime** and streams responses using `@ai-sdk/openai`:

```ts
import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'

export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages } = await req.json()
  const result = streamText({
    model: openai(process.env.OPENAI_MODEL ?? 'gpt-4o-mini'),
    system: 'You are a helpful AI assistant for mapii.ai.',
    messages,
  })
  return result.toDataStreamResponse()
}
```

To swap providers (e.g. Anthropic, Google), replace `@ai-sdk/openai` with the
relevant AI SDK provider package and update the model initialiser.

---

## Deploying to Vercel

### One-click deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FMapiiAI%2Fcopilot-sdk%2Ftree%2Fmain%2Fstarters%2Fmapii-ai&root-directory=starters/mapii-ai&env=OPENAI_API_KEY&envDescription=OpenAI%20API%20key%20for%20the%20chat%20feature)

### Manual deploy

1. Install the [Vercel CLI](https://vercel.com/docs/cli): `npm i -g vercel`
2. From inside `starters/mapii-ai`, run: `vercel`
3. Set the `OPENAI_API_KEY` environment variable in the Vercel project settings.

---

## Extending the Starter

| Goal                             | Where to look                        |
| -------------------------------- | ------------------------------------ |
| Add a new page                   | `app/<route>/page.tsx`               |
| Add a shared UI component        | `components/`                        |
| Add a domain feature module      | Create `domains/<feature>/` folder   |
| Change the AI model / provider   | `app/api/chat/route.ts`              |
| Add authentication               | `app/api/auth/` + middleware         |
| Add a database                   | `lib/db.ts` + Prisma / Drizzle       |
| Switch to a different AI provider | Install the provider package, update `route.ts` |

### Recommended domain structure (when the app grows)

```
domains/
  chat/
    components/   # Chat-specific components
    hooks/        # useChat wrapper, history hooks
    actions/      # Server actions
    types.ts      # Domain types
  seo/            # Future SEO data domain
  auth/           # Auth domain
```

---

## License

MIT
