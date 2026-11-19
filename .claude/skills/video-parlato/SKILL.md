---
name: video-parlato
description: Trasforma un video di una persona che parla (presentazione, tutorial, intervista, messaggio per LinkedIn) in un video Cato con sottotitoli e grafiche sincronizzate con quello che dice, cioè nome e ruolo, numeri che crescono, frasi chiave, schermate di Cato e chiusura con il logo, nei colori e nel font del brand, in 16:9 e/o 9:16. Usala quando qualcuno porta un suo video parlato, dice "metti le grafiche sul mio video", "aggiungi i sottotitoli", "un video di me che parlo con le infografiche", o trascina un .mov/.mp4 registrato con la webcam o il telefono. Per uno spot senza persona usa /spot-cato.
---

# Video parlato

La persona che parla resta **intera e intatta** sotto. Sopra arrivano i sottotitoli e i riquadri grafici, agganciati alle parole esatte. Tutto gira sul Mac, gratis: la trascrizione è locale (Whisper), il render è HyperFrames.

**Come parli.** Chi usa questa skill di solito fa marketing o design. Italiano semplice, niente gergo. Dopo ogni passo di' cosa hai fatto e cosa succede adesso.

**Regole sempre valide:** `CLAUDE.md` di questa cartella e `brand.md`. Il modello tecnico è in `modelli/video-parlato/` (leggi il suo `LEGGIMI.md`): **non riscrivere i riquadri da zero**, usa il generatore e ritocca dopo.

## 0. Ambiente
In silenzio: `node -v` (≥ 22), `ffmpeg -version`, `npx hyperframes --version` (deve dare la versione di `package.json`). Parla solo se manca qualcosa.

## 1. Il video e le domande
1. **Trova il video.** Se è stato trascinato in chat hai già il percorso. Altrimenti cerca il più recente in `~/Downloads`, `~/Desktop` e `~/Movies` (`.mov`, `.mp4`, `.m4v`) e chiedi conferma con nome e durata.
2. **Guardalo prima di chiedere.** `ffprobe` per durata, risoluzione, orientamento, fps e audio. Estrai un fotogramma ogni 2 s in un provino (`ffmpeg -vf fps=0.5,scale=480:-1,tile=4x3`) e **guardalo**: dov'è la persona (centro, lato), se ci sono tagli, se ci sono già scritte nel video.
3. **Le domande, tutte insieme e solo quelle che mancano** (AskUserQuestion, al massimo 4):
   - **Formato:** 16:9, 9:16 o tutti e due. Proponi quello del video sorgente.
   - **Nome e ruolo** da mostrare all'inizio (es. "Diego Vianello · Designer, Cato").
   - **Cosa mostrare:** "lo propongo io dalla trascrizione" (predefinito) oppure un elenco loro. Chiedi se ci sono schermate di Cato da usare (quelle in `assets/screenshots/`, o nuove da aggiungere lì).
   - **Musica sotto la voce:** nessuna (predefinito) o la traccia di `assets/brand/audio/`.
   I sottotitoli ci sono sempre, salvo richiesta contraria.

## 2. Il materiale
Nome del film: breve, minuscolo, con trattini. Cartella `films/<nome>/`, come ogni film (vedi `CLAUDE.md`).
1. Copia il modello: `cp -R modelli/video-parlato films/<nome>/progetto`, poi `cp -R assets/brand assets/lib films/<nome>/progetto/assets/` e le schermate che servono in `films/<nome>/progetto/assets/screenshots/` (nomi semplici, senza spazi).
2. **Prepara il video** in `films/<nome>/progetto/assets/parlato.mp4`, con un fotogramma chiave al secondo (altrimenti lo Studio si blocca quando scorri):
   `ffmpeg -i <sorgente> -c:v libx264 -crf 16 -g <fps> -pix_fmt yuv420p -c:a aac -b:a 192k assets/parlato.mp4`
   - Se il formato richiesto è diverso da quello del video, ritaglia al centro della persona: per un 9:16 da un 16:9 `-vf "crop=ih*9/16:ih:<x>:0,scale=1080:1920"`, con `<x>` scelto guardando il provino. Dillo: si perde parte dell'inquadratura.
   - Se il video ha tagli o più riprese, chiedi se va bene così: il modello lo tratta come un unico pezzo.
3. **Trascrivi**, sempre dicendo la lingua (senza, Whisper **traduce in inglese**):
   `npx hyperframes transcribe assets/parlato.mp4 --model small --language it --json`
   Con musica sotto o audio sporco usa `--model medium --language it`. Scrive `assets/transcript.json`.
4. **Leggi la trascrizione** e correggi i nomi che Whisper sbaglia. Su Cato sbaglia spesso: "Dicato" (di Cato), "appalto" storpiato, URL attaccati alle parole. Le correzioni vanno in `piano.json` → `correzioni` (anche su più parole: `"Prova alla gratisugetcato.com": "Provala gratis su get-cato.com"`). Non cambiare quello che la persona ha detto davvero.

## 3. Il piano: STOP, aspetta l'ok
Scrivi `films/<nome>/progetto/piano.json` (formato in `modelli/video-parlato/LEGGIMI.md`) e mostra in chat una tabella: **secondi | cosa dice | cosa compare**.

Come scegliere i riquadri:
- **nome** nei primi 3 secondi, per 2,5–4 s.
- **numero** ogni volta che dice una cifra importante: parte un attimo prima della cifra, così cresce mentre la dice.
- **frase** per il concetto chiave di un passaggio: poche parole, una sola parola in arancio (`evidenzia`).
- **schermata** quando parla di una funzione di Cato e c'è una schermata vera.
- **chiusura** sull'ultima frase (invito all'azione): copre la persona, la voce continua.
- **zoom** (campo `zoom` del piano) su 1–3 momenti forti in cui la persona è al centro: una battuta, una domanda, il "ma". Non di più, o stanca.
- Densità: un riquadro ogni 6–8 s sotto il minuto, ogni 8–12 s fino a 3 minuti. Mai due riquadri insieme. Almeno 1,5 s per leggere ogni testo. Tra due pannelli lontani la persona torna al centro: va bene, dà respiro.
Chiedi: "Va bene così o cambio qualcosa?" **Non costruire senza ok**, salvo che chiedano il risultato diretto: in quel caso dichiara le scelte.

## 4. Costruzione
Dalla cartella `progetto/`: `node tools/costruisci.mjs`. Scrive `index.html` e `compositions/`.
Per il secondo formato fai una seconda cartella progetto (`films/<nome>/progetto-9x16/`) con il suo `assets/parlato.mp4` ritagliato e `"formato": "9x16"` nel piano: il generatore sposta da solo riquadri e sottotitoli nelle posizioni del verticale.
Se chiedono sottotitoli con un altro stile (parola per parola stile karaoke, evidenziatore, parole che sbattono), il catalogo ne ha una ventina: `npx hyperframes catalog --tag caption-style --json`. Si installa con `npx hyperframes add <nome>`, si veste con Manrope e i colori di `brand.md` e prende il posto di `compositions/sottotitoli.html`.
Il generatore **riscrive tutto**: usalo per costruire e per i cambi grossi del piano, prima dei ritocchi nello Studio. Dopo i ritocchi, le modifiche si fanno a mano sui file.

## 5. Controllo prima di mostrare
1. `npx hyperframes check --json`: zero errori. Le segnalazioni di testo fuori dal riquadro durante le entrate sono normali (il testo sale da una maschera); quelle a riquadro fermo no.
2. `npx hyperframes snapshot --at <metà di ogni riquadro e di 3-4 sottotitoli> --describe false -o <cartella temporanea>` e **guarda il provino**: niente testo sulla faccia, numeri interi dentro il pannello, sottotitoli leggibili, persona ben inquadrata nella metà quando si sposta.
3. Voti 1–10: leggibilità su smartphone, sincronia con la voce, persona mai coperta male, aderenza al brand, varietà. Correggi i 3 problemi peggiori e ripeti finché sono tutti almeno 8.
4. Con la musica: `npx hyperframes normalize-audio . --target musica --reference parlato --write` e poi abbassala sotto la voce (`data-volume` circa 0,14).

## 6. Studio, export, consegna
Come `/spot-cato` passo 7: Studio su `npx hyperframes preview --port <da 3002 in su>`, poi export a 30 fps (un video parlato non guadagna niente dai 60 fps) in `films/<nome>/video/<nome>-16x9.mp4` e `-9x16.mp4`.
- Verifica con `ffprobe` e `npx hyperframes audio <file> --json` (audio presente, livello). Di' che il suono è misurato, non ascoltato.
- Se l'app HyperFrames è installata, proponi `npx hyperframes open` dalla cartella progetto: apre il film nell'app con questa conversazione.
- Scrivi `films/<nome>/LEGGIMI.md` (cosa dice, da quale video, piano, video finali, come si riapre).
- Il video originale non va su GitHub: resta in `progetto/assets/` sul Mac (è escluso da `.gitignore`).
