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

## Movimento (stile di casa, nato con lo spot Cato Connectors)
Quattro molle: snappy (k 520, c 34), default (k 260, c 28), heavy (k 140, c 26, m 1.2) e playful (definita, non usata).
- snappy: comparse, impatti
- default: voli, camera, uscite del testo
- heavy: logo, entrate del testo

Il testo entra da una maschera, salendo con 4° di inclinazione. Non si usa mai l'opacità da sola. Gli elementi veloci hanno motion blur e una scia sottile del colore d'accento.

## Tono
Professionale, chiaro, italiano. Frasi brevi con il punto finale.

## Musica
`assets/brand/audio/cato-music.wav`: 16 s, mono 48 kHz, −17 LUFS (da portare a −14). È la traccia del film d'esempio: per un video nuovo si può riusare o sintetizzarne una nuova.
