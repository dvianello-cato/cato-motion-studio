# Prompt da incollare in Claude Design

Copia il blocco qui sotto nel primo messaggio di un **nuovo progetto** Claude Design, compila le parti tra [parentesi quadre] e allega il logo (`assets/brand/logo/cato-simbolo-navy.png`), il font (`assets/brand/fonts/Manrope-VariableFont_wght.ttf`) e gli screenshot che servono.

---

```
Costruisci questo film in formato HyperFrames. Segui la guida ufficiale per il flusso "Download ZIP":
https://raw.githubusercontent.com/heygen-com/hyperframes/main/docs/guides/claude-design-hyperframes.md
(Non il flusso "Send to HyperFrames": lo rifiniamo e lo renderizziamo dopo in Claude Code.)

IL FILM
- Cosa racconta: [la funzione di Cato e il messaggio, in una riga]
- A chi: [es. responsabili gare di imprese edili]
- Durata: [15–20] secondi, 1920×1080. Il verticale lo facciamo dopo.
- Ritmo: 120 BPM. Ogni evento importante cade su un battito (multipli di 0,5 s); i momenti forti cadono sul primo battito della battuta (0, 2, 4, 6... s).
- Testi a schermo: [frasi esatte, brevi, con il punto finale]

BRAND CATO (vince sulla guida dove la guida suggerisce altri font o colori)
- Colori e font sono quelli del sito www.get-cato.com. Il Cato UI Kit si usa solo se servono componenti dell'app, non per i colori.
- Font: Manrope, titoli 700–800, testi 500–600. Includi il file del font nello zip.
- Colori: sfondo #FDFDFA, testo #101010, testo secondario #6A717B, navy #0C213E (titoli e superfici scure), un solo accento oro-arancio #E8A33D.
- Logo: usa solo il file allegato. Screenshot: solo quelli allegati, mai interfacce inventate.

LOOK
- Vietati: titolo centrato su gradiente, tutto che appare in dissolvenza, etichette agli angoli e cornici, bagliori sull'interfaccia, particelle generiche.
- Ogni 2–4 secondi deve succedere qualcosa di nuovo. Testo mai sotto gli 88 px.
- I testi entrano da una maschera, salendo, e non con la sola dissolvenza.

CONSEGNA
- I file indicati dalla guida (index.html, preview.html, README.md, DESIGN.md) più un file "Sync points.md" con il tempo di ogni evento.
- Niente musica: la aggiungiamo in Claude Code.
```

---

Quando il film ti piace: **Share → Export → Project HTML → Download → .zip**. Poi apri Claude Code nello studio e scrivi `/spot-cato ho appena scaricato lo zip`.
