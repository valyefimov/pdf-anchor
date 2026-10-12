// Records the README screenshots and the walkthrough video of the demo app.
//
//   npm --prefix examples/react-vite run dev        # in one terminal (http://localhost:5173)
//   npm i --no-save playwright-core                 # in this repository
//   node scripts/record-media.mjs                   # needs Google Chrome and ffmpeg
//
// Output goes to docs/media. Set CHROME_PATH if Chrome lives elsewhere.
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs';
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

// ---------- video: screenshot loop + voice-over, assembled by ffmpeg ----------
const VOICE = process.env.VOICE ?? 'Eddy (English (US))';

// Pre-render every narration line so scenes can wait exactly as long as the speech lasts.
const lines = {
  intro: 'pdf anchor. Show people exactly where an answer came from.',
  basic:
    'Give it a PDF and a list of quotes, and every quote is found and highlighted right on the page.',
  keys: 'Use the arrow keys to step through the citations,',
  pages: 'and up or down to change pages.',
  jump: 'Or jump straight to any page that has a citation.',
  zoom: 'Zoom and rotate are built in.',
  themed: 'Switch to a dark scheme, give every citation its own color, and translate every label.',
  slots:
    'Every part can be restyled: design tokens, class names, or whole sections through render props.',
  headless:
    'Prefer your own interface? The headless hook does the matching and highlighting, and you bring the UI.',
  docs: 'Documentation, an API reference and live examples are all included.',
  outro: 'Install it from npm. At vefimov, slash pdf anchor.',
};
const audio = {};
for (const [key, text] of Object.entries(lines)) {
  const file = join(FRAMES, `${key}.aiff`);
  execFileSync('say', ['-v', VOICE, '-r', '178', '-o', file, text]);
  const seconds = Number(
    execFileSync('ffprobe', [
      '-v',
      'error',
      '-show_entries',
      'format=duration',
      '-of',
      'csv=p=0',
      file,
    ]).toString(),
  );
  audio[key] = { file, ms: Math.round(seconds * 1000) };
}

const ctx = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 1,
  colorScheme: 'light',
});
const page = await ctx.newPage();
let n = 0;
let recording = true;
const t0 = Date.now();
const cues = [];

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

/** Starts a narration line now; the returned promise resolves when it has finished. */
const speak = (key, withCaption = true) => {
  cues.push({ key, at: Date.now() - t0 });
  if (withCaption) caption(lines[key]).catch(() => {});
  return sleep(audio[key].ms + 450);
};

const caption = (text) =>
  page.evaluate((t) => {
    let el = document.getElementById('demo-caption');
    if (!el) {
      el = document.createElement('div');
      el.id = 'demo-caption';
      el.style.cssText =
        'position:fixed;top:64px;left:50%;transform:translateX(-50%);z-index:99999;max-width:90vw;padding:10px 20px;border-radius:18px;background:rgba(15,23,42,.92);color:#fff;font:600 17px Inter,system-ui,sans-serif;text-align:center;box-shadow:0 8px 24px rgba(0,0,0,.25);pointer-events:none';
      document.body.appendChild(el);
    }
    el.textContent = t;
    el.style.display = t ? 'block' : 'none';
  }, text);

const card = (title, sub, code) =>
  page.setContent(`<body style="margin:0;height:100vh;display:grid;place-items:center;background:linear-gradient(135deg,#0f172a,#1e1b4b);color:#fff;font-family:Inter,system-ui,sans-serif;text-align:center">
    <div><div style="font-size:64px;font-weight:800;letter-spacing:-.03em">${title}</div>
    <div style="margin-top:16px;font-size:26px;color:#cbd5e1;max-width:900px">${sub}</div>
    ${code ? `<div style="margin-top:36px;display:inline-block;padding:14px 22px;border-radius:12px;background:#0b1020;font:20px ui-monospace,Menlo,monospace;color:#e2e8f0">${code}</div>` : ''}</div></body>`);

await card('@vefimov/pdf-anchor', 'Show people exactly where an answer came from.');
await speak('intro', false);

await page.goto(DEMO_URL);
await tab(page, 'Basic', 1200);
let done = speak('basic');
await sleep(600);
await done;

done = speak('keys');
await key(page, 'ArrowRight', 1200);
await key(page, 'ArrowLeft', 900);
await done;
done = speak('pages');
await key(page, 'ArrowDown', 1800);
await key(page, 'ArrowRight', 800);
await done;

done = speak('jump');
await page.getByRole('button', { name: 'Page 4' }).click();
await sleep(1500);
await page.getByRole('button', { name: 'Page 6' }).click();
await done;

done = speak('zoom');
await key(page, '+', 600);
await key(page, '+', 600);
await page.getByRole('button', { name: 'Rotate right' }).click();
await sleep(1000);
await page.getByRole('button', { name: 'Rotate left' }).click();
await key(page, '-', 500);
await key(page, '-', 500);
await done;

await caption('');
await tab(page, 'Themed', 1500);
done = speak('themed');
await key(page, 'ArrowRight', 1800);
await key(page, 'ArrowRight', 1800);
await done;

await caption('');
await tab(page, 'Custom slots', 1500);
done = speak('slots');
await sleep(1200);
await page.getByRole('button', { name: 'Next', exact: true }).click();
await done;

await caption('');
await tab(page, 'Headless', 1500);
done = speak('headless');
await sleep(2200);
await page.getByRole('button', { name: /Allergy/ }).click();
await sleep(1800);
await page.locator('.demo-chip', { hasText: /^1$/ }).click();
await done;

await caption('');
await tab(page, 'Docs', 1000);
done = speak('docs');
await done;

await caption('');
await card(
  'npm install @vefimov/pdf-anchor',
  'React viewer, framework-agnostic core, WCAG 2.2 AA, matching by string-best-match',
  'github.com/valyefimov/pdf-anchor',
);
await speak('outro', false);
await sleep(600);

recording = false;
await loop;
await browser.close();

const secs = (Date.now() - t0) / 1000;
const fps = n / secs;

// Mix the narration lines at their cue times and mux them with the video.
const inputs = [];
const filters = [];
cues.forEach((cue, i) => {
  inputs.push('-i', audio[cue.key].file);
  filters.push(`[${i + 1}:a]adelay=${cue.at}|${cue.at},volume=1.3[a${i}]`);
});
const mix = `${filters.join(';')};${cues.map((_, i) => `[a${i}]`).join('')}amix=inputs=${cues.length}:normalize=0,alimiter=limit=0.9,apad[aout]`;
execFileSync('ffmpeg', [
  '-y',
  '-loglevel',
  'error',
  '-framerate',
  String(fps),
  '-i',
  `${FRAMES}/f%05d.jpg`,
  ...inputs,
  '-filter_complex',
  `[0:v]fps=30,scale=1280:800,format=yuv420p[v];${mix}`,
  '-map',
  '[v]',
  '-map',
  '[aout]',
  '-c:v',
  'libx264',
  '-preset',
  'slow',
  '-crf',
  '27',
  '-c:a',
  'aac',
  '-b:a',
  '112k',
  '-t',
  secs.toFixed(2),
  '-movflags',
  '+faststart',
  OUT + 'demo.mp4',
]);
rmSync(FRAMES, { recursive: true, force: true });
console.log(
  `recorded ${n} frames in ${secs.toFixed(1)}s with ${cues.length} voice-over lines -> docs/media`,
);
