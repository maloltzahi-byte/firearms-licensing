import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const fail = []
const required = [
  'docs/release/SOURCE_OF_TRUTH.md',
  'docs/release/REPO_ARCHITECTURE_MAP.md',
  'docs/release/MASTER_SCREEN_ROUTE_INVENTORY.md',
  'docs/release/PHASE_1_GATE.md',
  'docs/release/PULSE_2_GATE.md',
  'src/app/(public)/privacy/page.tsx',
  'src/app/(public)/terms/page.tsx',
  'src/app/(public)/accessibility/page.tsx',
  'src/app/(public)/login/page.tsx',
  'src/app/(client)/app/page.tsx',
  'src/app/(cockpit)/cockpit/page.tsx',
  'src/app/api/cases/[caseId]/questionnaire/route.ts',
]
for (const file of required) if (!fs.existsSync(path.join(root, file))) fail.push(`missing:${file}`)

const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))
if (pkg.packageManager !== 'pnpm@9.15.9') fail.push('package-manager-not-pinned')
if (pkg.engines?.node !== '>=22.0.0') fail.push('node-runtime')
if (process.env.REQUIRE_LOCKFILE === '1' && !fs.existsSync(path.join(root, 'pnpm-lock.yaml'))) fail.push('pnpm-lock-missing')

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(dir, entry.name)
    return entry.isDirectory() ? walk(absolute) : [absolute]
  })
}
const clientFiles = ['src', 'public'].flatMap((dir) => walk(path.join(root, dir))).filter((file) => /\.(?:ts|tsx|js|jsx|html)$/.test(file))
for (const file of clientFiles) {
  const text = fs.readFileSync(file, 'utf8')
  if (/sb_secret_[A-Za-z0-9_-]+/.test(text)) fail.push(`secret:${path.relative(root, file)}`)
}

const env = fs.readFileSync(path.join(root, '.env.example'), 'utf8')
if (!env.includes('PAYMENTS_ENABLED=false')) fail.push('payments-gate')
if (/SUPABASE_SERVICE_ROLE_KEY=\S+/.test(env)) fail.push('service-role-example-populated')

if (fail.length) {
  console.error('PRODUCTION READINESS STATIC VERIFY FAIL', fail)
  process.exit(1)
}
console.log('PRODUCTION READINESS STATIC VERIFY PASS')
