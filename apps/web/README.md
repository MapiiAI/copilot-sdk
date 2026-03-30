# mapii-ai-web

Next.js App Router starter for **[mapii.ai](https://mapii.ai)** — an AI-powered Local Map and Google Business intelligence platform.

## Tech stack

| Layer | Package |
|---|---|
| Framework | [Next.js](https://nextjs.org/) (App Router) |
| UI components | [@primer/react](https://primer.style/react) |
| Design tokens | [@primer/primitives](https://primer.style/primitives) |
| AI streaming | [Vercel AI SDK](https://sdk.vercel.ai) (`ai`, `@ai-sdk/react`, `@ai-sdk/openai`) |
| SEO data | [DataForSEO](https://dataforseo.com) (service layer — plug in when ready) |
| Deploy | [Vercel](https://vercel.com) |

## Project structure

```text
apps/web/
├── app/
│   ├── layout.tsx           # Root layout — Primer CSS + BaseStyles
│   ├── globals.css          # Global CSS reset + Primer token usage
│   ├── page.tsx             # Landing page
│   ├── chat/
│   │   └── page.tsx         # AI chat page
│   ├── map/
│   │   └── page.tsx         # Local Map / Google Business AI page
│   └── api/
│       └── chat/
│           └── route.ts     # Vercel AI SDK streaming route (Edge)
├── components/
│   ├── AppShell.tsx         # Root layout shell
│   └── chat/
│       ├── ChatWindow.tsx   # Stateful chat container (useChat)
│       ├── ChatInput.tsx    # Input + submit control
│       └── MessageList.tsx  # Rendered message thread
└── lib/
    └── services/
        ├── dataforseo/      # DataForSEO API abstraction
        │   ├── index.ts     # createDataForSEOService / getDataForSEOService
        │   └── types.ts     # DataForSEOService interface + domain types
        └── local-map/       # Local Map / Google Business AI domain
            ├── index.ts     # createLocalMapService
            └── types.ts     # LocalMapService interface + domain types
```

## Domain routes

| Route | Description |
|---|---|
| `/` | Landing page |
| `/chat` | AI chat assistant |
| `/map` | Local Map intelligence (coming soon) |
| `/api/chat` | Vercel AI SDK streaming endpoint |

## Local development

### 1. Install dependencies

```bash
cd apps/web
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in at minimum:

```env
OPENAI_API_KEY=sk-...
```

To enable DataForSEO features, also set:

```env
DATAFORSEO_LOGIN=your@email.com
DATAFORSEO_PASSWORD=your-password
```

### 3. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Typecheck

```bash
npm run typecheck
```

## Deploy to Vercel

### One-click deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/MapiiAI/copilot-sdk&root-directory=apps/web)

### Manual deploy

1. Push to GitHub.
2. Import the repository into [Vercel](https://vercel.com/new).
3. Set **Root Directory** to `apps/web`.
4. Add environment variables (`OPENAI_API_KEY`, and optionally `DATAFORSEO_LOGIN` / `DATAFORSEO_PASSWORD`) in the Vercel project settings.
5. Deploy.

## Using the DataForSEO service layer

```ts
// app/api/local-search/route.ts (example)
import { getDataForSEOService } from "@/lib/services/dataforseo";
import { createLocalMapService } from "@/lib/services/local-map";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") ?? "coffee";
  const location = searchParams.get("location") ?? "Bangkok, Thailand";

  const localMap = createLocalMapService(getDataForSEOService());
  const results = await localMap.searchBusinesses({ query, location });

  return Response.json(results);
}
```

## Theme

The app uses **Primer Primitives** CSS tokens and **Primer React** components:

- Light/dark theme is handled automatically via `data-color-mode="auto"` on `<html>`.
- All CSS variables (`--bgColor-default`, `--fgColor-muted`, etc.) come from `@primer/primitives`.
- Override tokens in `globals.css` if you need custom colours.

## Checklist — from zero to production

- [x] Create Next.js App Router project
- [x] Install `@primer/react` + `@primer/primitives`
- [x] Configure root layout with Primer CSS + `BaseStyles`
- [x] Add `AppShell` wrapper
- [x] Add landing page
- [x] Add AI chat page + streaming API route
- [x] Add Local Map placeholder page
- [x] Add DataForSEO service abstraction
- [x] Add Local Map domain service
- [x] Add `vercel.json` and `.env.example`
- [ ] Fill in `OPENAI_API_KEY` in Vercel environment settings
- [ ] (Optional) Fill in DataForSEO credentials when ready
- [ ] Deploy to Vercel
- [ ] Point `app.mapii.ai` DNS to Vercel project
