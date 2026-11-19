// Costruisce un video parlato Cato da piano.json e dalla trascrizione.
//   node tools/costruisci.mjs            (dalla cartella progetto/ del film)
//
// Scrive index.html e compositions/ (un file per riquadro, più i sottotitoli).
// ATTENZIONE: riscrive quei file da zero. Le modifiche fatte a mano o nello Studio vanno perse:
// rigenera solo prima dei ritocchi, poi si lavora sui file.
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const piano = JSON.parse(fs.readFileSync(path.join(root, "piano.json"), "utf8"));

// ---------- Misure per formato (da hyperframes overlays.md e captions.md, adattate al brand) ----------
const F = {
  "16x9": {
    W: 1920, H: 1080,
    // Diviso: la persona va nella metà sinistra, il pannello occupa la metà destra.
    split: { x: -480, y: 0, clip: "inset(0px 480px 0px 480px)" },
    pannello: "left:960px; top:0; width:960px; height:1080px;",
    pannelloDa: { xPercent: 100, yPercent: 0 },
    pad: 96,
    sotto: { pieno: { left: 0, width: 1920, bottom: 96, maxW: 1500 }, diviso: { left: 0, width: 960, bottom: 96, maxW: 820 } },
    cap: { base: 80, min: 56 },
    nome: { left: 96, bottom: 260, nome: 64, ruolo: 44 },
    numero: 240, etichetta: 52, frase: 88, titolo: 56,
    chiusura: { logo: 640, testo: 104, url: 64 },
  },
  "9x16": {
    W: 1080, H: 1920,
    // Diviso: la persona va nella metà bassa, il pannello occupa la metà alta.
    split: { x: 0, y: 480, clip: "inset(480px 0px 480px 0px)" },
    pannello: "left:0; top:0; width:1080px; height:960px;",
    pannelloDa: { xPercent: 0, yPercent: -100 },
    pad: 72,
    sotto: { pieno: { left: 0, width: 1080, bottom: 640, maxW: 900 }, diviso: { left: 0, width: 1080, bottom: 320, maxW: 900 } },
    cap: { base: 96, min: 64 },
    nome: { left: 72, bottom: 340, nome: 80, ruolo: 56 },
    numero: 260, etichetta: 64, frase: 96, titolo: 68,
    chiusura: { logo: 720, testo: 112, url: 72 },
  },
};
const f = F[piano.formato || "16x9"];
if (!f) throw new Error(`formato sconosciuto: ${piano.formato} (usa "16x9" o "9x16")`);

const durata = +piano.durata;
if (!(durata > 0)) throw new Error("piano.json: manca durata (secondi del video, da ffprobe)");
const carte = (piano.carte || []).map((c, i) => ({ ...c, id: `c${String(i + 1).padStart(2, "0")}-${c.tipo}` }));
for (const c of carte) {
  if (!["nome", "numero", "frase", "schermata", "chiusura"].includes(c.tipo)) throw new Error(`tipo di riquadro sconosciuto: ${c.tipo}`);
  c.inizio = +c.inizio; c.durata = Math.min(+c.durata, durata - c.inizio);
  if (!(c.durata > 0.8)) throw new Error(`${c.id}: durata troppo corta o fuori dal video`);
}

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const r2 = (n) => Math.round(n * 1000) / 1000;
const fontFace = `@font-face { font-family: "Manrope"; src: url("assets/brand/fonts/Manrope-VariableFont_wght.ttf") format("truetype"); font-weight: 200 800; font-display: block; }`;
const vars = (list) => esc(JSON.stringify(list.map(([id, label, def]) => ({ id, type: "string", label, default: String(def) }))));
const isPanel = (c) => ["numero", "frase", "schermata"].includes(c.tipo);

// Una parola evidenziata (accento unico) dentro un testo: la prima occorrenza di c.evidenzia.
const conAccento = (testo, parola) => {
  const t = esc(testo);
  if (!parola) return t;
  const p = esc(parola), i = t.indexOf(p);
  return i < 0 ? t : `${t.slice(0, i)}<span class="acc">${p}</span>${t.slice(i + p.length)}`;
};

// ---------- I riquadri ----------
const sceneHead = (c, css, variabili) => `<template>
  <style>
    ${fontFace}
    #root { position: absolute; inset: 0; font-family: "Manrope", sans-serif; --navy: #0C213E; --ink: #101010; --mute: #6A717B; --bg: #FDFDFA; --line: #F0F0EE; --accent: #E8A33D; }
    #root .mask { overflow: hidden; display: block; padding-bottom: 0.08em; }
    #root .line { display: block; transform-origin: 0 100%; }
    #root .acc { color: var(--accent); }
    ${css}
  </style>
  <div id="root" data-composition-id="${c.id}" data-width="${f.W}" data-height="${f.H}" data-composition-variables='${variabili}'>`;
const sceneFoot = (c, js) => `  </div>
  <script>
    (function () {
      const tl = gsap.timeline({ paused: true });
      const D = ${r2(c.durata)};
${js}
      window.__timelines["${c.id}"] = tl;
    })();
  </script>
</template>
`;
// Entrata del testo da una maschera, salendo con 4° di inclinazione (brand.md). Mai solo opacità.
const sale = (sel, t) => `      tl.fromTo("${sel}", { yPercent: 115, rotation: 4 }, { yPercent: 0, rotation: 0, duration: 0.9, ease: "spring-heavy" }, ${t});`;
// Il pannello entra dal lato (o dall'alto nel verticale) mentre la persona si sposta, ed esce prima della fine.
const pannelloJs = (c) => `      tl.fromTo("#${c.id}-pannello", { xPercent: ${f.pannelloDa.xPercent}, yPercent: ${f.pannelloDa.yPercent} }, { xPercent: 0, yPercent: 0, duration: 0.6, ease: "power3.inOut" }, 0);
      tl.fromTo("#${c.id}-pannello", { xPercent: 0, yPercent: 0 }, { xPercent: ${f.pannelloDa.xPercent}, yPercent: ${f.pannelloDa.yPercent}, duration: 0.6, ease: "power3.inOut", immediateRender: false }, D - 0.62);`;
const pannelloCss = (c) => `#${c.id}-pannello { position: absolute; ${f.pannello} background-color: var(--bg); background-image: linear-gradient(var(--line) 2px, transparent 2px), linear-gradient(90deg, var(--line) 2px, transparent 2px); background-size: 60px 60px; }
    #${c.id}-corpo { position: absolute; inset: ${f.pad}px; display: flex; flex-direction: column; justify-content: center; gap: 32px; }`;

const scene = {
  nome: (c) => sceneHead(c, `#${c.id}-card { position: absolute; left: ${f.nome.left}px; bottom: ${f.nome.bottom}px; background: var(--bg); border-radius: 24px; padding: 28px 40px 28px 48px; box-shadow: 0 16px 48px rgba(9,25,47,0.28); }
    #${c.id}-barra { position: absolute; left: 0; top: 24px; bottom: 24px; width: 8px; border-radius: 4px; background: var(--accent); transform-origin: 50% 100%; }
    #${c.id}-nome { font-size: ${f.nome.nome}px; line-height: 1.15; font-weight: 800; letter-spacing: -0.02em; color: var(--navy); white-space: nowrap; }
    #${c.id}-ruolo { font-size: ${f.nome.ruolo}px; line-height: 1.25; font-weight: 600; color: var(--mute); white-space: nowrap; }`,
    vars([["nome", "Nome", c.nome], ["ruolo", "Ruolo", c.ruolo]])) + `
    <div id="${c.id}-card">
      <div id="${c.id}-barra"></div>
      <span class="mask"><span id="${c.id}-nome" class="line" data-var-text="nome">${esc(c.nome)}</span></span>
      <span class="mask"><span id="${c.id}-ruolo" class="line" data-var-text="ruolo">${esc(c.ruolo)}</span></span>
    </div>
` + sceneFoot(c, `      tl.fromTo("#${c.id}-card", { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.5, ease: "spring-default" }, 0);
      tl.fromTo("#${c.id}-barra", { scaleY: 0 }, { scaleY: 1, duration: 0.5, ease: "spring-snappy" }, 0.15);
${sale(`#${c.id}-nome`, 0.12)}
${sale(`#${c.id}-ruolo`, 0.24)}
      tl.fromTo("#${c.id}-card", { opacity: 1, x: 0 }, { opacity: 0, x: -40, duration: 0.35, ease: "power2.in", immediateRender: false }, D - 0.4);`),

  numero: (c) => {
    const val = +c.valore;
    // Il numero finale deve stare nel pannello: si rimpicciolisce se è lungo (circa 0,62 em per cifra in Manrope 800).
    const finale = (c.prefisso || "") + Math.round(val).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + (c.suffisso || "");
    const larghezza = (f.W > f.H ? 960 : 1080) - 2 * f.pad;
    const numSize = Math.min(f.numero, Math.floor(larghezza / (finale.length * 0.62)));
    return sceneHead(c, `${pannelloCss(c)}
    #${c.id}-num { font-size: ${numSize}px; line-height: 1; font-weight: 800; letter-spacing: -0.04em; color: var(--navy); font-variant-numeric: tabular-nums; white-space: nowrap; }
    #${c.id}-barra { width: 160px; height: 10px; border-radius: 5px; background: var(--accent); transform-origin: 0 50%; }
    #${c.id}-etichetta { font-size: ${f.etichetta}px; line-height: 1.25; font-weight: 600; color: var(--ink); }`,
      vars([["etichetta", "Etichetta", c.etichetta]])) + `
    <div id="${c.id}-pannello">
      <div id="${c.id}-corpo">
        <span class="mask"><span id="${c.id}-num" class="line">${esc((c.prefisso || "") + "0" + (c.suffisso || ""))}</span></span>
        <div id="${c.id}-barra"></div>
        <span class="mask"><span id="${c.id}-etichetta" class="line" data-var-text="etichetta">${esc(c.etichetta)}</span></span>
      </div>
    </div>
` + sceneFoot(c, `${pannelloJs(c)}
${sale(`#${c.id}-num`, 0.35)}
      // Il numero conta da 0 a ${val} seguendo il tempo della timeline (si può scorrere avanti e indietro).
      const el = document.getElementById("${c.id}-num"), n = { v: 0 };
      const fmt = (v) => ${JSON.stringify(c.prefisso || "")} + Math.round(v).toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, ".") + ${JSON.stringify(c.suffisso || "")};
      tl.fromTo(n, { v: 0 }, { v: ${val}, duration: 1.4, ease: "power3.out", onUpdate: () => { el.textContent = fmt(n.v); } }, 0.4);
      tl.fromTo("#${c.id}-barra", { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: "spring-snappy" }, 0.9);
${sale(`#${c.id}-etichetta`, 0.75)}`);
  },

  frase: (c) => sceneHead(c, `${pannelloCss(c)}
    #${c.id}-testo { font-size: ${f.frase}px; line-height: 1.12; font-weight: 700; letter-spacing: -0.03em; color: var(--navy); }`,
    vars([["testo", "Frase", c.testo]])) + `
    <div id="${c.id}-pannello">
      <div id="${c.id}-corpo">
        <span class="mask"><span id="${c.id}-testo" class="line"${c.evidenzia ? "" : ' data-var-text="testo"'}>${conAccento(c.testo, c.evidenzia)}</span></span>
      </div>
    </div>
` + sceneFoot(c, `${pannelloJs(c)}
${sale(`#${c.id}-testo`, 0.4)}`),

  schermata: (c) => sceneHead(c, `${pannelloCss(c)}
    #${c.id}-titolo { font-size: ${f.titolo}px; line-height: 1.15; font-weight: 700; letter-spacing: -0.02em; color: var(--navy); }
    #${c.id}-cornice { position: relative; border-radius: 20px; overflow: hidden; box-shadow: 0 24px 64px rgba(9,25,47,0.18); border: 2px solid var(--line); background: #fff; }
    #${c.id}-img { display: block; width: 100%; height: auto; transform-origin: 30% 30%; }`,
    vars([["titolo", "Titolo", c.titolo || ""]])) + `
    <div id="${c.id}-pannello">
      <div id="${c.id}-corpo">
        ${c.titolo ? `<span class="mask"><span id="${c.id}-titolo" class="line"${c.evidenzia ? "" : ' data-var-text="titolo"'}>${conAccento(c.titolo, c.evidenzia)}</span></span>` : ""}
        <div id="${c.id}-cornice"><img id="${c.id}-img" src="${esc(c.immagine)}" alt="" /></div>
      </div>
    </div>
` + sceneFoot(c, `${pannelloJs(c)}
${c.titolo ? sale(`#${c.id}-titolo`, 0.4) : ""}
      tl.fromTo("#${c.id}-cornice", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.8, ease: "spring-default" }, 0.5);
      // Avvicinamento lento sulla schermata, così il riquadro non resta mai fermo.
      tl.fromTo("#${c.id}-img", { scale: 1 }, { scale: 1.06, duration: Math.max(1, D - 0.6), ease: "none" }, 0.5);`),

  chiusura: (c) => sceneHead(c, `#${c.id}-fondo { position: absolute; inset: 0; background-color: var(--navy); background-image: linear-gradient(#14294A 2px, transparent 2px), linear-gradient(90deg, #14294A 2px, transparent 2px); background-size: 60px 60px; }
    #${c.id}-corpo { position: absolute; left: ${f.pad + 32}px; right: ${f.pad + 32}px; top: 0; bottom: 0; display: flex; flex-direction: column; justify-content: center; gap: 48px; }
    #${c.id}-logo { display: block; width: ${f.chiusura.logo}px; height: auto; }
    #${c.id}-testo { font-size: ${f.chiusura.testo}px; line-height: 1.12; font-weight: 700; letter-spacing: -0.03em; color: #FFFFFF; }
    #${c.id}-url { font-size: ${f.chiusura.url}px; line-height: 1.2; font-weight: 700; color: var(--accent); }`,
    vars([["testo", "Testo", c.testo], ["url", "Indirizzo", c.url || "get-cato.com"]])) + `
    <div id="${c.id}-fondo"></div>
    <div id="${c.id}-corpo">
      <img id="${c.id}-logo" src="assets/brand/logo/cato-logo-bianco.png" alt="Cato" />
      <span class="mask"><span id="${c.id}-testo" class="line" data-var-text="testo">${esc(c.testo)}</span></span>
      <span class="mask"><span id="${c.id}-url" class="line" data-var-text="url">${esc(c.url || "get-cato.com")}</span></span>
    </div>
` + sceneFoot(c, `      tl.fromTo("#${c.id}-fondo", { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: "power3.inOut" }, 0);
      tl.fromTo("#${c.id}-logo", { opacity: 0, y: 40, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 1, ease: "spring-heavy" }, 0.45);
${sale(`#${c.id}-testo`, 0.7)}
${sale(`#${c.id}-url`, 0.9)}`),
};

// ---------- Quando la persona si sposta di lato ----------
// I pannelli vicini (meno di 1,4 s tra uno e l'altro) tengono la persona di lato senza farla tornare al centro.
const divisi = [];
for (const c of carte.filter(isPanel).sort((a, b) => a.inizio - b.inizio)) {
  const last = divisi[divisi.length - 1];
  if (last && c.inizio - last.fine < 1.4) last.fine = Math.max(last.fine, c.inizio + c.durata);
  else divisi.push({ inizio: c.inizio, fine: c.inizio + c.durata });
}
const diviso = (t) => divisi.some((d) => t >= d.inizio && t < d.fine);
const coperto = (a, b) => carte.some((c) => c.tipo === "chiusura" && a < c.inizio + c.durata && b > c.inizio + 0.3);

// ---------- Sottotitoli ----------
function parole() {
  const p = path.join(root, piano.trascrizione || "assets/transcript.json");
  if (!fs.existsSync(p)) return [];
  let w = JSON.parse(fs.readFileSync(p, "utf8"));
  if (!Array.isArray(w)) w = w.words || [];
  const corr = piano.correzioni || {};
  // Correzioni su più parole di fila ("Prova alla" → "Provala"): diventano una parola sola che copre il loro tempo.
  const nude = (t) => String(t).trim().replace(/[.,!?;:…]+$/, "").toLowerCase();
  for (const [chiave, giusto] of Object.entries(corr)) {
    const seq = chiave.toLowerCase().split(/\s+/);
    if (seq.length < 2) continue;
    for (let i = 0; i + seq.length <= w.length; i++) {
      if (!seq.every((s, k) => nude(w[i + k].text) === s)) continue;
      const fine = String(w[i + seq.length - 1].text).trim().match(/[.,!?;:…]*$/)[0];
      w.splice(i, seq.length, { text: giusto + fine, start: w[i].start, end: w[i + seq.length - 1].end, unita: true });
    }
  }
  const out = [];
  for (const x of w) {
    const text = String(x.text).trim();
    if (!text || /^[♪�\[\(]/.test(text) || x.start >= durata - 0.05) continue;
    // Correzioni: "Dicato," → "di Cato," (la punteggiatura resta). Più parole si spartiscono il tempo.
    const m = text.match(/^(.*?)([.,!?;:…]*)$/);
    if (x.unita) { out.push({ text, start: x.start, end: Math.min(x.end, durata) }); continue; }
    const fix = corr[m[1]] ?? corr[m[1].toLowerCase()];
    const parts = (fix ?? m[1]).split(/\s+/).filter(Boolean);
    const step = (x.end - x.start) / parts.length;
    parts.forEach((t, i) => out.push({ text: t + (i === parts.length - 1 ? m[2] : ""), start: x.start + i * step, end: Math.min(x.start + (i + 1) * step, durata) }));
  }
  return out;
}
function gruppi(w) {
  const max = piano.parolePerGruppo || 4, out = [];
  let g = [];
  w.forEach((x, i) => {
    g.push(x);
    const next = w[i + 1];
    if (!next || g.length >= max || /[.!?;:…]$/.test(x.text) || (/,$/.test(x.text) && g.length >= 2) || next.start - x.end >= 0.15) { out.push(g); g = []; }
  });
  return out.map((g, i, all) => {
    const start = Math.max(0.1, g[0].start - 0.05);
    const nextStart = all[i + 1] ? Math.max(0.1, all[i + 1][0].start - 0.05) : durata;
    return { words: g, start: r2(start), end: r2(Math.min(nextStart, g[g.length - 1].end + 0.25, durata)) };
  }).filter((g) => g.end - g.start > 0.2 && !coperto(g.start, g.end));
}
const evid = new Set((piano.evidenzia || []).map((s) => s.toLowerCase()));
const pulisci = (t) => t.toLowerCase().replace(/[.,!?;:…"«»]/g, "");
function sottotitoli(gs) {
  const id = "sottotitoli";
  const html = gs.map((g, i) => {
    const zona = diviso((g.start + g.end) / 2) ? f.sotto.diviso : f.sotto.pieno;
    const chars = g.words.map((w) => w.text).join(" ").length;
    const size = Math.max(f.cap.min, Math.min(f.cap.base, Math.floor(zona.maxW / (chars * 0.58))));
    const words = g.words.map((w) => `<span class="${evid.has(pulisci(w.text)) || /\d/.test(w.text) ? "acc" : ""}">${esc(w.text)}</span>`).join(" ");
    return `    <div id="st-${i}" class="gruppo" style="left:${zona.left}px; width:${zona.width}px; bottom:${zona.bottom}px;"><span class="testo" style="font-size:${size}px;">${words}</span></div>`;
  }).join("\n");
  const js = gs.map((g, i) => `      tl.fromTo("#st-${i}", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.14, ease: "power2.out" }, ${g.start});
      tl.to("#st-${i}", { opacity: 0, duration: 0.1, ease: "power2.in" }, ${r2(g.end - 0.1)});
      tl.set("#st-${i}", { opacity: 0, visibility: "hidden" }, ${g.end});`).join("\n");
  return `<template>
  <style>
    ${fontFace}
    #root { position: absolute; inset: 0; font-family: "Manrope", sans-serif; }
    #root .gruppo { position: absolute; text-align: center; opacity: 0; overflow: visible; }
    #root .testo { display: inline-block; max-width: 92%; padding: 0.12em 0.4em 0.16em; border-radius: 0.28em; background: rgba(12, 33, 62, 0.62); color: #FFFFFF; font-weight: 700; line-height: 1.18; letter-spacing: -0.01em; }
    #root .acc { color: #E8A33D; }
  </style>
  <div id="root" data-composition-id="${id}" data-width="${f.W}" data-height="${f.H}">
${html}
  </div>
  <script>
    (function () {
      const tl = gsap.timeline({ paused: true });
${js}
      window.__timelines["${id}"] = tl;
    })();
  </script>
</template>
`;
}

// ---------- Scrittura ----------
fs.mkdirSync(path.join(root, "compositions"), { recursive: true });
for (const old of fs.readdirSync(path.join(root, "compositions"))) if (/^(c\d\d-|sottotitoli)/.test(old)) fs.unlinkSync(path.join(root, "compositions", old));
for (const c of carte) fs.writeFileSync(path.join(root, "compositions", `${c.id}.html`), scene[c.tipo](c));
const gs = piano.sottotitoli === false ? [] : gruppi(parole());
if (gs.length) fs.writeFileSync(path.join(root, "compositions", "sottotitoli.html"), sottotitoli(gs));

const host = (id, start, dur, track, kind) => `      <div id="${id}" data-composition-id="${id}" data-composition-src="compositions/${id}.html" data-start="${r2(start)}" data-duration="${r2(dur)}" data-track-index="${track}" data-track-kind="${kind}" data-width="${f.W}" data-height="${f.H}" style="z-index:${track + 1}"></div>`;
const splitJs = divisi.map((d) => `      tl.fromTo("#inquadratura", { x: 0, y: 0, clipPath: "inset(0px 0px 0px 0px)" }, { x: ${f.split.x}, y: ${f.split.y}, clipPath: "${f.split.clip}", duration: 0.6, ease: "power3.inOut", immediateRender: false }, ${r2(d.inizio)});
      tl.fromTo("#inquadratura", { x: ${f.split.x}, y: ${f.split.y}, clipPath: "${f.split.clip}" }, { x: 0, y: 0, clipPath: "inset(0px 0px 0px 0px)", duration: 0.6, ease: "power3.inOut", immediateRender: false }, ${r2(d.fine - 0.62)});`).join("\n");
// Zoom sulla persona nei momenti forti (punch-in): entra in 0,25 s, resta, esce in 0,4 s. Mai mentre è di lato.
const zoomJs = (piano.zoom || []).filter((z) => !divisi.some((d) => z.inizio < d.fine && z.inizio + z.durata > d.inizio) && !coperto(z.inizio, z.inizio + z.durata)).map((z) => {
  const s = z.scala || 1.12, a = r2(+z.inizio), b = r2(+z.inizio + +z.durata - 0.4);
  return `      tl.fromTo("#inquadratura", { scale: 1 }, { scale: ${s}, duration: 0.25, ease: "power3.out", immediateRender: false }, ${a});
      tl.fromTo("#inquadratura", { scale: ${s} }, { scale: 1, duration: 0.4, ease: "power2.inOut", immediateRender: false }, ${b});`;
}).join("\n");
const musica = piano.musica ? `      <audio id="musica" class="clip" src="${esc(piano.musica.src)}" data-start="0" data-duration="${r2(durata)}" data-track-index="20" data-volume="${piano.musica.volume ?? 0.14}" data-fade-in="1" data-fade-out="2"></audio>\n` : "";

fs.writeFileSync(path.join(root, "index.html"), `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=${f.W}, height=${f.H}">
    <title>${esc(piano.titolo || "Video parlato Cato")}</title>
    <script src="assets/lib/gsap/gsap.min.js"></script>
    <script src="assets/molle.js"></script>
    <style>
      ${fontFace}
      * { box-sizing: border-box; }
      html, body { margin: 0; width: ${f.W}px; height: ${f.H}px; overflow: hidden; background: #09192F; }
      #root { position: relative; width: 100%; height: 100%; overflow: hidden; background: #09192F; font-family: "Manrope", sans-serif; }
      #inquadratura { position: absolute; inset: 0; transform-origin: 50% 35%; }
      #parlato { position: absolute; left: 0; top: 0; width: ${f.W}px; height: ${f.H}px; object-fit: cover; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${r2(durata)}" data-width="${f.W}" data-height="${f.H}">
      <div id="inquadratura">
        <video id="parlato" class="clip" src="${esc(piano.video || "assets/parlato.mp4")}" data-start="0" data-duration="${r2(durata)}" data-track-index="0" data-has-audio="true" playsinline></video>
      </div>
${carte.map((c, i) => host(c.id, c.inizio, c.durata, i + 1, "graphics")).join("\n")}
${gs.length ? host("sottotitoli", 0, durata, carte.length + 1, "captions") : ""}
${musica}    </div>
    <script>
      const tl = gsap.timeline({ paused: true });
      // La persona si sposta di lato quando entra un pannello, e torna al centro quando esce.
${splitJs}
${zoomJs}
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
`);

console.log(`Fatto: ${carte.length} riquadri, ${gs.length} gruppi di sottotitoli, ${divisi.length} momenti con la persona di lato, ${r2(durata)} s, formato ${piano.formato || "16x9"}.`);
