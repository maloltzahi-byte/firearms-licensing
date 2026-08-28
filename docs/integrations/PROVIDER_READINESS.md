# Provider Integration Readiness

## Status

The application is adapter-ready but no external commercial provider is enabled by default. Production feature flags remain disabled until a named provider has completed sandbox certification.

## Mandatory boundary

External payment, messaging, signature, CRM or reporting systems are operational providers only. They may create operational events, payment/message/signature records and audit metadata, but they must never write the legal Decision Gate directly.

## Contract required for every provider

1. A server-side adapter implements the typed contract in `src/lib/providers/contracts.ts`.
2. Secrets are server-only environment variables; no secret may use `NEXT_PUBLIC_`.
3. Live mode is disabled separately from feature enablement.
4. Every mutating request has an idempotency key.
5. Webhooks are accepted only after signature verification against the raw request body.
6. Duplicate webhook event IDs are ignored safely and recorded.
7. Provider request/event IDs are stored in the audit trail without storing secrets.
8. Retryable and terminal failures are distinguished. No provider failure changes a legal decision automatically.
9. Sandbox tests cover success, decline/failure, timeout, retry, duplicate webhook, invalid signature and provider outage.
10. Production activation requires provider-specific rollback instructions and a successful end-to-end test on the exact release candidate.

## Payment integration

Required before enablement: provider name, API key, webhook secret, checkout adapter, refund adapter, signature verification, idempotency persistence, success/cancel return routes and reconciliation against `payment_records`.

The canonical payment screen is currently a consent/scope gate only. It must not claim that a charge occurred until a real payment adapter records a verified provider transaction.

## Messaging / WhatsApp integration

Required before enablement: provider name/token, approved template mapping, recipient normalization, opt-in/legal basis as applicable, webhook authentication, delivery-status mapping, retry policy and audit event emission. Legal conclusions may not be generated or sent by the provider.

## Electronic signature integration

Required before enablement: provider name/key, envelope adapter, signer reference, signed-document ingestion into the private document store, webhook verification, immutable audit metadata and failure/expiry handling.

## Observability

Sentry is present as a dependency but is not considered configured until a server-side DSN/configuration is supplied and a controlled test error is observed in the selected environment.

## Go-live gate

Provider readiness is PASS only when `npm run providers:verify` passes and the selected provider has a documented sandbox E2E result. Keeping the adapters and environment contract in place is not the same as being connected to a provider.
