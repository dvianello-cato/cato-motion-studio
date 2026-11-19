// Render frame per frame: Playwright headless chiama window.seek(t), fotografa, passa i frame a ffmpeg.
//   node render.mjs [pagina.html] [video/out.mp4]            film completo (+ audio se la pagina definisce window.AUDIO)
//   node render.mjs [pagina.html] [cartella] --stills=beats   un PNG per battito (0,5 s), per il provino
//   node render.mjs [pagina.html] [cartella] --stills=1,2.5   PNG ai secondi indicati
//   --query=bg=grid  passa parametri alla pagina
// La pagina espone window.seek(t), window.DURATION, window.FPS e, facoltativi, window.ready (Promise) e window.AUDIO.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const flags = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => a.slice(2).split('=')));
const [inArg, outArg] = args.filter((a) => !a.startsWith('--'));
const input = resolve(inArg ?? 'tests/quadrato/index.html');
const output = resolve(outArg ?? 'tests/output/test.mp4');
const LUFS = -14;

function run(cmd, argv, { capture = false } = {}) {
  return new Promise((ok, fail) => {
    const p = spawn(cmd, argv, { stdio: ['ignore', 'inherit', capture ? 'pipe' : 'inherit'] });
    let err = '';
    if (capture) p.stderr.on('data', (d) => (err += d));
    p.on('close', (code) => (code === 0 ? ok(err) : fail(new Error(`${cmd} è uscito con codice ${code}\n${err.slice(-2000)}`))));
  });
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
page.on('pageerror', (e) => { console.error('errore nella pagina:', e.message); process.exitCode = 1; });
await page.goto(pathToFileURL(input).href + (flags.query ? '?' + flags.query : ''));
await page.evaluate(async () => { await (window.ready ?? document.fonts.ready); });
const { duration, fps, audio } = await page.evaluate(() => ({ duration: window.DURATION, fps: window.FPS, audio: window.AUDIO ?? null }));

const shot = async (t) => {
  await page.evaluate((tt) => window.seek(tt), t);
  return page.screenshot({ type: 'png' });
};

if (flags.stills) {
  const times = flags.stills === 'beats'
    ? Array.from({ length: Math.floor(duration / 0.5) + 1 }, (_, i) => i * 0.5)
    : flags.stills.split(',').map(Number);
  mkdirSync(output, { recursive: true });
  for (const t of times) {
    const { writeFileSync } = await import('node:fs');
    writeFileSync(join(output, `t${t.toFixed(3).padStart(6, '0')}.png`), await shot(Math.min(t, duration - 1 / fps)));
  }
  await browser.close();
  process.stdout.write(`${times.length} fotogrammi in ${output}\n`);
  process.exit();
}

mkdirSync(dirname(output), { recursive: true });
const total = Math.round(duration * fps);
const videoOnly = audio ? output.replace(/\.mp4$/, '.video.mp4') : output;
const ffmpeg = spawn('ffmpeg', [
  '-y', '-loglevel', 'error',
  '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
  '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '16', '-preset', 'slow',
  '-movflags', '+faststart',
  videoOnly,
], { stdio: ['pipe', 'inherit', 'inherit'] });

for (let i = 0; i < total; i++) {
  const png = await shot(i / fps);
  if (!ffmpeg.stdin.write(png)) await new Promise((r) => ffmpeg.stdin.once('drain', r));
  if (i % 30 === 0 || i === total - 1) process.stdout.write(`\rframe ${i + 1}/${total}`);
}
ffmpeg.stdin.end();
await browser.close();
const code = await new Promise((r) => ffmpeg.on('close', r));
if (code !== 0) throw new Error(`ffmpeg è uscito con codice ${code}`);
process.stdout.write('\n');

if (audio) {
  const audioPath = resolve(dirname(input), audio);
  // Guadagno fisso (niente compressione): misura loudness integrata e true peak, poi alza o abbassa di quanto serve.
  const log = await run('ffmpeg', ['-hide_banner', '-nostats', '-i', audioPath, '-af', 'ebur128=peak=true', '-f', 'null', '-'], { capture: true });
  const summary = log.slice(log.lastIndexOf('Summary:'));
  const I = parseFloat(summary.match(/I:\s+(-?[\d.]+) LUFS/)[1]);
  const peak = parseFloat(summary.match(/Peak:\s+(-?[\d.]+) dBFS/)[1]);
  const gain = LUFS - I;
  if (peak + gain > -1) console.warn(`attenzione: con +${gain.toFixed(1)} dB il picco arriva a ${(peak + gain).toFixed(1)} dBTP (oltre −1)`);
  await run('ffmpeg', ['-y', '-loglevel', 'error', '-i', videoOnly, '-i', audioPath,
    '-map', '0:v', '-map', '1:a', '-af', `volume=${gain.toFixed(2)}dB,aresample=48000`, '-c:v', 'copy', '-c:a', 'aac', '-b:a', '320k', '-ac', '2',
    '-t', String(duration), '-movflags', '+faststart', output]);
  rmSync(videoOnly);
}
process.stdout.write(`fatto: ${output}\n`);
