# RFL Lead MVP — deployment gate

This application must be deployed as a **new, separate Vercel project**. Do not repurpose or modify the existing `firearms-licensing` project.

## Project settings

- Repository: `maloltzahi-byte/firearms-licensing`
- Root Directory: `lead-mvp`
- Production Branch: `lead-mvp/2026-08-30`
- Framework: Next.js
- Node.js: 24.x
- Install command: `pnpm install --no-frozen-lockfile`
- Build command: `pnpm build`
- The project-level ignored build step is supplied by `lead-mvp/vercel.json` and builds only the dedicated branch.

## Environment

Populate every variable from `.env.example` before production. Do not define any database-provider URL, key, token or database environment variable in this project.

The production gate stays closed until these public identity fields contain the lawyer's verified current details rather than placeholders:

- `NEXT_PUBLIC_LAWYER_LICENSE`
- `NEXT_PUBLIC_OFFICE_ADDRESS`
- `NEXT_PUBLIC_OFFICE_PHONE`
- `NEXT_PUBLIC_OFFICE_EMAIL`
- `NEXT_PUBLIC_WHATSAPP`
- `NEXT_PUBLIC_ACCESSIBILITY_COORDINATOR`

## Email

Verify the sending domain with Resend, set `LEAD_EMAIL_FROM`, and test all three independent deliveries:

1. primary office mailbox;
2. backup office mailbox;
3. automatic acknowledgement to the lead.

A production test must also force a provider failure and confirm that the UI exposes the office phone number.

## Strict rate limit

The in-process limiter in `src/lib/rate-limit.ts` is a defense-in-depth fallback only. A serverless process is not a durable global counter.

Before production, publish a Vercel Firewall rate-limit rule on the new project for the lead submission request:

- method: `POST`
- path: `/check/result`
- key: IP
- algorithm: fixed window
- window: 3600 seconds
- requests: 5
- action when exceeded: deny/rate-limit

Verify the actual Server Action request path in Preview before publishing the rule. If Vercel reports a different normalized path, bind the rule to that observed path rather than guessing.

## Analytics and the zero-network wording

The product brief simultaneously requires Vercel Analytics events before submission and says there must be zero network requests until submission. Those requirements cannot both be literally true: Web Analytics transmits page-view/custom-event requests to Vercel.

Current implementation treats privacy-preserving Vercel Analytics as the sole exception to the zero-application-network rule. The screening flow itself makes no API/database request before the lead form is submitted, and custom events contain only the step number or result color.

## Final production gate

Do not promote until all of the following are verified on the same frozen deployment:

- install, typecheck, unit tests and Next build pass;
- no `src/middleware.ts` exists inside this app;
- application source has no database-provider import or client;
- five-step screening works with no application network request before form submission;
- locality is used only as a name dictionary and never as an eligibility source;
- no medical reason, criminal-history detail, restraining-order detail, exact DOB or ID number is collected;
- office + backup + confirmation emails arrive;
- firewall rate limit is active;
- mobile/tablet/desktop responsive QA passes with no horizontal overflow;
- automated accessibility scan has zero critical/serious findings;
- `robots.txt`, `sitemap.xml`, metadata and JSON-LD resolve correctly;
- Web Analytics and the four required events are visible;
- custom domain has HTTPS;
- the full-system database and its live Vercel project remain unchanged.
