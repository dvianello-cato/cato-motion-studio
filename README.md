# Cato Motion Studio

Video di Cato fatti con Claude Code e HyperFrames, gratis sul proprio Mac, in 16:9 e 9:16: spot di prodotto con la musica a tempo, e video di una persona che parla con sottotitoli e grafiche sopra. Si ritoccano a mano nello Studio.

## Installazione (una volta sola)
Apri il Terminale e incolla:
```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/dvianello-cato/cato-motion-studio-install/main/install.sh)"
```
Installa da solo quello che manca (Homebrew, Node, FFmpeg, Claude Code, il plugin HyperFrames), scarica lo studio sulla Scrivania e apre Claude Code con `/setup-studio`. Non serve un account GitHub. La guida passo passo è su https://github.com/dvianello-cato/cato-motion-studio-install.

Lo studio è pubblico e contiene solo quello che serve per partire: strumenti, brand e modelli. I film restano sul Mac di chi li fa (`films/` non va su GitHub).

## Un video nuovo
```
cd ~/Desktop/cato-motion-studio && claude
```
poi scrivi `/spot-cato` e cosa vuoi, oppure `/video-parlato` e trascina il tuo video.

## Aggiornamenti
Automatici: ogni volta che apri Claude Code qui, `tools/avvio.sh` scarica la versione nuova dello studio, rimette i programmi e aggiorna HyperFrames, se serve. Se qualcosa non va, `/setup-studio`.

## Dove leggere
- `COME-SI-USA.md`: la guida per le persone, passo per passo
- `PROMPT-CLAUDE-DESIGN.md`: il prompt da usare se la bozza la fai in Claude Design
- `CLAUDE.md` e `brand.md`: le regole che Claude segue sempre
- `.claude/skills/`: `setup-studio` (installazione e test), `spot-cato` (gli spot) e `video-parlato` (persona che parla + grafiche)
- `modelli/`: i punti di partenza riutilizzabili (`video-parlato/`)
- `tools/avvio.sh`: il controllo automatico a ogni apertura
- `films/`: un film per cartella. Dentro ognuno: `LEGGIMI.md`, `video/` (i video finiti), `progetto/` (si apre nello Studio), `claude-design/` (lo zip, se c'è). Resta sul tuo Mac.
- `tests/`: le prove tecniche del setup

I video finiti non vanno nel repository: tienili su Drive.
