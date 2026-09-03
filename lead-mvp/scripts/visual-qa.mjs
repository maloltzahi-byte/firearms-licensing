// Canonical visual gate: 1440 desktop, 390 mobile, and centered 1440 canvas at 1920 viewport.
import { chromium } from 'playwright'
import fs from 'node:fs/promises'

const base = 'http://127.0.0.1:3100'
const out = process.env.QA_OUT || 'qa-screenshots'
await fs.mkdir(out, { recursive: true })

async function assertPage(page, label, viewportWidth) {
  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    direction: getComputedStyle(document.documentElement).direction,
  }))
  if (metrics.scrollWidth > viewportWidth + 1) throw new Error(`${label}: horizontal overflow ${metrics.scrollWidth}px > ${viewportWidth}px`)
  if (metrics.direction !== 'rtl') throw new Error(`${label}: expected RTL, received ${metrics.direction}`)
}

async function shot(page, name, viewportWidth, fullPage = true) {
  await page.waitForLoadState('networkidle')
  await assertPage(page, name, viewportWidth)
  await page.screenshot({ path: `${out}/${name}.png`, fullPage })
}

async function clickChoice(page, text) {
  const button = page.locator('button').filter({ hasText: text }).first()
  await button.scrollIntoViewIfNeeded()
  await button.click()
}

async function flow(page, prefix, width) {
  await page.goto(`${base}/check`, { waitUntil: 'networkidle' })
  await shot(page, `${prefix}-02-step1`, width)
  await clickChoice(page, '21–26')
  await clickChoice(page, 'כן')
  await clickChoice(page, 'המשך')
  await shot(page, `${prefix}-03-step2`, width)
  await clickChoice(page, 'אזרח ישראלי')
  await clickChoice(page, 'כן, 3 שנים ברציפות ומעלה')
  await clickChoice(page, 'המשך')
  await shot(page, `${prefix}-04-step3`, width)
  await clickChoice(page, 'סיימתי שירות סדיר מלא')
  await clickChoice(page, 'המשך')
  await shot(page, `${prefix}-05-step4`, width)
  await clickChoice(page, 'טרם הגשתי בקשה')
  await clickChoice(page, 'לא ידועה לי מניעה')
  await clickChoice(page, 'המשך')
  await shot(page, `${prefix}-06-step5`, width)
  await clickChoice(page, 'שירות ביטחוני')
  await clickChoice(page, 'הצגת תוצאה ראשונית')
  await page.waitForURL('**/check/result')
  await shot(page, `${prefix}-07-result`, width)
}

async function legal(page, prefix, width) {
  for (const [n, path, slug] of [['08','/privacy','privacy'],['09','/accessibility','accessibility'],['10','/terms','terms']]) {
    await page.goto(`${base}${path}`, { waitUntil: 'networkidle' })
    await shot(page, `${prefix}-${n}-${slug}`, width)
  }
}

function isExpectedLocalAnalyticsError(text) {
  return text.includes('/_vercel/insights/script.js') ||
    (text.includes('Failed to load resource') && text.includes('404')) ||
    (text.includes('Refused to execute script') && text.includes('_vercel/insights'))
}

function near(value, expected, tolerance = 1) { return Math.abs(value - expected) <= tolerance }
function mustRect(label, rect, expected) {
  if (!rect) throw new Error(`${label}: missing`)
  for (const [key, value] of Object.entries(expected)) {
    if (!near(rect[key], value)) throw new Error(`${label}: ${key}=${rect[key]} expected ${value}; rect=${JSON.stringify(rect)}`)
  }
}

async function assertWideDesktop(page) {
  await page.goto(base, { waitUntil: 'networkidle' })
  const home = await page.evaluate(() => {
    const rect = (selector) => {
      const r = document.querySelector(selector)?.getBoundingClientRect()
      return r && { x:r.x, y:r.y, width:r.width, height:r.height }
    }
    const h1 = document.querySelector('.rc-hero-copy h1')
    return {
      root: rect('.rc-site'), preview: rect('.rc-preview'), hero: rect('.rc-hero-copy'), h1: rect('.rc-hero-copy h1'),
      primary: rect('.rc-hero-actions .primary'), wa: rect('.rc-hero-actions .wa'), call: rect('.rc-hero-actions .call'),
      services: rect('.rc-services'), serviceCopy: rect('.rc-services-copy'), preflight: rect('.rc-preflight'),
      faq: rect('.rc-faq'), faqPanel: rect('.rc-faq-panel'), final: rect('.rc-final'),
      font: h1 ? getComputedStyle(h1).fontFamily : '',
    }
  })
  mustRect('wide home root', home.root, {x:240,width:1440})
  mustRect('wide preview', home.preview, {x:320,y:132,width:600,height:551})
  mustRect('wide H1', home.h1, {x:1000,y:150,width:560})
  mustRect('wide hero primary', home.primary, {x:1276,y:432,width:284,height:48})
  mustRect('wide hero whatsapp', home.wa, {x:1040,y:432,width:210,height:48})
  mustRect('wide hero call', home.call, {x:1040,y:496,width:210,height:48})
  mustRect('wide services', home.services, {x:240,y:852,height:717})
  mustRect('wide services copy', home.serviceCopy, {x:394,y:964,width:500})
  mustRect('wide preflight', home.preflight, {x:240,y:1555,height:518})
  mustRect('wide FAQ', home.faq, {x:240,y:2073,height:450})
  mustRect('wide FAQ panel', home.faqPanel, {x:310,y:2097,width:1290,height:402})
  mustRect('wide final', home.final, {x:240,y:2560,height:470})
  if (!/Assistant/i.test(home.font)) throw new Error(`wide home: Assistant not loaded; font=${home.font}`)
  await page.screenshot({ path: `${out}/wide-1920-home.png`, fullPage: false })

  await page.goto(`${base}/check`, { waitUntil: 'networkidle' })
  const wizard = await page.evaluate(() => {
    const rect = (selector) => {
      const r = document.querySelector(selector)?.getBoundingClientRect()
      return r && { x:r.x, y:r.y, width:r.width, height:r.height }
    }
    return { root:rect('.rc-flow-page'), side:rect('.rc-progress-side'), card:rect('.rc-question-card'), back:rect('.rc-q-nav .rc-btn-outline') }
  })
  mustRect('wide wizard root', wizard.root, {x:240,width:1440,height:960})
  mustRect('wide wizard sidebar', wizard.side, {x:340,y:146,width:280})
  mustRect('wide wizard card', wizard.card, {x:656,y:146,width:820,height:770})
  mustRect('wide wizard back', wizard.back, {width:96,height:48})
  await page.screenshot({ path: `${out}/wide-1920-step1.png`, fullPage: false })
}

const browser = await chromium.launch({ headless: true })
try {
  for (const spec of [{prefix:'desktop',width:1440,height:960},{prefix:'mobile',width:390,height:844}]) {
    const context = await browser.newContext({ viewport:{width:spec.width,height:spec.height}, locale:'he-IL' })
    const page = await context.newPage()
    const errors=[]
    page.on('pageerror', error => errors.push(`pageerror: ${error.message}`))
    page.on('console', msg => { if (msg.type()==='error' && !isExpectedLocalAnalyticsError(msg.text())) errors.push(`console: ${msg.text()}`) })
    await page.goto(base,{waitUntil:'networkidle'}); await shot(page,`${spec.prefix}-01-home`,spec.width)
    await flow(page,spec.prefix,spec.width); await legal(page,spec.prefix,spec.width)
    if(errors.length) throw new Error(`${spec.prefix}: browser errors\n${errors.join('\n')}`)
    await context.close()
  }
  const context = await browser.newContext({viewport:{width:1920,height:1080},locale:'he-IL'})
  const page=await context.newPage(); await assertWideDesktop(page); await context.close()
} finally { await browser.close() }
