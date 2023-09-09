import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import { sleep } from './tools'
import json from './data.json'
puppeteer.use(StealthPlugin())
let data = json as any[]
let i = 0
async function main() {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    })
    const page = await browser.newPage()
    await page.goto('https://www.deepl.com/en/login/', { waitUntil: 'networkidle0' })
    await page.type('[data-testid="menu-login-username"]', 'chitorogcostea@gmail.com')
    await page.type('[data-testid="menu-login-password"]', '24PT,5sge4MhUHy')
    page.click('[data-testid="menu-login-submit"]')
    await page.waitForNavigation({ waitUntil: 'networkidle0' })
    console.log('Logged in!')
    await page.evaluate(() => {
        return navigator.clipboard.readText()
    })
    for (const item of data) {
        if (item.toIndexDataEn) continue
        await page.evaluate(async (text: string) => {
            //@ts-ignore
            const el = document.querySelector('[data-testid="translator-source-input"] > div')!
            el.innerHTML = text
            await new Promise((resolve) => setTimeout(resolve, 1000))
            el.dispatchEvent(new Event('input', { bubbles: true }))
        }, item.toIndexData)
        await page.waitForNetworkIdle({ idleTime: 5_000, timeout: 20_000 })
        await page.evaluate(() => {
            //@ts-ignore
            document.querySelector('[data-testid="translator-target-toolbar-copy"]').click()
        })
        const translate = await page.evaluate(() => {
            return navigator.clipboard.readText()
        })
        console.log(translate.slice(0, 100))
        console.log(i++)
    }

    // await page.keyboard.press('Enter')
    // await page.click('[data-testid="translator-target-lang-btn"]')
    // await sleep(1000)
    // await page.keyboard.type('en')
    // await sleep(1000)
    // await page.keyboard.press('Enter')
    // console.log('Logged in!')
    // await sleep(100_000)
    await sleep(100_000)
}

main().then(() => console.log('Done!'))
