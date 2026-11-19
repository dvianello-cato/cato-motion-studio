# Motion studio rules
## Render contract
- Ogni film è una funzione pura del tempo: `window.seek(t)` disegna il frame t. Nessuno stato tra frame.
- Niente CSS transitions, setTimeout o requestAnimationFrame nel render. Rumore solo con seed (mulberry32), mai Math.random.
- Render con `node render.mjs`, encode H.264 yuv420p, CRF 16.
## Look
- Vietati: titolo centrato su gradiente, tutto che fa fade-in, label agli angoli e cornici, glow sulla UI, particelle generiche.
- Un font display, un font UI, un solo colore accento salvo diversa indicazione nel brief.
- Ogni 2–4 secondi deve succedere qualcosa di nuovo.
## Sound
- Musica ed effetti sonori sintetizzati in codice, salvo traccia fornita.
- Colpi allineati alla beat grid misurata (beats.json). Loudness −14 LUFS, con `npx hyperframes normalize-audio` e verifica con `npx hyperframes audio <file> --json`.
## Loop prima di mostrarmi qualcosa
1. Renderizza un frame per beat come contact sheet e GUARDALO.
2. Voto 1–10 su: hook nei primi 2s, leggibilità su smartphone, qualità del movimento, varietà, aderenza al brand, sync col suono.
3. Correggi i 3 problemi peggiori. Ripeti finché ogni voto è >= 8.
4. Solo allora fai il render completo.
## Brand
- Usa SOLO gli asset in assets/brand e assets/screenshots. Prima di scrivere codice mostrami shot list e beat grid in tabella e aspetta il mio ok.

## Avvio automatico
- Ogni volta che si apre Claude Code nello studio parte da solo `tools/avvio.sh` (hook in `.claude/settings.json`). Su `main` e con la cartella pulita scarica gli aggiornamenti, rimette le dipendenze se `package.json` è cambiato e aggiorna il plugin HyperFrames se è più vecchio della versione dello studio. Quando è tutto a posto non dice niente.
- Se l'avvio scrive delle righe, riferiscile alla persona all'inizio della prima risposta, in italiano semplice, e se dicono di riaprire Claude Code dillo chiaramente.
- Nessuno deve aggiornare a mano. `/setup-studio` serve solo la prima volta, o quando l'avvio dice che qualcosa non va.
- Quando cambi la versione di HyperFrames, la cambi solo in `package.json` (versione esatta, senza `^`): l'avvio porta tutti i Mac a quella versione.

## Procedura
- Per ogni nuovo spot usa la skill `/spot-cato` (`.claude/skills/spot-cato/SKILL.md`). Lo studio non contiene film finiti: i film restano sul Mac di chi li fa.
- Per un video di una persona che parla, con sottotitoli e grafiche sopra, usa `/video-parlato` (`.claude/skills/video-parlato/SKILL.md`), che parte dal modello `modelli/video-parlato/`.
- I modelli in `modelli/` non sono film: si copiano dentro `films/<nome>/` e si modificano lì.
- HyperFrames si aggiorna spesso. Se un comando avvisa che le skill o la CLI sono vecchie, proponi `/setup-studio`. Le regole di HyperFrames (skill `/hyperframes`) valgono insieme a queste: dove si contraddicono, vincono queste per il look e il brand, e le loro per il formato tecnico.
- **Ogni film è una cartella sola** in `films/<nome-video>/`, con dentro `LEGGIMI.md`, `video/`, `progetto/` e, se c'è, `claude-design/`. Niente file di un film fuori dalla sua cartella.
- Guida per le persone: `COME-SI-USA.md`.
