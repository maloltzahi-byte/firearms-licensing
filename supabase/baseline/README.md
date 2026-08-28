# Live Supabase baseline — 2026-08-28

This directory records the authoritative live database state used by the RC production-readiness branch.

## Provenance

- Supabase project: `lcvshepgzizrlqbzvjoe`
- Live migration history captured: 21 versions
- Deterministic live-schema fingerprint: `7a6074dd1bd3e7e7cb283ca5fb3011b6`
- Fingerprint input: 47,247 bytes of canonicalized metadata covering columns, constraints, selected authorization/mutation functions, RLS policies, triggers, indexes and the case-document storage bucket.
- Current health migration: `20260828080143_add_public_health_ping_2026_08_28.sql`.

## Historical migration gap

The repository and the canonical UAT ZIP do **not** contain the SQL bodies for live migrations 1–19. The canonical ZIP and both nested source archives contain only the old `0001_initial.sql`. That file does not represent the current hardened live architecture and must not be treated as a production database baseline.

The missing historical SQL must never be reconstructed from guesses. `live-migration-manifest-2026-08-28.json` records the exact live version/name ledger. The current live schema is the source for a forward reproducible baseline.

## Current security shape verified from the live database

- RLS enabled on active exposed application tables.
- Case access is mediated by private helper functions and case membership/ownership.
- Sensitive access requires the sensitive-case helper.
- Lawyer/admin decision mutations require role authorization and AAL2.
- Security-definer authorization helpers use an empty `search_path`.
- Browser code uses only a publishable/anon key; no service-role key is exposed client-side.
- Storage bucket: `rfl-case-documents`, private, 15 MiB limit, PDF/JPEG/PNG only, with object policies bound to case access.
- `public.health_ping()` is a read-only RPC that returns only `ok`; it is used by `/api/health` to verify PostgREST without exposing case data.

## Open production security setting

Supabase Security Advisor still reports **Leaked Password Protection disabled**. This remains a production gate until enabled and re-verified.

## Rule

Do not promote a database change merely because the application build is green. Re-check the live migration ledger, schema fingerprint/security policies and migration file for every DB mutation before promotion.
