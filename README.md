# Cato Motion Studio

**[English](#english) · [Italiano](#italiano)**

---

<a id="english"></a>
## 🇬🇧 English

Cato videos made with Claude Code and HyperFrames, free, on your own Mac, in 16:9 and 9:16: product spots with music in sync, and videos of a person speaking with captions and graphics on top. You can fine-tune them by hand in the Studio.

### Installation (once)
Open Terminal and paste:
```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/dvianello-cato/cato-motion-studio-install/main/install.sh)"
```
It installs whatever is missing (Homebrew, Node, FFmpeg, Claude Code, the HyperFrames plugin), downloads the studio to your Desktop and opens Claude Code with `/setup-studio`. No GitHub account needed. The step-by-step guide is at https://github.com/dvianello-cato/cato-motion-studio-install.

The studio is public and contains only what you need to get started: tools, brand and templates. Films stay on the Mac of whoever makes them (`films/` is never uploaded to GitHub).

### A new video
```
cd ~/Desktop/cato-motion-studio && claude
```
then type `/spot-cato` and what you want, or `/video-parlato` and drag in your video.

### Updates
Automatic: every time you open Claude Code here, `tools/avvio.sh` downloads the new version of the studio, reinstalls the tools and updates HyperFrames if needed. If something goes wrong, `/setup-studio`.

### Where to read
- `COME-SI-USA.md`: the step-by-step guide for people (Italian)
- `PROMPT-CLAUDE-DESIGN.md`: the prompt to use if you draft in Claude Design
- `CLAUDE.md` and `brand.md`: the rules Claude always follows, including the "calm" motion style
- `.claude/skills/`: `setup-studio` (installation and tests), `spot-cato` (spots) and `video-parlato` (person speaking + graphics)
- `modelli/`: reusable starting points (`video-parlato/`)
- `assets/brand/`, `assets/screenshots/`, `assets/lib/gsap/`: Cato's design system, product screenshots, GSAP and its plugins
- `tools/avvio.sh`: the automatic check on every launch
- `films/`: one film per folder, with `LEGGIMI.md`, `video/` (finished videos), `progetto/` (opens in the Studio), `claude-design/` (the zip, if any). Stays on your Mac.
- `tests/`: the setup's technical tests

Finished videos don't go in the repository: keep them on Drive.

---

<a id="italiano"></a>
## 🇮🇹 Italiano

Video di Cato fatti con Claude Code e HyperFrames, gratis sul proprio Mac, in 16:9 e 9:16: spot di prodotto con la musica a tempo, e video di una persona che parla con sottotitoli e grafiche sopra. Si ritoccano a mano nello Studio.

### Installazione (una volta sola)
Apri il Terminale e incolla:
```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/dvianello-cato/cato-motion-studio-install/main/install.sh)"
```
Installa da solo quello che manca (Homebrew, Node, FFmpeg, Claude Code, il plugin HyperFrames), scarica lo studio sulla Scrivania e apre Claude Code con `/setup-studio`. Non serve un account GitHub. La guida passo passo è su https://github.com/dvianello-cato/cato-motion-studio-install.

Lo studio è pubblico e contiene solo quello che serve per partire: strumenti, brand e modelli. I film restano sul Mac di chi li fa (`films/` non va su GitHub).

### Un video nuovo
```
cd ~/Desktop/cato-motion-studio && claude
```
poi scrivi `/spot-cato` e cosa vuoi, oppure `/video-parlato` e trascina il tuo video.

### Aggiornamenti
Automatici: ogni volta che apri Claude Code qui, `tools/avvio.sh` scarica la versione nuova dello studio, rimette i programmi e aggiorna HyperFrames, se serve. Se qualcosa non va, `/setup-studio`.

### Dove leggere
- `COME-SI-USA.md`: la guida per le persone, passo per passo
- `PROMPT-CLAUDE-DESIGN.md`: il prompt da usare se la bozza la fai in Claude Design
- `CLAUDE.md` e `brand.md`: le regole che Claude segue sempre, compreso lo stile di movimento "calmo"
- `.claude/skills/`: `setup-studio` (installazione e test), `spot-cato` (gli spot) e `video-parlato` (persona che parla + grafiche)
- `modelli/`: i punti di partenza riutilizzabili (`video-parlato/`)
- `assets/brand/`, `assets/screenshots/`, `assets/lib/gsap/`: il design system di Cato, le schermate del prodotto, GSAP e i suoi plugin
- `tools/avvio.sh`: il controllo automatico a ogni apertura
- `films/`: un film per cartella. Dentro ognuno: `LEGGIMI.md`, `video/` (i video finiti), `progetto/` (si apre nello Studio), `claude-design/` (lo zip, se c'è). Resta sul tuo Mac.
- `tests/`: le prove tecniche del setup

I video finiti non vanno nel repository: tienili su Drive.
