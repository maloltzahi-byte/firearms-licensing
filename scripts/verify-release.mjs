import fs from 'node:fs'
import path from 'node:path'
const root=process.cwd()
const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'))
const contracts=JSON.parse(fs.readFileSync(path.join(root,'stage11/screen-contracts.json'),'utf8'))
const routes=JSON.parse(fs.readFileSync(path.join(root,'data/routes.json'),'utf8'))
const modules=['public','guided','client','office','responsive','integration']
const fail=[]
if(pkg.dependencies.next!=='15.5.24') fail.push('next')
if(pkg.dependencies.react!=='19.2.6'||pkg.dependencies['react-dom']!=='19.2.6') fail.push('react')
if(contracts.count!==98||contracts.contracts.length!==98) fail.push('contracts')
const routeCount=Array.isArray(routes)?routes.length:(Array.isArray(routes.routes)?routes.routes.length:Object.keys(routes).length)
if(routeCount!==45) fail.push(`routes:${routeCount}`)
for(const m of modules) if(!fs.existsSync(path.join(root,`stage11/modules/${m}.html`))) fail.push(`module:${m}`)
if(fail.length){console.error('RELEASE VERIFY FAIL',fail);process.exit(1)}
console.log('RELEASE VERIFY PASS: 98 contracts / 6 Stage 11 modules / 45 routes / Next 15.5.24 / React 19.2.6')
