---
name: spot-cato
description: Crea uno spot video di Cato (motion graphics di prodotto) dall'inizio alla fine, nella cartella motion-studio. Usala quando qualcuno chiede un video, uno spot, un'animazione, una versione verticale o social di un video Cato, oppure porta uno zip esportato da Claude Design. Riscrive il prompt libero in un director's brief in 12 punti, fa domande solo su ciò che manca, prepara il materiale, apre uno storyboard visivo nel browser e aspetta l'ok, costruisce il film in HyperFrames, lo controlla fotogramma per fotogramma, lo apre nello Studio per i ritocchi e poi lo esporta in 16:9 e 9:16.
---

# Spot Cato

Procedura nata con lo spot "Cato Connectors" (2026-10-02). Lo studio non contiene film finiti: **ogni video è nuovo** e parte da zero, seguendo le regole tecniche qui sotto e le molle di `modelli/video-parlato/assets/molle.js`.

**Due punti di partenza, entrambi validi:** (a) da zero qui in Claude Code, con un brief, il brand e gli screenshot veri; (b) da una bozza fatta in **Claude Design**, già in formato HyperFrames grazie al prompt di `PROMPT-CLAUDE-DESIGN.md`, che qui si rifinisce (musica e sincronia, verticale, controllo qualità, render, Studio).

**Come parli.** Chi usa questa skill di solito è del marketing o del design, non uno sviluppatore. Scrivi in italiano semplice, senza gergo: niente "tween", "PSNR" o "composition" senza spiegarli. Dopo ogni passo di' cosa hai fatto e cosa succede adesso.

**Regole sempre valide:** il `CLAUDE.md` di questa cartella (render contract, look, sound, ciclo di critica, brand) e `brand.md`.

## Una cartella per film
Tutto quello che riguarda un video sta in `films/<nome-video>/`, e niente fuori. `<nome-video>` è breve, in minuscolo e con i trattini (es. `ricerca-gare`).
```
films/<nome-video>/
├── LEGGIMI.md        cos'è, i video finali, come si riapre (lo scrivi tu alla consegna)
├── BRIEF.md          il director's brief in 12 punti (passo 2)
├── video/            i video finiti; le versioni vecchie in video/versioni-precedenti/
├── progetto/         il progetto HyperFrames (index.html, compositions/, assets/, storyboard)
└── claude-design/    lo zip e i file di Claude Design, solo se il film parte da lì
```
Le bozze e i provini di controllo vanno nella cartella temporanea della sessione, mai nel film.

## 0. Controllo veloce dell'ambiente
Esegui in silenzio e parla solo se manca qualcosa:
- `node -v` deve essere ≥ 22. Servono anche `ffmpeg -version` e `npx hyperframes --version` (deve dare la versione di `package.json`).
- Il plugin HyperFrames deve essere aggiornato: se `claude plugin list` mostra una versione più vecchia di quella di `package.json`, proponi `/setup-studio`.
- In `claude mcp list` deve comparire `fish-audio`. Se è "Needs authentication" e servirà la voce, chiedi di lanciare `/mcp` e fare il login.
Se manca qualcosa di sistema, mostra il comando e chiedi conferma prima di installarlo.

## 1. Il prompt e le domande
**Il prompt.** Se il comando arriva con un testo dopo `/spot-cato` (es. `/spot-cato uno spot di 15 secondi sulla ricerca gare per LinkedIn`), quello è il prompt: non chiederlo di nuovo. Se `/spot-cato` arriva da solo, chiedi in una riga: "Che video vuoi? Scrivimelo come ti viene."

**Le domande, una volta sola e tutte insieme.** Dal prompt ricava tutto quello che puoi; per il resto usa i valori predefiniti (15–20 secondi, 120 BPM, 16:9 e 9:16, brand da `brand.md`). Con AskUserQuestion chiedi **solo quello che manca davvero**, al massimo 4 domande, scelte tra:
1. **Da dove partiamo?** Da zero, da uno zip di Claude Design, oppure da un video precedente da variare. Se vogliono passare da Claude Design e lo zip non c'è ancora, mostra il contenuto di `PROMPT-CLAUDE-DESIGN.md` da incollare lì, aiutali a compilare le parti tra parentesi e fermati finché non tornano con lo zip.
2. **Il messaggio:** quale funzione di Cato e cosa deve capire chi guarda, in una riga.
3. **I testi a schermo:** se li hanno già o se li proponi tu.
4. **Voce:** nessuna, oppure voiceover in italiano con Fish Audio (serve il testo).
Non chiedere quello che il prompt dice già.

## 2. Il director's brief in 12 punti
Se si parte da uno zip di Claude Design o da un video precedente, fai prima il passo 3 (il materiale) e scrivi il brief partendo da ciò che contiene.

Riscrivi il prompt nello scheletro del director's brief (dalla guida "Motion graphics con Opus 5.5"), già orientato a HyperFrames. Completa tu ogni punto ricavabile da prompt, risposte, `brand.md` e `CLAUDE.md`; dove manca un dato, scrivi la tua proposta e segnalala come tale.

| # | Punto | Cosa contiene |
|---|---|---|
| 1 | **Ruolo** | "Sei director, animator, sound designer e render engineer." |
| 2 | **Film in una riga** | cosa racconta, a chi, in quanti secondi |
| 3 | **Reference** | video, immagini o link di riferimento: cosa prenderne (la grammatica) e cosa no (contenuti, loghi altrui). Nessuno → "nessuna, stile da brand.md" |
| 4 | **Strumenti** | HyperFrames (formato modificabile nello Studio), Fish Audio se c'è voce, gli asset disponibili in `assets/` |
| 5 | **Brand** | palette, font, logo e screenshot da usare (da `brand.md`), e gli stati di ogni elemento UI che si anima |
| 6 | **Direzione** | lo stile di movimento in una frase. Il predefinito è lo stile **calmo** di `brand.md` ("Movimento"): scrivi come lo applichi qui, e scrivi solo se la persona chiede di più (o di meno) |
| 7 | **Beat sheet** | tabella: battito, secondi, cosa succede, suono. 120 BPM, eventi forti sul primo battito della battuta |
| 8 | **Testo a schermo** | le frasi esatte, la gerarchia, quanto restano a schermo per essere lette (almeno 1,5 s), dimensioni minime |
| 9 | **Cose da evitare** | i divieti di `CLAUDE.md` più quelli specifici di questo video |
| 10 | **Punti di approvazione** | brief → storyboard → Studio: dove ci si ferma ad aspettare l'ok |
| 11 | **Ciclo di critica** | i 6 voti (hook, leggibilità su smartphone, movimento, varietà, brand, sincronia), soglia 8 |
| 12 | **Consegna** | formati (16:9 e/o 9:16), durata, 60 fps, −14 LUFS, file in `films/<nome-video>/video/` |

Salvalo in `films/<nome-video>/BRIEF.md` (fuori da `progetto/`: lì HyperFrames usa un suo file con lo stesso nome). Mostralo in chat in forma compatta: i 12 punti, uno o due righe ciascuno, il beat sheet per intero. Chiedi: "Va bene così o cambio qualcosa?" **Aspetta l'ok sul brief.** Le correzioni si scrivono nel file. Da qui in poi tutto (storyboard, costruzione, voti) segue il brief.

## 3. Il materiale
- **Zip di Claude Design:** cercalo in `~/Downloads` (il più recente). Copialo in `films/<nome-video>/claude-design/` ed estrailo lì. I link `claude.ai/design/...` non si aprono da qui: se ti danno un link, spiega che serve "Share → Export → Project HTML → Download → .zip".
- **Riassumi cosa c'è dentro:** scene, testi, colori, font, asset, tempi (cerca un file come `Sync points.md`) e la musica. Avvisa se ci sono file vecchi che contraddicono il film, per esempio una style guide superata.
- **Asset:** devono stare in `assets/brand/` e `assets/screenshots/`. Se lo zip porta loghi, font o musica nuovi, proponi di copiarli lì. Non usare asset che non stanno in quelle cartelle.
- **Formato dello zip:** se contiene `hyperframes.json` o un `index.html` con `data-composition-id`, è già in formato HyperFrames. In quel caso **non ricostruirlo**: copialo in `films/<nome-video>/progetto/`, lancia `npx hyperframes check --json`, poi rifinisci rispettando il lavoro fatto in Claude Design (musica, tempi sui battiti, verticale). Altrimenti va **convertito**: vedi il passo 5.

## 4. Storyboard nel browser: STOP, aspetta l'ok
Le regole di HyperFrames sullo storyboard sono in `hyperframes/references/storyboard.md` e `storyboard-format.md` (skill del plugin): da lì prendi il principio, una tavola per inquadratura con testi, font e colori veri. La pagina la disegniamo noi come descritto qui sotto.
1. **Il piano, in breve in chat:** "Questo video dice a [chi] che [messaggio]", più l'elenco delle scene in poche righe, ricavato dal beat sheet di `BRIEF.md`. Scrivilo anche in `films/<nome-video>/progetto/STORYBOARD.md`, insieme a `films/<nome-video>/progetto/beats.json` (bpm, beats, downbeats, hits).
2. **Lo storyboard visivo:** `films/<nome-video>/progetto/storyboard.html`, una pagina sola e autonoma, senza animazioni. Per ogni scena c'è un riquadro con il fotogramma chiave disegnato con i **font, i colori e i testi veri** e con gli asset di `assets/` (blocchi semplici solo per ciò che ancora non esiste). Sotto ogni riquadro: numero e nome della scena, tempo di inizio e fine, cosa si muove per primo, il suono. In cima: titolo con la versione (v1), formato, durata, battiti. Se ci sono 16:9 e 9:16, fai una sezione per formato. Le ultime due celle sono la mappa dei passaggi tra le scene e i token (palette, ruoli dei font, divieti).
3. **Aprilo** nel browser con `open films/<nome-video>/progetto/storyboard.html` e di' alla persona che si è aperto.
4. **Revisione:** chiedi cosa cambiare. Riporta le note in `## Changes from v1`, correggi **solo le scene nominate**, aumenta la versione e riapri la pagina. Ripeti finché la persona non dice che va bene, poi annota sotto `## Locked` cosa è bloccato.
**Non costruire senza un ok esplicito sullo storyboard.** Se chiedono "dammi direttamente il risultato", salta l'attesa, ma apri comunque lo storyboard e dichiara le scelte che hai fatto tu. Nella costruzione la disposizione approvata non si ridisegna: si veste (design completo, asset veri, movimento).

## 5. Costruzione in HyperFrames (formato modificabile nello Studio)
Progetto in `films/<nome-video>/progetto/`, con `hyperframes.json`, una copia di `assets/brand` e di `assets/lib` dentro `assets/` (`cp -R assets/brand assets/lib films/<nome-video>/progetto/assets/`), `index.html` (16:9) e `compositions/<nome>-9x16.html`.

Prima di scrivere composizioni leggi la skill `/hyperframes` del plugin e i suoi riferimenti che servono: `references/format.md` (struttura, attributi), `references/motion.md` (movimento), `references/sound.md` (suono), più il file del tipo di video in `references/types/` (per uno spot: `launch.md`). Se non sono caricate, le trovi in `~/.claude/plugins/cache/hyperframes/hyperframes/<versione>/skills/hyperframes/`.

**Stile di movimento: calmo, sempre.** Segui la sezione "Movimento" di `brand.md`: camera quasi ferma (al massimo una spinta lenta per scena), testo parola per parola senza rimbalzi, entrate che salgono di poco e si posano, uscite morbide. L'interesse viene dai dettagli a tempo con la musica (linee che si disegnano, spunte, pannello navy, luce sul logo), non dal muovere tutto. Whip pan, scie, zoom ripetuti, 3D di taglio e lettere che rimbalzano solo se la persona li chiede. Nel ciclo di critica, "qualità del movimento" vuol dire anche questo: se un fotogramma per battito mostra la camera in un posto diverso quasi ogni volta, è troppo.

**Prima di disegnare a mano un effetto, cercalo nel catalogo** con `/hyperframes-registry` (`npx hyperframes catalog --json`): ci sono già scie di movimento (`echo-smear`), cursori grandi per i tutorial, una schermata "ripresa con la telecamera" (`filmed-screen`), transizioni, grafici, oggetti 3D e sfondi animati. Un pezzo del catalogo si installa con `npx hyperframes add <nome>` e poi si veste con colori e font di `brand.md`.

**GSAP e i suoi plugin sono in `assets/lib/gsap/`** (versione 3.15.1, gratuiti, vedi il `LEGGIMI.md` lì dentro): carica sempre `assets/lib/gsap/gsap.min.js`, mai GSAP da internet. Prima di ripiegare su un fade, chiediti se un plugin fa meglio: **SplitText** per il testo lettera per lettera o parola per parola, **DrawSVG** per connettori e sottolineature che si disegnano, **MorphSVG** per un'icona che diventa un'altra forma, **MotionPath** per oggetti che viaggiano su una curva, **CustomEase** per le curve della casa.

Regole imparate sui primi spot:
- **Un elemento con id per ogni pezzo** (testo, tessera, logo, pannello) e **un tween letterale per riga** (`tl.fromTo("#id", {...}, {...}, tempo)`): così lo Studio li vede e si possono modificare a mano.
- **Le molle diventano easing registrate** con `gsap.registerEase` (forma chiusa, normalizzata a 1). Le catene di molle sovrapposte diventano una sola tween con una easing "catena". Le somme di movimenti (es. comparsa + carica + lancio) vanno su **wrapper annidati**, mai due tween sovrapposti sulla stessa proprietà.
- **Seconda tween sulla stessa proprietà:** `immediateRender: false`. Nessun avviso `overlapping_gsap_tweens` deve restare.
- **Scie, motion blur e copie fantasma** (solo se richiesti: lo stile calmo non li usa) stanno in una funzione `effects(t)` chiamata dall'`onUpdate` di una tween lunga quanto il film. Leggono le posizioni dalle tween stesse (`tl.getChildren`), così seguono le modifiche fatte nello Studio.
- **Sfondi alternativi** come clip con `data-hidden="true"`: si accendono con l'occhio sulla timeline.
- **Musica:** un `<audio id="music">` portato a −14 LUFS con `npx hyperframes normalize-audio . --target music --lufs -14 --write` (scrive il volume giusto in `index.html`). Con una voce sopra: `--target music --reference voce`, poi abbassa la musica a circa 0,14.
- **Convertire un film di Claude Design:** riprendi formule e tempi dal suo codice (film.jsx o simili). Scrivi un piccolo generatore (`progetto/tools/generate.mjs`) che produce 16:9 e 9:16 dallo stesso oggetto di layout. Un generatore sovrascrive le modifiche fatte nello Studio, quindi avvisa prima di rigenerare.
- Alla fine `npx hyperframes check --json` deve dare **0 errori**. Le segnalazioni (`line_unread`, `dead_stretch`, `text_below_floor`…) sono domande: correggile o di' perché restano.

## 6. Controllo prima di mostrare (ciclo di critica)
1. `npx hyperframes snapshot --review -o <tmp>`: tre provini (inizio e metà di ogni scena, i passaggi tra le scene, e i fotogrammi chiave alla larghezza di un telefono). **Guardali tutti.** Per un movimento importante: `snapshot --range INIZIO,FINE --frames 8`. Le regole di lettura sono in `hyperframes/references/review.md`.
2. Se esiste un export di Claude Design (MP4), confronta gli stessi istanti. Le differenze vere sono di posizione o di tempo; una leggera variazione di colore tra browser è normale. Ricorda che `snapshot` arrotonda al fotogramma a 30 fps.
3. Dai un voto da 1 a 10 su: hook nei primi 2 s, leggibilità su smartphone, qualità del movimento, varietà, aderenza al brand e composizione, sincronia col suono. Mostra la tabella.
4. Correggi i 3 problemi peggiori e ripeti finché ogni voto è almeno 8.

## 7. Il video nello Studio di HyperFrames, poi l'export
1. **Apri lo Studio** sul progetto: dalla cartella `films/<nome-video>/progetto/` lancia `npx hyperframes preview --port <porta libera, da 3002 in su> --no-open`, poi `open "http://localhost:<porta>/#project/progetto"`. Il 16:9 e il 9:16 compaiono nella lista **Compositions**.
2. **Spiega cosa si può fare** in poche righe:
   - premere play e scorrere la timeline;
   - cliccare un elemento per cambiarne testo, colore, posizione o dimensione (pannello **Design**);
   - spostare i rombi sulla timeline per cambiare i tempi;
   - accendere o spegnere livelli con l'occhio;
   - cambiare il volume o il file della musica.
   Di' anche cosa non si modifica da lì: gli effetti calcolati (scie, motion blur), che però seguono da soli gli elementi.
3. **Chiedi una cosa sola:** "Lo esporti tu dallo Studio, oppure lo esporto io?"
   - **Dallo Studio:** pulsante **Export** in alto → MP4, 60 fps → nel pannello **Renders** si scarica il file finito. Ripeti per ogni composizione.
   - **Da qui:** `npx hyperframes render --fps 60 -o ../video/<nome>-16x9.mp4` e, per il verticale, `-c compositions/<nome>-9x16.html -o ../video/<nome>-9x16.mp4`.
   Se nello Studio hanno fatto modifiche, entrambe le strade le includono, perché lo Studio salva nei file del progetto.
4. **Verifica il file** con `ffprobe` (risoluzione, 60 fps) e con `npx hyperframes audio <file> --json` (audio presente, colpi dove serve, circa −14 LUFS). Di' che il suono è misurato, non ascoltato.
5. **App HyperFrames.** Se è installata (`ls /Applications ~/Applications | grep -i hyperframes`), proponi di aprire il film lì con `npx hyperframes open` dalla cartella `progetto/`: si apre con questa conversazione, e la persona può cerchiare o commentare un punto del video per chiedere modifiche. Al ritorno qui, `npx hyperframes catch-up` dice cosa ha cambiato. Se non c'è, il link per scaricarla è https://hyperframes.dev/studio.
6. **Scrivi `films/<nome-video>/LEGGIMI.md`** (cosa racconta, data, video finali con formato e durata, come si riapre nello Studio, da dove è partito) con un titolo, poche righe di descrizione e una tabella dei video finali.
7. **Chiudi** con una tabella: file, dove si trova, formato, durata, audio. Ricorda che i video restano sul Mac: per l'archivio comune vanno caricati su Drive. Di' onestamente cosa non hai potuto verificare, per esempio l'ascolto della musica.

## 8. Voce (se richiesta)
Con l'MCP di Fish Audio genera il voiceover in italiano (tono sicuro e caldo) e salvalo in `assets/` del film. Aggiungilo come secondo `<audio id="voce">` allineato ai battiti, abbassa la musica sotto la voce (`normalize-audio --target music --reference voce`, poi circa 0,14), controlla con `npx hyperframes audio` e rifai il render.

Per un video con una **persona vera che parla** non si usa questa skill: c'è `/video-parlato`.
