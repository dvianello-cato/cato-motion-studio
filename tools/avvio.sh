#!/usr/bin/env bash
# avvio.sh: parte da solo ogni volta che si apre Claude Code nello studio (hook SessionStart in .claude/settings.json).
# Tiene lo studio pronto all'uso senza chiedere niente: scarica gli aggiornamenti, rimette le dipendenze
# se sono cambiate e porta il plugin HyperFrames alla versione dello studio. Se è già tutto a posto è veloce
# e non dice niente; se qualcosa non va lo scrive, e Claude lo riferisce in italiano semplice.
# Non fallisce mai: un controllo che non riesce diventa una riga di avviso, la sessione si apre lo stesso.
cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/..}" || exit 0
note=()
# `timeout` non c'è di serie sul Mac: perl sì. Interrompe un comando che resta appeso oltre N secondi.
limite() { perl -e 'alarm shift; exec @ARGV' "$@"; }

# 1. Aggiornamenti dello studio: solo se la cartella è pulita e sul ramo principale, mai a forza.
ramo="$(git rev-parse --abbrev-ref HEAD 2> /dev/null)"
if [ "$ramo" = main ] && [ -z "$(git status --porcelain --untracked-files=no 2> /dev/null)" ]; then
  prima="$(git rev-parse HEAD)"
  if limite 20 git pull --ff-only -q > /dev/null 2>&1; then
    [ "$prima" != "$(git rev-parse HEAD)" ] && note+=("Studio aggiornato all'ultima versione da GitHub.")
  else
    note+=("Non sono riuscito a scaricare gli aggiornamenti da GitHub (rete o accesso): lo studio usa la versione che c'è sul Mac.")
  fi
elif [ "$ramo" != main ]; then
  note+=("Lo studio è sul ramo \"$ramo\", non su main: gli aggiornamenti automatici sono spenti finché non torna su main.")
fi

# 2. Dipendenze: se mancano o non corrispondono a package.json, si rimettono (npm ci, versioni bloccate).
voluta="$(node -p "require('./package.json').devDependencies.hyperframes" 2> /dev/null)"
presente="$(node -p "require('./node_modules/hyperframes/package.json').version" 2> /dev/null)"
if [ -n "$voluta" ] && [ "$voluta" != "$presente" ]; then
  if limite 240 npm ci --no-audit --no-fund > /dev/null 2>&1; then
    note+=("Programmi dello studio aggiornati: HyperFrames ${presente:-assente} → $voluta.")
  else
    note+=("Non sono riuscito a installare i programmi dello studio (npm ci): lancia /setup-studio.")
  fi
fi

# 3. Plugin HyperFrames di Claude Code: almeno la versione dello studio.
if command -v claude > /dev/null 2>&1 && [ -n "$voluta" ]; then
  plugin="$(claude plugin list --json 2> /dev/null | node -e '
    let s = ""; process.stdin.on("data", (d) => (s += d)).on("end", () => {
      try { const v = JSON.parse(s).filter((p) => p.id === "hyperframes@hyperframes" && p.scope === "user").map((p) => p.version); console.log(v[0] || ""); } catch { console.log(""); }
    });' 2> /dev/null)"
  vecchio="$(node -e 'const [a, b] = process.argv.slice(1).map((v) => v.split(".").map(Number)); for (let i = 0; i < 3; i++) { if ((a[i] || 0) !== (b[i] || 0)) { console.log((a[i] || 0) < (b[i] || 0) ? 1 : 0); process.exit(); } } console.log(0);' "${plugin:-0.0.0}" "$voluta" 2> /dev/null)"
  if [ -z "$plugin" ]; then
    limite 60 claude plugin marketplace add heygen-com/hyperframes > /dev/null 2>&1
    if limite 120 claude plugin install hyperframes@hyperframes --scope user > /dev/null 2>&1; then
      note+=("Ho installato il plugin HyperFrames: le sue istruzioni si caricano dalla prossima sessione, quindi conviene chiudere e riaprire Claude Code.")
    else
      note+=("Il plugin HyperFrames non è installato e non sono riuscito a installarlo: lancia /setup-studio.")
    fi
  elif [ "$vecchio" = 1 ]; then
    limite 60 claude plugin marketplace update hyperframes > /dev/null 2>&1
    if limite 120 claude plugin update hyperframes@hyperframes --scope user > /dev/null 2>&1; then
      note+=("Plugin HyperFrames aggiornato ($plugin → nuova versione): le istruzioni nuove si caricano dalla prossima sessione, quindi conviene chiudere e riaprire Claude Code.")
    else
      note+=("Il plugin HyperFrames è vecchio ($plugin, serve almeno $voluta) e non sono riuscito ad aggiornarlo: lancia /setup-studio.")
    fi
  fi
fi

# 4. FFmpeg serve a tutto: se manca lo si dice, non lo si installa da qui (serve brew e a volte la password).
command -v ffmpeg > /dev/null 2>&1 || note+=("Manca FFmpeg, che serve per esportare i video: lancia /setup-studio.")

if [ ${#note[@]} -gt 0 ]; then
  echo "Avvio dello studio (controllo automatico):"
  for n in "${note[@]}"; do echo "- $n"; done
  echo "Riferisci queste righe alla persona in italiano semplice, all'inizio della tua prima risposta."
fi
exit 0
