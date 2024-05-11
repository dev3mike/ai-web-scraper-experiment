import puppeteer, { Browser, Page } from 'puppeteer';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { addExtra } from 'puppeteer-extra'
const betterPuppeteer = addExtra(puppeteer)


export async function getPupeteerBrowserPage(): Promise<readonly [Page, Browser]> {
    let browser: Browser | null = null;

    betterPuppeteer.use(StealthPlugin())

    if (!browser) browser = await betterPuppeteer.launch({ ignoreHTTPSErrors: true, headless: false, userDataDir: './tmp/browser_data' });

    const page = await browser.newPage();
    await page.setViewport({ width: 1728, height: 959 });

    return [page, browser] as const;
}