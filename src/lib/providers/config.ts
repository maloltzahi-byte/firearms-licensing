type ProviderMode = 'disabled' | 'sandbox' | 'live'

export type ProviderReadiness = {
  kind: 'payments' | 'messaging' | 'signature' | 'observability'
  provider: string | null
  mode: ProviderMode
  configured: boolean
  missing: string[]
}

function mode(enabled: boolean, live: boolean): ProviderMode {
  if (!enabled) return 'disabled'
  return live ? 'live' : 'sandbox'
}

function required(names: string[]) {
  return names.filter((name) => !process.env[name]?.trim())
}

export function getProviderReadiness(): ProviderReadiness[] {
  const paymentProvider = process.env.PAYMENT_PROVIDER?.trim() || null
  const messagingProvider = process.env.MESSAGING_PROVIDER?.trim() || null
  const signatureProvider = process.env.SIGNATURE_PROVIDER?.trim() || null

  const paymentsEnabled = process.env.PAYMENTS_ENABLED === 'true'
  const messagingEnabled = process.env.MESSAGING_ENABLED === 'true'
  const signatureEnabled = process.env.SIGNATURE_ENABLED === 'true'

  const paymentMissing = paymentsEnabled
    ? required(['PAYMENT_PROVIDER', 'PAYMENT_API_KEY', 'PAYMENT_WEBHOOK_SECRET'])
    : []
  const messagingMissing = messagingEnabled
    ? required(['MESSAGING_PROVIDER', 'MESSAGING_API_TOKEN', 'MESSAGING_WEBHOOK_SECRET'])
    : []
  const signatureMissing = signatureEnabled
    ? required(['SIGNATURE_PROVIDER', 'SIGNATURE_API_KEY', 'SIGNATURE_WEBHOOK_SECRET'])
    : []
  const observabilityMissing = required(['SENTRY_DSN'])

  return [
    {
      kind: 'payments',
      provider: paymentProvider,
      mode: mode(paymentsEnabled, process.env.PAYMENT_LIVE_MODE === 'true'),
      configured: paymentsEnabled && paymentMissing.length === 0,
      missing: paymentMissing,
    },
    {
      kind: 'messaging',
      provider: messagingProvider,
      mode: mode(messagingEnabled, process.env.MESSAGING_LIVE_MODE === 'true'),
      configured: messagingEnabled && messagingMissing.length === 0,
      missing: messagingMissing,
    },
    {
      kind: 'signature',
      provider: signatureProvider,
      mode: mode(signatureEnabled, process.env.SIGNATURE_LIVE_MODE === 'true'),
      configured: signatureEnabled && signatureMissing.length === 0,
      missing: signatureMissing,
    },
    {
      kind: 'observability',
      provider: 'sentry',
      mode: process.env.SENTRY_DSN ? 'live' : 'disabled',
      configured: observabilityMissing.length === 0,
      missing: observabilityMissing,
    },
  ]
}

export function assertNoPublicProviderSecrets() {
  const forbidden = Object.keys(process.env).filter((key) =>
    /^NEXT_PUBLIC_.*(?:SECRET|TOKEN|API_KEY|SERVICE_ROLE)/.test(key),
  )
  if (forbidden.length) {
    throw new Error(`Provider secret exposed with NEXT_PUBLIC_ prefix: ${forbidden.join(', ')}`)
  }
}
