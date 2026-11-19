---
name: setup-studio
description: Prepara il Cato Motion Studio su questo Mac e verifica che tutto funzioni. Usala alla prima apertura del repository, quando qualcuno scrive "setup", "installa lo studio", "non mi funziona il render", oppure dopo un aggiornamento del repository. Controlla e installa (con conferma) Homebrew, Node, FFmpeg, le dipendenze, il plugin HyperFrames e Fish Audio, fa i test di render e chiude con una tabella di stato.
---

# Setup dello studio

Chi lancia questa skill di solito non è uno sviluppatore. Parla in italiano semplice e fai un passo alla volta: per ogni passo **controlla** se è già a posto, **installa solo se manca**, poi **verifica**. Chiedi conferma prima di ogni installazione di sistema (`brew`). Se un passo fallisce, prova a risolvere una volta, poi segnalalo e vai avanti.

Lavora sempre nella cartella del repository (quella che contiene questo `.claude/`).

## 1. Aggiornamento
`git pull --ff-only`. Se non riesce perché ci sono modifiche locali, non forzare: dillo e vai avanti.
Poi `bash tools/avvio.sh`: è lo stesso controllo che parte da solo a ogni apertura. Se stampa delle righe, riferiscile.

## 2. Sistema
1. `uname -m`: deve essere un Mac. Apple Silicon o Intel vanno bene tutti e due.
2. `brew --version`. Se manca, mostra il comando di https://brew.sh e aspetta che la persona lo lanci: serve la sua password. In alternativa, il primo passo del dev-env Cato installa già Homebrew e GitHub: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/AppaltiGPT/dev-env-install/main/install.sh)"`.
3. `node -v` deve essere ≥ 22 (vedi `.nvmrc`). Altrimenti `brew install node`.
4. `ffmpeg -version` e `ffprobe -version`. Altrimenti `brew install ffmpeg`.

## 3. Dipendenze del progetto
1. `npm ci`. Le versioni sono bloccate in `package-lock.json`, così tutti hanno le stesse.
2. `npx playwright install chromium` (serve a `render.mjs`).
3. `npx hyperframes --version` deve dare la versione di `package.json`.

## 4. Plugin e collegamenti di Claude Code
1. **HyperFrames.** `.claude/settings.json` lo dichiara, quindi Claude Code propone di installarlo quando si apre la cartella. Verifica con `claude plugin list` che compaia `hyperframes@hyperframes`, abilitato. Se manca:
   - `claude plugin marketplace add heygen-com/hyperframes`
   - `claude plugin install hyperframes@hyperframes`
   - Se l'installazione fallisce con "Host key verification failed", ripeti l'ultimo comando con `GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=url.https://github.com/.insteadOf GIT_CONFIG_VALUE_0=git@github.com:` davanti: scarica via HTTPS invece che via SSH.
   - Se c'è già, **aggiornalo**: `claude plugin marketplace update hyperframes`, poi `claude plugin update hyperframes@hyperframes --scope user` e `--scope project`. La versione del plugin deve essere uguale o più nuova di quella di `package.json`.
   - Le skill di un plugin appena installato o aggiornato si caricano dalla **prossima** sessione: dillo alla persona.
2. **Fish Audio (voce).** `.mcp.json` lo dichiara. Controlla con `claude mcp list`:
   - se manca, `claude mcp add --scope user --transport http fish-audio https://api.fish.audio/mcp`;
   - se è "Needs authentication", di' alla persona di scrivere `/mcp`, scegliere **fish-audio** e fare il login (account su https://fish.audio). Aspetta che confermi, poi ricontrolla.
   - È facoltativo: serve solo per i video con la voce.

## 5. Test
1. **Render da zero (strada A):** `npm test` deve creare `tests/output/test.mp4`. Con `ffprobe` verifica 1920×1080, 3 s, yuv420p.
2. **HyperFrames:** in `tests/hyperframes-prova/` (un progetto di prova di 4 s, non un film) prima copia gli asset del brand con `rm -rf assets && mkdir assets && cp -R ../../assets/brand assets/brand`, poi lancia `npx hyperframes check --json` (0 errori) e `npx hyperframes render --fps 30 -q draft -o ../output/test-hyperframes.mp4`. Con `ffprobe` verifica 1920×1080, 4 s, traccia audio presente.
3. **Verticale:** come sopra con `-c compositions/prova-9x16.html -o ../output/test-hyperframes-9x16.mp4` → 1080×1920.
4. **Trascrizione in italiano (per `/video-parlato`):** `say -v Alice -o tests/output/frase.aiff "Ciao, sono Cato. Trovo le gare giuste per te."`, poi `npx hyperframes transcribe tests/output/frase.aiff --model small --language it --json`. La prima volta scarica Whisper da solo (qualche minuto). Deve restituire la frase in italiano, non tradotta.
5. **Voce** (solo se Fish Audio è collegato): genera "Benvenuti in Cato, i connettori lavorano per te." in italiano e salvala in `tests/output/test-voce.mp3`.

## 6. Report finale
Tabella: **Componente | Stato (✅/❌) | Versione o dettaglio | Cosa devi fare tu**.
Righe: Homebrew, Node ≥ 22, FFmpeg, Dipendenze (npm), Plugin HyperFrames, Fish Audio, Test render da zero, Test HyperFrames 16:9, Test HyperFrames 9:16, Trascrizione italiana, Test voce, App HyperFrames (facoltativa: `ls /Applications ~/Applications | grep -i hyperframes`; se manca, il link è https://hyperframes.dev/studio).

Poi spiega in tre righe come si parte:
- Studio di prova: `cd tests/hyperframes-prova && npx hyperframes preview`.
- Spot nuovo: scrivi `/spot-cato` e cosa vuoi.
- Video di una persona che parla, con grafiche e sottotitoli: scrivi `/video-parlato` e trascina il video.
- Guida completa: `COME-SI-USA.md`.

Ricorda anche che da adesso lo studio si aggiorna da solo a ogni apertura (`tools/avvio.sh`): non serve rilanciare questa skill, salvo quando l'avvio dice che qualcosa non va.

Non iniziare nessun video vero finché la persona non lo chiede.
