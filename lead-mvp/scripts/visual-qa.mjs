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
  for (const [n, path, slug] of [
    ['08', '/privacy', 'privacy'],
    ['09', '/accessibility', 'accessibility'],
    ['10', '/terms', 'terms'],
  ]) {
    await page.goto(`${base}${path}`, { waitUntil: 'networkidle' })
    await shot(page, `${prefix}-${n}-${slug}`, width)
  }
}

function isExpectedLocalAnalyticsError(text) {
  return text.includes('/_vercel/insights/script.js') ||
    (text.includes('Failed to load resource') && text.includes('404')) ||
    (text.includes('Refused to execute script') && text.includes('_vercel/insights'))
}

const browser = await chromium.launch({ headless: true })
try {
  for (const spec of [
    { prefix: 'desktop', width: 1440, height: 1000 },
    { prefix: 'mobile', width: 390, height: 844 },
  ]) {
    const context = await browser.newContext({ viewport: { width: spec.width, height: spec.height }, locale: 'he-IL' })
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`))
    page.on('console', (msg) => {
      if (msg.type() !== 'error') return
      const text = msg.text()
      if (!isExpectedLocalAnalyticsError(text)) errors.push(`console: ${text}`)
    })

    await page.goto(base, { waitUntil: 'networkidle' })
    await shot(page, `${spec.prefix}-01-home`, spec.width)
    await flow(page, spec.prefix, spec.width)
    await legal(page, spec.prefix, spec.width)

    if (errors.length) throw new Error(`${spec.prefix}: browser errors\n${errors.join('\n')}`)
    await context.close()
  }
} finally {
  await browser.close()
}
