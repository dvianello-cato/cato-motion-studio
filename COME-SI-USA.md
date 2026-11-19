# Motion studio Cato: come si usa

Spot video di Cato con la musica a tempo, in 16:9 e 9:16, gratis e sul tuo computer. Li puoi ritoccare a mano nello Studio di HyperFrames.

## Una volta sola: installazione
1. Ti serve un account **Claude** di Cato. Non serve un account GitHub.
2. Apri il Terminale e incolla **questo comando**:
   ```
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/dvianello-cato/cato-motion-studio-install/main/install.sh)"
   ```
   Installa da solo quello che manca. Se ti chiede la **password del Mac**, inseriscila: serve una volta sola, per Homebrew. Poi scarica lo studio sulla Scrivania e apre Claude Code.
3. La prima volta Claude Code ti chiede di **entrare con il tuo account Claude** di Cato.
4. Quando Claude Code chiede di **fidarti della cartella** e di **installare il plugin HyperFrames**, rispondi sì.
5. Alla fine vedi una tabella con tutto verde. Se ti serve la voce, scrivi `/mcp`, scegli **fish-audio** e fai il login.

**Da qui in poi non devi aggiornare niente.** Ogni volta che apri Claude Code nello studio, lo studio controlla da solo se ci sono novità e le installa: la versione nuova dello studio, i programmi, HyperFrames. Se è tutto a posto non vedi niente. Se ha aggiornato qualcosa te lo dice, e a volte ti chiede di chiudere e riaprire Claude Code. Se qualcosa non va, scrivi `/setup-studio`: ricontrolla tutto e ti dice cosa fare.

## Ogni volta: un video nuovo
1. **Bozza in Claude Design** (facoltativa). Nel primo messaggio incolla il prompt di `PROMPT-CLAUDE-DESIGN.md`. Quando ti piace: **Share → Export → Project HTML → Download → .zip**. Lo zip resta in Download. Puoi anche partire direttamente dal punto 2, solo con un'idea.
2. **Apri Claude Code nello studio:**
   ```
   cd ~/Desktop/cato-motion-studio && claude
   ```
   (Se l'hai installato prima di ottobre 2026, la cartella si chiama `motion-studio`: `cd ~/Desktop/motion-studio && claude`.)
3. **Scrivi:** `/spot-cato` e, nella stessa riga, cosa vuoi, come ti viene: Claude lo riordina da solo. Per esempio:
   *"/spot-cato ho appena scaricato lo zip da Claude Design, voglio lo spot in 16:9 e verticale"*
4. **Rispondi alle domande** di Claude: solo quelle su ciò che il tuo messaggio non diceva.
5. **Approva il brief.** Claude riscrive la tua richiesta in un *director's brief* in 12 punti (cosa racconta, brand, stile di movimento, scene secondo per secondo, testi, cose da evitare, formati…) e lo salva nella cartella del film come `BRIEF.md`. Correggi quello che non ti torna, poi dai l'ok.
6. **Si apre lo storyboard nel browser:** una pagina con le scene disegnate, con testi, colori e tempi. Di' cosa cambiare finché ti convince, poi rispondi *"ok, procedi"*. Prima di questo ok non si costruisce niente.
7. **Claude costruisce il video e lo controlla da solo:** fa un provino, si dà i voti e corregge finché ogni voto è almeno 8.
8. **Si apre lo Studio di HyperFrames** (http://localhost:...) con il video: lo guardi e sposti o cambi quello che vuoi.
9. **Esporti il video:** dallo Studio con **Export → MP4** e poi lo scarichi dal pannello **Renders**, oppure chiedi a Claude di esportarlo. I file finiscono in `films/<nome-video>/video/`. Per l'archivio comune caricali su Drive.

## Un video di te che parli, con grafiche e sottotitoli
1. Registra il video (webcam o telefono, una ripresa sola, audio pulito). Meglio se sei al centro dell'inquadratura.
2. Apri Claude Code nello studio e scrivi `/video-parlato`, poi trascina il video nella chat.
3. Claude lo guarda, lo trascrive in italiano e ti chiede solo quello che manca (formato, nome e ruolo, musica sì o no).
4. Ti mostra una tabella: **secondi, cosa dici, cosa compare**. Sopra la tua voce possono comparire:
   - **nome e ruolo** all'inizio;
   - **numeri** che crescono mentre li dici;
   - una **frase chiave**, con una parola in arancio;
   - una **schermata di Cato** (quelle in `assets/screenshots/`);
   - la **chiusura** con il logo e l'indirizzo;
   - uno **zoom** su di te nei momenti forti.
   Quando compare un numero, una frase o una schermata, tu ti sposti di lato e il riquadro occupa l'altra metà. I **sottotitoli** ci sono sempre, con le parole chiave in arancio.
5. Dai l'ok alla tabella. Claude costruisce il video, lo controlla e lo apre nello Studio per i ritocchi, poi lo esporta.

Il tuo video originale resta sul Mac: non va su GitHub.

## L'app HyperFrames (facoltativa)
HyperFrames ha anche un'app per Mac: https://hyperframes.dev/studio. Mostra il video accanto a una chat. Puoi **cerchiare** un punto del video o lasciare un **commento** in un momento preciso ("questo arriva tardi") e Claude lo corregge. Si entra con un account HeyGen gratuito. Per collegarla a Claude scegli **Claude Code** quando te lo chiede.
Per aprire lì un film fatto qui, chiedi a Claude "aprilo nell'app": lancia `npx hyperframes open` e la conversazione continua nell'app. Quando torni qui, Claude vede cosa hai cambiato.

## Ritocchi
- **A mano, nello Studio:** clicchi un elemento e lo cambi (testo, colore, posizione), oppure sposti i rombi sulla timeline per cambiare i tempi. Poi esporti con il pulsante di render.
- **Chiedendoli a Claude:** indica i secondi. *"A 6 s il testo arriva tardi, anticipalo di un battito"* funziona molto meglio di *"rendilo più bello"*.

## Dove sta cosa
| Cartella | Cosa c'è |
|---|---|
| `assets/brand/` | loghi, font, musica. Si usano solo questi. |
| `assets/screenshots/` | schermate vere di Cato |
| `films/<nome-video>/` | **tutto di un film, in una cartella sola** (vedi sotto) |
| `modelli/` | i punti di partenza riutilizzabili, per esempio `video-parlato/` |
| `tests/` | le prove tecniche del setup, da non toccare |
| `CLAUDE.md`, `brand.md` | le regole che Claude segue sempre |

### Dentro la cartella di un film
| Cartella | Cosa c'è |
|---|---|
| `LEGGIMI.md` | cos'è il film, quali sono i video finali, come si riapre |
| `video/` | **i video finiti** (16x9, 9x16). Le versioni vecchie stanno in `video/versioni-precedenti/` |
| `progetto/` | il progetto HyperFrames: si apre nello Studio per i ritocchi |
| `claude-design/` | lo zip e i file arrivati da Claude Design, se il film è partito da lì |

I video e lo zip restano sul tuo Mac: GitHub non li carica perché sono pesanti. Per l'archivio comune mettili su Drive.

