# Thena — Where Deep Work Happens

Thena is a `Next.js` 15 application focused on deep work, task management, and performance intelligence. It uses `Clerk` for authentication, `tRPC` for type-safe APIs, `Drizzle` ORM with `PostgreSQL`, `Mantine` UI, `Tailwind CSS` v4, and `Vitest` for testing.

Explore feature concepts in `docs/features/`.

## Quick start

1. Install prerequisites

- Node 20+ (LTS recommended)
- `pnpm` 9+ (project uses `packageManager: pnpm@9.x`)
- Docker or `Podman` (for local `PostgreSQL`)

1. Create your environment file

Create `.env.development.local` at the repo root:

```bash
# PostgreSQL connection (required)
DATABASE_URL="postgresql://postgres:password@localhost:5432/thena"

# Clerk (required for protected routes)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
```

Notes:

- `DATABASE_URL` is required by Drizzle. See `src/env.ts`.
- Clerk protects all routes except `/sign-in` via middleware. You’ll need a Clerk app with dev keys to sign in locally.

1. Start a local database (one-time)

```bash
./start-database.sh
```

This script reads `DATABASE_URL`, then starts a `Postgres` container named after your DB (requires Docker or `Podman`). If the default password is detected, the script can generate one for you.

1. Apply database schema

```bash
pnpm db:push
# Optional: open Drizzle Studio
pnpm db:studio
```

1. Run the app

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`. If not signed in, you’ll be redirected to `/sign-in` (Clerk).

## Essential URLs (dev)

- App shell: `/`
- Focus: `/focus`
- Intelligence: `/intelligence`
- Demos: `/demos`, `/demos/chat`, `/demos/grid`, `/demos/speech`
- Auth: `/sign-in`
- `tRPC` endpoint: `/api/trpc`

## Project structure (selected)

- `src/app/` — `Next.js` App Router pages and API routes
- `src/server/` — `tRPC` routers and server utilities
- `src/ui/` — Isolated UI components
- `src/database/` — `Drizzle` schema and migrations
- `docs/` — concept docs and feature overviews

## Authentication

- Provider: `Clerk` (`@clerk/nextjs`)
- Middleware enforces auth for all routes except `/sign-in` (see `src/middleware.ts`).
- Required env:
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY`

## Data and migrations

- ORM: `Drizzle` (`drizzle-orm`)
- Schema: `src/database/schema.ts`
- Config: `drizzle.config.ts` (loads `.env.development.local`, `.env.local`, then `.env`)
- Commands:
  - `pnpm db:generate` — generate migrations from schema
  - `pnpm db:migrate` — apply migrations
  - `pnpm db:push` — push schema to DB (good for local dev)
  - `pnpm db:studio` — open Drizzle Studio

## tRPC

- Client providers in `src/trpc/react.tsx`; server utilities in `src/trpc/server.ts`.
- App router defined under `src/server/` (see `src/server/root.ts` and `src/server/routers/*`).
- Endpoint mounted at `/api/trpc`.

## UI/Styling

- `Mantine` (`@mantine/core`, dark theme by default)
- `Tailwind CSS` v4
- Custom components in `src/ui/components` and feature areas under `src/ui/*`

## Internationalization

- `next-intl` with messages in `src/i18n/messages/*`

## Observability

- `Sentry` config present (`@sentry/nextjs`). Add your DSN as needed.
- `Vercel Analytics` is enabled in the root layout.

## Scripts

```bash
pnpm dev                 # start Next.js dev (Turbo)
pnpm build               # production build
pnpm start               # start production server
pnpm typecheck           # TypeScript checks only
pnpm lint                # ESLint
pnpm format              # Prettier check
pnpm format:fix          # Prettier write
pnpm test                # Vitest (run)
pnpm test:watch          # Vitest in watch mode
pnpm test:coverage       # Vitest coverage
pnpm storybook           # Storybook at :6006
pnpm build-storybook     # Static Storybook build
pnpm db:generate         # Drizzle generate migrations
pnpm db:migrate          # Drizzle run migrations
pnpm db:push             # Drizzle push schema
pnpm db:studio           # Drizzle Studio
```
