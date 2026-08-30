# RFL Lead MVP

Standalone lead-generation experiment for private firearms licensing legal services.

## Isolation rules

- This app has no database connection, authentication, account area, document upload or payment flow.
- It must be deployed as a separate Vercel project with **Root Directory = `lead-mvp`**.
- Production Branch must be `lead-mvp/2026-08-30`.
- Do not add database environment variables to this project.
- `data/routes.json` and `data/localities.json` are consumed from the parent repository at build time. Locality data is used only for name normalization; eligibility is never derived from it.
- The parent application excludes this directory from its TypeScript project so the two applications cannot resolve each other's aliases.

## Required environment variables

See `.env.example`. Production must not be enabled until the lawyer license number, office address, phone, office email and accessibility contact details are populated.

## Verification

Run from this directory:

```bash
pnpm install --no-frozen-lockfile
pnpm typecheck
pnpm test
pnpm build
```

Before production, verify that no file exists at `src/middleware.ts` and that a case-insensitive search for the prohibited database provider name under this app's `src/` returns zero matches.
