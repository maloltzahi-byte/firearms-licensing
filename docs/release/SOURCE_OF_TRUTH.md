# Source of Truth — Production Readiness

1. Regulatory behaviour: official-source regulatory baseline and `data/routes.json`.
2. Product/UI surface: `stage11/screen-contracts.json` and `stage11/modules/*` — 98 approved contracts.
3. Guidance engine: `src/brain/*` with exactly 45 routes from `data/routes.json`.
4. Live backend: Supabase project `lcvshepgzizrlqbzvjoe`; applied migration history on that project is authoritative for deployed schema.
5. Deployment rollback reference: Vercel last-known-good production candidate `dpl_5YHirXhMnyyWCLeV7ZW5bUY4ivA5` until a new production release is explicitly approved.
6. `source-archives/*` are provenance only and are not active implementation sources.
7. Release-candidate source is developed and verified on `rc/production-readiness-2026-08-27`; Production/main is not promoted until all release gates pass.
8. External providers are operational integrations only and may never write a legal Decision Gate directly.
