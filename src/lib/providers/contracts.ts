export type ProviderResult<T> =
  | { ok: true; value: T; providerRequestId?: string }
  | { ok: false; code: string; message: string; retryable: boolean; providerRequestId?: string }

export type Money = {
  amount: number
  currency: 'ILS'
}

export type PaymentCheckoutRequest = {
  idempotencyKey: string
  caseId: string
  customerReference: string
  description: string
  money: Money
  successUrl: string
  cancelUrl: string
}

export type PaymentCheckout = {
  checkoutId: string
  checkoutUrl: string
  expiresAt?: string
}

export type PaymentWebhookEvent = {
  eventId: string
  type: string
  occurredAt: string
  paymentReference?: string
  rawReference?: string
}

export interface PaymentProvider {
  readonly name: string
  createCheckout(request: PaymentCheckoutRequest): Promise<ProviderResult<PaymentCheckout>>
  verifyWebhook(rawBody: string, signature: string | null): Promise<ProviderResult<PaymentWebhookEvent>>
  refund(input: { idempotencyKey: string; paymentReference: string; money?: Money; reason: string }): Promise<ProviderResult<{ refundReference: string }>>
}

export type OutboundMessage = {
  idempotencyKey: string
  caseId: string
  recipient: string
  templateKey: string
  variables: Record<string, string>
}

export interface MessagingProvider {
  readonly name: string
  sendTransactional(message: OutboundMessage): Promise<ProviderResult<{ messageReference: string }>>
  verifyWebhook?(rawBody: string, signature: string | null): Promise<ProviderResult<{ eventId: string; type: string }>>
}

export interface SignatureProvider {
  readonly name: string
  createEnvelope(input: {
    idempotencyKey: string
    caseId: string
    signerReference: string
    documentReference: string
    callbackUrl: string
  }): Promise<ProviderResult<{ envelopeReference: string; signingUrl?: string }>>
  verifyWebhook(rawBody: string, signature: string | null): Promise<ProviderResult<{ eventId: string; type: string; envelopeReference?: string }>>
}

export type ProviderAuditContext = {
  provider: string
  operation: string
  idempotencyKey: string
  caseId?: string
  actorUserId?: string
}

// External providers may never write a legal Decision Gate directly.
// Provider events must be translated into operational/audit events and then
// processed by the application's authorized server-side workflow.
export const EXTERNAL_PROVIDER_DECISION_GATE_WRITABLE = false as const
