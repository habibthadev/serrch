# Serrch

![Serrch Logo](public/serrch-stacked-1024x1024.png)

**@serrch_ai_bot** — Telegram AI Research Agent.

Serrch is a Telegram bot that acts as a personal research assistant. Send it a URL or a topic, and it crawls or searches the web, summarizes findings into structured output, stores research in MongoDB, and supports follow-up questions via memory recall.

Built with strict TypeScript, validated at every boundary, and deployed on Fly.io.

## Tech Stack

```
Runtime         Node.js + TypeScript (strict)
Telegram        grammy
AI              AI SDK (Vercel) + Fireworks
Search/Crawl    Firecrawl SDK
Database        MongoDB + Mongoose
Validation      Zod
Logging         Pino
Deployment      Fly.io (webhook) / local polling
Testing         Vitest
```

## Features

- **URL research** — Provide a link, Serrch crawls it and extracts key information
- **Topic research** — Ask about any subject, Serrch searches the web and synthesizes findings
- **Memory recall** — Follow-up questions reference past research sessions
- **Structured output** — Summaries, key points, sources, and confidence ratings
- **History** — Review and clear past research sessions

## Commands

| Command     | Description                        |
|-------------|------------------------------------|
| `/start`    | Welcome message and usage guide    |
| `/history`  | View your last 5 research sessions |
| `/clear`    | Clear all your research history    |

Just send a URL or a question to start researching.

## Architecture

```
src/
├── agent/             # AI SDK orchestration + tools
│   ├── index.ts       # Research agent (generateText + tools)
│   ├── prompts.ts     # System prompt
│   └── tools/         # crawlUrl, searchWeb, recallMemory
├── bot/               # Telegram integration
│   ├── index.ts       # grammy Bot instance
│   ├── handlers/      # message, commands
│   ├── middleware/     # rateLimit, logger
│   └── utils/         # formatOutput, chunkMessage
├── db/                # MongoDB + Mongoose
│   ├── connection.ts  # Connect + graceful shutdown
│   └── models/        # Research model (text-indexed)
├── schemas/           # Zod validation schemas + types
├── lib/               # Pino logger
├── scripts/           # register-webhook
├── dev.ts             # Polling-mode entry point
└── server.ts          # Webhook-mode entry point (Hono)
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- MongoDB (local or cloud)
- Fireworks AI API key
- Firecrawl API key
- Telegram Bot Token (from [@BotFather](https://t.me/botfather))

### Setup

```bash
# Clone and install
git clone <repo>
cd serrch
pnpm install

# Configure environment
cp .env.example .env
# Fill in TELEGRAM_BOT_TOKEN, FIREWORKS_API_KEY, FIRECRAWL_API_KEY, MONGODB_URI
```

### Run in Polling Mode (recommended for development)

```bash
pnpm dev:poll
```

No tunnel needed — the bot connects directly to Telegram.

### Run in Webhook Mode (for production)

```bash
# Terminal 1: Start tunnel (e.g., outray)
outray 3000 --subdomain serrch_ai_bot

# Terminal 2: Start server
pnpm dev

# Terminal 3: Register webhook (one-time)
pnpm register-webhook
```

## Testing

```bash
pnpm test
```

## Deployment (Fly.io)

```bash
fly deploy
pnpm register-webhook
```

The webhook URL will be `https://<your-app>.fly.dev/webhook/<TOKEN>`.

## Project Status

Built from a focused spec — excludes auth/whitelist, conversation threading, and streaming by design.
