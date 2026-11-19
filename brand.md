# Brand Cato — memoria per i video

**Fonte della palette e dei font: il sito www.get-cato.com** (fogli di stile letti il 2026-10-02). Se il sito cambia, aggiorna questo file e lo studio segue.

## Palette (dal sito)
| Ruolo | HEX | Dove lo usa il sito |
|---|---|---|
| Sfondo | `#FDFDFA` | sfondo delle sezioni (alternato a `#FAFAF7`) |
| Superficie, bordi chiari | `#F0F0EE` | card, bordi, hover |
| Testo | `#101010` | testo principale |
| Testo secondario | `#6A717B` | sottotitoli, descrizioni |
| Navy (inchiostro del brand) | `#0C213E` | titoli, bottone principale, bordi forti |
| Navy scuro | `#09192F` | superfici scure, bottone al passaggio del mouse |
| **Accento (unico)** | `#E8A33D` | oro-arancio: fine sfumatura del titolo, evidenziazioni |
| Accento acceso | `#F4A024` | solo testi o icone piccoli in evidenza |

Il navy è l'inchiostro e non conta come accento: l'accento è uno solo, l'oro-arancio. Il titolo della home è navy che sfuma in `#E8A33D` sulle ultime lettere. È un effetto del sito: nei video usalo al massimo su una parola chiave, mai come sfondo sfumato dietro un titolo centrato (vietato dalle regole).

## Font (dal sito)
- **Manrope** (`assets/brand/fonts/Manrope-VariableFont_wght.ttf`, pesi 200–800, licenza OFL accanto) per tutto: titoli 700, con tracking leggermente stretto; testi 400–600.
- Nei video si usa Manrope in due ruoli, distinti dal peso: **display 700–800** e **UI 500–600**.
- Niente a schermo sotto gli 88 px nel 16:9.

## Logo
- `assets/brand/logo/cato-simbolo-navy.png` (750×750), il simbolo con la spunta
- `cato-simbolo-arancione.png`, `cato-simbolo-bianco.png`
- `cato-logo-navy.png`, `cato-logo-bianco.png` (2658×746), il logotipo esteso

## Sfondo tipico del sito
Chiaro (`#FDFDFA`) con una griglia sottile di linee chiare. Nei video si può riprendere come sfondo calmo.

## Movimento: lo stile standard è "calmo"
Deciso il 2026-11-19 con un provino a confronto (piatto / molto mosso / calmo): i video Cato sono **un po' statici ma interessanti**. Si muove poco, ma succede sempre qualcosa.

**Sì, sempre:**
- **Camera quasi ferma:** al massimo **una** spinta lenta per scena (zoom fino a ~1.4 in 3–4 s, `power1.inOut`), solo quando serve a leggere una schermata. Niente panoramiche ripetute.
- **Testo parola per parola** che sale da una maschera (`SplitText`, `yPercent: 100`, 0,6–0,7 s, `power3.out`, uno sfasamento di ~0,12 s o una parola per battito). Niente rimbalzi.
- **Entrate che si posano:** schermate, schede e pannelli salgono di poco (40–80 px) o arrivano appena inclinati (≤ 8°) e si fermano, 0,6–0,9 s, `power3.out`.
- **Uscite morbide:** l'elemento scivola di 30–60 px e sparisce in ~0,35 s, al massimo con una sfocatura leggerissima.
- **I dettagli fanno l'interesse:** linee e sottolineature arancio che si disegnano (`DrawSVG`), spunte e piccoli cambi a tempo con la musica, un pannello navy che sale come stacco, una luce che passa sul logo in chiusura, la griglia di puntini dello sfondo quasi ferma (pochi px in tutto il film).

**No, salvo richiesta esplicita:** whip pan con scie, zoom o spostamenti di camera ripetuti, 3D di taglio o profondità marcata, lettere che rimbalzano o esplodono, motion blur e scie usati come effetto.

Molle di casa (in `modelli/video-parlato/assets/molle.js`), da usare con misura: snappy (k 520, c 34) per piccole comparse, default (k 260, c 28), heavy (k 140, c 26, m 1.2) per il logo. Non si usa mai l'opacità da sola: un fade va sempre insieme a un piccolo spostamento o a una maschera.

## Tono
Professionale, chiaro, italiano. Frasi brevi con il punto finale.

## Musica
`assets/brand/audio/cato-music.wav`: 16 s, mono 48 kHz, −17 LUFS (da portare a −14). È la traccia del film d'esempio: per un video nuovo si può riusare o sintetizzarne una nuova.
