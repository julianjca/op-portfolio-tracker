# AGENTS.md

Guidance for AI agents working in this repository. Keep instructions universally applicable; point to source files instead of duplicating content.

## Codebase Map (WHAT)

- `src/app/`: Next 15 App Router — `(site)` public routes (catch-all `[...slug]`, blog, our-work), `(admin)` protected routes (pages, slides, blog, jobs, applications, analytics), `api/`, `middleware.ts`
- `src/components/`: Reusable UI; shadcn in `src/components/ui/` (kebab-case)
- `src/lib/`: Utilities, Supabase client, CMS helpers
- `src/constants/`: CMS block definitions (`blockDefinitions.ts`), component registry (`blocks.ts`)
- `supabase/`: Schemas (`schemas/*.sql`), migrations, edge functions, seed data
- `public/`, `docs/`, `scripts/`: Static assets and tooling

## Purpose and Architecture (WHY)

- **Stack**: Next.js 15 (App Router, Turbopack) + Supabase (Postgres, Auth, RLS) + PostHog (analytics/flags) + Tailwind v4 + shadcn/ui
- **CMS**: Versioned blocks/pages (draft/live) with ISR (60s). Blocks are JSON-schema-defined in `blockDefinitions.ts`, mapped to components in `blocks.ts`, implemented in `src/components/cms/blocks/`
- **Admin**: Protected `(admin)` routes with RBAC; middleware enforces permissions

## Commands (HOW)

```bash
# Development
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm lint         # ESLint + Prettier (always run before completing work)

# Database
pnpm db:gen-types              # Regenerate Supabase types
pnpm db:gen-block-migration    # Generate CMS block migration
supabase start | stop          # Local Supabase
supabase db diff -f <name>     # Create migration from schema changes
supabase db reset              # Reset local DB (destructive)

# Edge Functions
pnpm supabase:run-local-functions  # Requires .env.local + Supabase CLI
```

## Key Workflows

**CMS Block**: `blockDefinitions.ts` → `src/components/cms/blocks/` → `blocks.ts` → `pnpm db:gen-block-migration` → apply migration → `pnpm db:gen-types`

**Database Change**: Edit `supabase/schemas/*.sql` (append new columns at end) → `supabase db diff -f <name>` → review migration → apply → `pnpm db:gen-types`

**Content Flow**: Edit draft → preview → publish (promotes draft to live, triggers ISR revalidation)

## Extended Documentation (read when relevant)

Read these files **only when working on related tasks** — don't load them by default:

| When working on...                       | Read                                           |
| ---------------------------------------- | ---------------------------------------------- |
| Project architecture, detailed structure | `docs/ai-context/project-structure.md`         |
| Cross-component integration              | `docs/ai-context/system-integration.md`        |
| Deployment, infrastructure               | `docs/ai-context/deployment-infrastructure.md` |
| Postgres functions                       | `.claude/rules/postgres-create-functions.md`   |
| RLS policies                             | `.claude/rules/postgres-rls-policies.md`       |
| SQL style                                | `.claude/rules/postgres-sql-style.md`          |
| Supabase schemas                         | `.claude/rules/supabase-declarative-schema.md` |
| Edge functions                           | `.claude/rules/supabase-edge-functions.md`     |
| Queue system (PGMQ + async processing)   | `.claude/rules/queue-system.md`                |

## Development Patterns

- **Server Components by default**; add `use client` only when necessary
- **Await params** before use (Promise in Next 15)
- **Forms**: `react-hook-form` + `zod` + `@hookform/resolvers/zod`
- **Client data**: `@tanstack/react-query`; server data via Supabase client
- **Styling**: Tailwind v4; shadcn components stay kebab-case in `src/components/ui/`
- **PostHog**: Centralize flag names (UPPER_SNAKE_CASE), proxy via `/ingest/*`
- **Auth**: Guard admin via `middleware.ts` + RBAC context; service keys stay server-side only

## Environment

Copy `example.env` → `.env.local`. Required vars:

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`
- `NEXT_PUBLIC_SITE_URL`, `PREVIEW_SECRET`

**Security**: Never commit secrets. Service keys stay server-side/edge only.

## Verification

- **Always run `pnpm lint`** before completing work — it auto-fixes formatting
- No unit test runner configured; rely on types + manual QA
- Before risky ops (migrations, rewrites), summarize impact and verification steps

## Commits and PRs

- Conventional Commits: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`
- PRs: Clear description, linked issues, screenshots for UI, migration notes

## Agent Operating Principles

**Priority order**: Explicit constraints → operation reversibility → prerequisites → user preferences. Never trade correctness for speed.

**Task approach**:

- Trivial (<10 lines): Answer directly
- Moderate/complex: Plan first (objectives, constraints, options, trade-offs) → then implement

**Quality focus**: Root causes over symptoms. State assumptions when they affect decisions. Avoid over-explaining basics.

**Risk management**: Warn before destructive commands (`rm`, `reset`, `force push`). Offer safer alternatives.

**Self-discipline**:

- Fix your own errors (syntax, imports, formatting) immediately without asking
- Stay concise; avoid unrelated changes
- Cite files with `path:line` format when referencing code

**Don'ts**: No invented secrets. No history-rewriting git unless asked. No off-topic refactors. No basic tutorials unless requested.
