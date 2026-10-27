import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
const folder = 'docs/testing/screenshots';
await mkdir(folder, { recursive: true });
const browser = await chromium.launch();
try {
  for (const [name, width, height] of [['desktop', 1366, 1000], ['mobil', 360, 800]]) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    // Reproduzierbarer Bildnachweis der gekennzeichneten Offlinevariante.
    await page.route('**/tile.openstreetmap.org/**', route => route.abort());
    await page.goto('http://127.0.0.1:3010');
    await page.getByText('Schematische Ersatzkarte · keine Navigationskarte', { exact: true }).waitFor();
    await page.screenshot({ path: `${folder}/${name}.png`, fullPage: true });
    console.log(`${name}: ${width}px, ${await page.locator('article').count()} Treffen`);
    await page.close();
  }
} finally { await browser.close(); }
