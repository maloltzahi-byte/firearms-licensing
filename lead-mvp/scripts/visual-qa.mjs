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

async function assertWideDesktop(page) {
  await page.goto(base, { waitUntil: 'networkidle' })
  const home = await page.evaluate(() => {
    const root = document.querySelector('.rc-site')?.getBoundingClientRect()
    const preview = document.querySelector('.rc-preview')?.getBoundingClientRect()
    const hero = document.querySelector('.rc-hero-copy')?.getBoundingClientRect()
    const h1 = document.querySelector('.rc-hero-copy h1')
    return {
      root: root && { x: root.x, width: root.width },
      preview: preview && { x: preview.x, width: preview.width },
      hero: hero && { x: hero.x, width: hero.width },
      font: h1 ? getComputedStyle(h1).fontFamily : '',
    }
  })
  if (!home.root || Math.abs(home.root.width - 1440) > 1 || Math.abs(home.root.x - 240) > 1) throw new Error(`wide home: canonical root mismatch ${JSON.stringify(home.root)}`)
  if (!home.preview || Math.abs(home.preview.x - 320) > 1 || Math.abs(home.preview.width - 600) > 1) throw new Error(`wide home: preview mismatch ${JSON.stringify(home.preview)}`)
  if (!home.hero || Math.abs(home.hero.x - 1000) > 1 || Math.abs(home.hero.width - 560) > 1) throw new Error(`wide home: hero mismatch ${JSON.stringify(home.hero)}`)
  if (/serif/i.test(home.font)) throw new Error(`wide home: wrong font ${home.font}`)
  await page.screenshot({ path: `${out}/wide-1920-home.png`, fullPage: false })

  await page.goto(`${base}/check`, { waitUntil: 'networkidle' })
  const wizard = await page.evaluate(() => {
    const root = document.querySelector('.rc-flow-page')?.getBoundingClientRect()
    const side = document.querySelector('.rc-progress-side')?.getBoundingClientRect()
    const card = document.querySelector('.rc-question-card')?.getBoundingClientRect()
    return {
      root: root && { x: root.x, width: root.width },
      side: side && { x: side.x, width: side.width },
      card: card && { x: card.x, width: card.width },
    }
  })
  if (!wizard.root || Math.abs(wizard.root.width - 1440) > 1 || Math.abs(wizard.root.x - 240) > 1) throw new Error(`wide wizard: canonical root mismatch ${JSON.stringify(wizard.root)}`)
  if (!wizard.side || Math.abs(wizard.side.x - 340) > 1 || Math.abs(wizard.side.width - 280) > 1) throw new Error(`wide wizard: sidebar mismatch ${JSON.stringify(wizard.side)}`)
  if (!wizard.card || Math.abs(wizard.card.x - 656) > 1 || Math.abs(wizard.card.width - 820) > 1) throw new Error(`wide wizard: card mismatch ${JSON.stringify(wizard.card)}`)
  await page.screenshot({ path: `${out}/wide-1920-step1.png`, fullPage: false })
}

const browser = await chromium.launch({ headless: true })
try {
  for (const spec of [
    { prefix: 'desktop', width: 1440, height: 960 },
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

  const wideContext = await browser.newContext({ viewport: { width: 1920, height: 1080 }, locale: 'he-IL' })
  const widePage = await wideContext.newPage()
  await assertWideDesktop(widePage)
  await wideContext.close()
} finally {
  await browser.close()
}
