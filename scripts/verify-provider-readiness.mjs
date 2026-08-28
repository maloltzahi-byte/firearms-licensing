import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const failures = []
const requiredFiles = [
  'src/lib/providers/contracts.ts',
  'src/lib/providers/config.ts',
  'docs/integrations/PROVIDER_READINESS.md',
  '.env.example',
]

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) failures.push(`missing:${file}`)
}

if (fs.existsSync(path.join(root, '.env.example'))) {
  const env = fs.readFileSync(path.join(root, '.env.example'), 'utf8')
  for (const key of [
    'PAYMENTS_ENABLED=false',
    'PAYMENT_PROVIDER=',
    'PAYMENT_WEBHOOK_SECRET=',
    'MESSAGING_ENABLED=false',
    'MESSAGING_PROVIDER=',
    'MESSAGING_WEBHOOK_SECRET=',
    'SIGNATURE_ENABLED=false',
    'SIGNATURE_PROVIDER=',
    'SIGNATURE_WEBHOOK_SECRET=',
  ]) {
    if (!env.includes(key)) failures.push(`env-contract:${key}`)
  }
  if (/NEXT_PUBLIC_.*(?:SECRET|TOKEN|API_KEY|SERVICE_ROLE)\s*=/.test(env)) {
    failures.push('public-secret-variable')
  }
}

if (fs.existsSync(path.join(root, 'src/lib/providers/contracts.ts'))) {
  const contracts = fs.readFileSync(path.join(root, 'src/lib/providers/contracts.ts'), 'utf8')
  for (const marker of ['idempotencyKey', 'verifyWebhook', 'EXTERNAL_PROVIDER_DECISION_GATE_WRITABLE = false']) {
    if (!contracts.includes(marker)) failures.push(`provider-contract:${marker}`)
  }
}

function walk(dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name)
    return entry.isDirectory() ? walk(file) : [file]
  })
}

for (const file of walk(path.join(root, 'src')).filter((f) => /\.(?:ts|tsx|js|jsx)$/.test(f))) {
  const text = fs.readFileSync(file, 'utf8')
  if (/sb_secret_[A-Za-z0-9_-]+/.test(text)) failures.push(`inline-supabase-secret:${path.relative(root, file)}`)
}

if (failures.length) {
  console.error('PROVIDER READINESS VERIFY FAIL', failures)
  process.exit(1)
}

console.log('PROVIDER READINESS VERIFY PASS: contracts/env/secrets/idempotency/webhook boundary')
