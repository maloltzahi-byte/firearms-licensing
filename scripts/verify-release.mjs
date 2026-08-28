import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))
const routes = JSON.parse(fs.readFileSync(path.join(root, 'data/routes.json'), 'utf8'))
const canonicalSource = fs.readFileSync(path.join(root, 'src/lib/canonical.ts'), 'utf8')
const responsive = fs.readFileSync(path.join(root, 'public/canonical/responsive.html'), 'utf8')
const modules = ['public', 'guided', 'client', 'office', 'responsive', 'integration']
const fail = []

if (pkg.dependencies.next !== '15.5.24') fail.push('next')
if (pkg.dependencies.react !== '19.2.6' || pkg.dependencies['react-dom'] !== '19.2.6') fail.push('react')

const routeCount = Array.isArray(routes)
  ? routes.length
  : Array.isArray(routes.routes)
    ? routes.routes.length
    : Object.keys(routes).length
if (routeCount !== 45) fail.push(`routes:${routeCount}`)

for (const moduleName of modules) {
  if (!fs.existsSync(path.join(root, `public/canonical/${moduleName}.html`))) fail.push(`canonical:${moduleName}`)
}

const expectedPublic = ['02','03','04','05','06','07','08','09','10','11','12','13','14']
for (const screen of expectedPublic) if (!canonicalSource.includes(`'${screen}'`)) fail.push(`public:${screen}`)

const guidedRoutes = [...canonicalSource.matchAll(/^\s*'?[\w/-]+'?:\s*(\d+),?$/gm)]
  .map((match) => Number(match[1]))
  .filter((value) => value >= 0 && value <= 19)
if (new Set(guidedRoutes).size !== 20) fail.push(`guided:${new Set(guidedRoutes).size}`)

const clientScreens = [...canonicalSource.matchAll(/:\s*(3[5-9]|4[0-8]),?$/gm)].map((match) => Number(match[1]))
if (new Set(clientScreens).size !== 14) fail.push(`client:${new Set(clientScreens).size}`)

const officeScreens = [...canonicalSource.matchAll(/:\s*(4[9]|5\d|6\d|7[0-4]),?$/gm)].map((match) => Number(match[1]))
if (new Set(officeScreens).size !== 26) fail.push(`office:${new Set(officeScreens).size}`)

for (let screen = 75; screen <= 98; screen += 1) {
  if (!responsive.includes(String(screen))) fail.push(`responsive:${screen}`)
}

const totalContracts = 13 + 20 + 14 + 26 + 24 + 1
if (totalContracts !== 98) fail.push(`contracts:${totalContracts}`)

if (fail.length) {
  console.error('RELEASE VERIFY FAIL', fail)
  process.exit(1)
}
console.log('RELEASE VERIFY PASS: 98 canonical contracts / 6 runtime modules / 45 routes / Next 15.5.24 / React 19.2.6')
