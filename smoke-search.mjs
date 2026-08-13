import { chromium } from 'playwright-core'

const browser = await chromium.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
})
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
const errors = []
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()) })
page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`))

await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 20000 })
await page.waitForTimeout(1000)

// Type into the hero search bar
const heroInput = page.locator('input[aria-label="Search for a movie, TV show or person"]').first()
await heroInput.click()
await heroInput.fill('spider')
await page.waitForTimeout(2000)

await page.screenshot({ path: 'hero-search.png', fullPage: false })
console.log('errors:', JSON.stringify(errors, null, 2))

// Check the dropdown is actually visible (not clipped/hidden) and its bounding box
const dropdown = page.locator('ul[aria-label="Search suggestions"]')
const visible = await dropdown.isVisible().catch(() => false)
const box = visible ? await dropdown.boundingBox() : null
console.log('dropdown visible:', visible, 'box:', JSON.stringify(box))

await browser.close()
