// Records the README screenshots and the walkthrough video of the demo app.
//
//   npm --prefix examples/react-vite run dev        # in one terminal (http://localhost:5173)
//   npm i --no-save playwright-core                 # in this repository
//   node scripts/record-media.mjs                   # needs Google Chrome and ffmpeg
//
// Output goes to docs/media. Set CHROME_PATH if Chrome lives elsewhere.
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright-core';

const DEMO_URL = process.env.DEMO_URL ?? 'http://localhost:5173/';
const OUT = new URL('../docs/media/', import.meta.url).pathname;
const FRAMES = mkdtempSync(join(tmpdir(), 'pdf-anchor-frames-'));
mkdirSync(OUT, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
});

const tab = async (page, name, wait = 2500) => {
  await page.locator('.demo-tab', { hasText: new RegExp(`^${name}$`) }).click();
  await sleep(wait);
};
const key = async (page, k, wait = 1100) => {
  await page.evaluate(() => document.querySelector('[role=region]')?.focus());
  await page.keyboard.press(k);
  await sleep(wait);
};

// ---------- screenshots (2x) ----------
{
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2,
    colorScheme: 'light',
  });
  const page = await ctx.newPage();
  await page.goto(DEMO_URL);
  await tab(page, 'Basic');
  await page.screenshot({ path: OUT + 'basic.png' });
  await tab(page, 'Themed');
  await page.screenshot({ path: OUT + 'themed-dark.png' });
  await tab(page, 'Custom slots');
  await page.screenshot({ path: OUT + 'custom-slots.png' });
  await tab(page, 'Headless');
  await page.screenshot({ path: OUT + 'headless.png' });
  await tab(page, 'Docs', 800);
  await page.screenshot({ path: OUT + 'docs.png' });
  await ctx.close();
  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    colorScheme: 'light',
  });
  const m = await mobile.newPage();
  await m.goto(DEMO_URL);
  await tab(m, 'Basic');
  await m.screenshot({ path: OUT + 'mobile.png' });
  await mobile.close();
}

// ---------- video: screenshot loop assembled by ffmpeg ----------
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 1,
  colorScheme: 'light',
});
const page = await ctx.newPage();
let n = 0;
let recording = true;
const t0 = Date.now();
const loop = (async () => {
  while (recording) {
    try {
      await page.screenshot({
        path: `${FRAMES}/f${String(n).padStart(5, '0')}.jpg`,
        type: 'jpeg',
        quality: 88,
        timeout: 4000,
      });
      n++;
    } catch {
      await sleep(50);
    }
  }
})();

const caption = (text) =>
  page.evaluate((t) => {
    let el = document.getElementById('demo-caption');
    if (!el) {
      el = document.createElement('div');
      el.id = 'demo-caption';
      el.style.cssText =
        'position:fixed;top:64px;left:50%;transform:translateX(-50%);z-index:99999;padding:10px 20px;border-radius:999px;background:rgba(15,23,42,.92);color:#fff;font:600 17px Inter,system-ui,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.25);pointer-events:none;white-space:nowrap';
      document.body.appendChild(el);
    }
    el.textContent = t;
    el.style.display = t ? 'block' : 'none';
  }, text);

const card = async (title, sub, code) => {
  await page.setContent(`<body style="margin:0;height:100vh;display:grid;place-items:center;background:linear-gradient(135deg,#0f172a,#1e1b4b);color:#fff;font-family:Inter,system-ui,sans-serif;text-align:center">
    <div><div style="font-size:64px;font-weight:800;letter-spacing:-.03em">${title}</div>
    <div style="margin-top:16px;font-size:26px;color:#cbd5e1;max-width:900px">${sub}</div>
    ${code ? `<div style="margin-top:36px;display:inline-block;padding:14px 22px;border-radius:12px;background:#0b1020;font:20px ui-monospace,Menlo,monospace;color:#e2e8f0">${code}</div>` : ''}</div></body>`);
};

await card('@efa/pdf-anchor', 'Show people exactly where an answer came from.');
await sleep(2800);

await page.goto(DEMO_URL);
await tab(page, 'Basic', 2800);
await caption('Pass a PDF and your quotes. Matching text is highlighted.');
await sleep(2600);
await caption('Arrow keys switch citations...');
await key(page, 'ArrowRight', 1600);
await key(page, 'ArrowLeft', 1400);
await caption('...and pages');
await key(page, 'ArrowDown', 2200);
await key(page, 'ArrowRight', 1800);
await caption('Jump straight to any page with a citation');
await page.getByRole('button', { name: 'Page 4' }).click();
await sleep(2400);
await page.getByRole('button', { name: 'Page 6' }).click();
await sleep(2400);
await caption('Zoom and rotate');
await key(page, '+', 900);
await key(page, '+', 900);
await page.getByRole('button', { name: 'Rotate right' }).click();
await sleep(1500);
await page.getByRole('button', { name: 'Rotate left' }).click();
await key(page, '-', 900);
await key(page, '-', 1200);

await caption('Dark scheme, per-citation colors, your own labels');
await tab(page, 'Themed', 2600);
await caption('Dark scheme, per-citation colors, your own labels');
await key(page, 'ArrowRight', 1800);
await key(page, 'ArrowRight', 1800);

await caption('Every part is restyleable: tokens, slots, render props');
await tab(page, 'Custom slots', 3200);
await page.getByRole('button', { name: 'Next', exact: true }).click();
await sleep(1800);

await caption('Headless hook: bring your own UI');
await tab(page, 'Headless', 2400);
await page.getByRole('button', { name: /Allergy/ }).click();
await sleep(1500);
await page.locator('.demo-chip', { hasText: /^1$/ }).click();
await sleep(2200);

await caption('');
await tab(page, 'Docs', 1500);
await caption('Docs, API reference and examples included');
await sleep(2200);
await caption('');
await card(
  'npm install @efa/pdf-anchor',
  'React viewer, framework-agnostic core, WCAG 2.2 AA, matching by string-best-match',
  'github.com/valyefimov/pdf-anchor',
);
await sleep(3200);

recording = false;
await loop;
const secs = (Date.now() - t0) / 1000;
const fps = n / secs;
await browser.close();
execFileSync('ffmpeg', [
  '-y',
  '-loglevel',
  'error',
  '-framerate',
  String(fps),
  '-i',
  `${FRAMES}/f%05d.jpg`,
  '-vf',
  'fps=30,scale=1280:800,format=yuv420p',
  '-c:v',
  'libx264',
  '-preset',
  'slow',
  '-crf',
  '27',
  '-movflags',
  '+faststart',
  OUT + 'demo.mp4',
]);
rmSync(FRAMES, { recursive: true, force: true });
console.log(`recorded ${n} frames in ${secs.toFixed(1)}s -> docs/media`);
