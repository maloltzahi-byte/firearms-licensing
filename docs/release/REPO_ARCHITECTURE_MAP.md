# Repo Architecture Map

## Runtime
- Next.js 15.5.24 App Router
- React / React DOM 19.2.6
- TypeScript strict
- Node 22+
- pnpm 9.15.9 with committed `pnpm-lock.yaml`
- Supabase Auth / Postgres / Storage / RLS
- Vercel deployment target

## Application surfaces
- `src/app/(public)` — public website, legal pages, login and canonical routes
- `src/app/(client)/app` — authenticated client area
- `src/app/(cockpit)/cockpit` — authenticated staff/lawyer cockpit
- `src/app/api` — guidance and authenticated questionnaire APIs
- `src/app/auth` — callbacks, password update and signout

## Core business logic
- `src/brain/01-intake.ts` … `09-audit-emit.ts` — advisory 9-layer guidance engine
- `data/routes.json` — canonical 45 routes
- `data/universal-questions.json` — universal intake fields
- `data/questionnaire-routes.json` — route-specific questions

## Data / authorization
- Supabase live schema is authoritative for deployed DB structure
- operational tables are RLS scoped
- private Storage bucket: `rfl-case-documents`
- guarded RPCs own sensitive legal mutations

## Canonical visual layer
- `stage11/screen-contracts.json` — 98 contracts
- `stage11/modules/*` — approved Stage 11 visual surfaces
- `public/canonical/*` — browser-served runtime copies

## Provider boundary
- `src/lib/providers/contracts.ts` — typed payment/messaging/signature contracts
- `src/lib/providers/config.ts` — feature gates/readiness
- providers never write legal Decision Gate state directly

## Release assurance
- `.github/workflows/rc-e2e.yml` — advanced interactive browser QA
- `scripts/verify-release.mjs` — 98 contracts / six modules / 45 routes
- `scripts/verify-production-readiness.mjs` — static production guard
- `scripts/verify-provider-readiness.mjs` — provider boundary guard
