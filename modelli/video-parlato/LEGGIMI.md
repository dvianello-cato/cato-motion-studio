# Modello: video parlato

Il punto di partenza di ogni film fatto con `/video-parlato`: una persona che parla, intera sotto, con sottotitoli e riquadri Cato sopra. Provato il 2026-10-26 con HyperFrames 0.8.202, in 16:9 e 9:16.

## Come si usa
Si copia in `films/<nome>/progetto/`, si mette il video in `assets/parlato.mp4`, si trascrive in `assets/transcript.json`, si scrive `piano.json` e si lancia `node tools/costruisci.mjs`. La procedura completa è nella skill `/video-parlato`.

## piano.json
```json
{
  "titolo": "Come trovi 200 gare in un minuto",
  "formato": "16x9",
  "video": "assets/parlato.mp4",
  "durata": 19.866,
  "parolePerGruppo": 4,
  "correzioni": { "Dicato": "di Cato", "Prova alla gratisugetcato.com": "Provala gratis su get-cato.com" },
  "evidenzia": ["Cato"],
  "musica": { "src": "assets/brand/audio/cato-music.wav", "volume": 0.14 },
  "carte": [
    { "tipo": "nome", "inizio": 0.3, "durata": 2.6, "nome": "Diego Vianello", "ruolo": "Designer, Cato" },
    { "tipo": "numero", "inizio": 3.0, "durata": 3.3, "valore": 200000, "prefisso": "", "suffisso": "+", "etichetta": "gare d'appalto ogni anno in Italia" },
    { "tipo": "frase", "inizio": 6.4, "durata": 2.6, "testo": "Trovarle a mano richiede ore.", "evidenzia": "ore." },
    { "tipo": "schermata", "inizio": 9.4, "durata": 3.6, "immagine": "assets/screenshots/ricerca.png", "titolo": "Ricerca gare" },
    { "tipo": "chiusura", "inizio": 16.2, "durata": 3.66, "testo": "Provala gratis.", "url": "get-cato.com" }
  ]
}
```
- `durata`: i secondi del video, da `ffprobe`. Nessun riquadro può finire dopo.
- `formato`: `"16x9"` o `"9x16"`. Il video deve avere già quel formato.
- `correzioni`: parola sbagliata → parola giusta, anche su più parole di fila. Si applicano solo ai sottotitoli.
- `evidenzia`: le parole dei sottotitoli in arancio. Le cifre sono sempre in arancio.
- `musica`: facoltativa. Senza, si sente solo la voce.
- `sottotitoli: false` li toglie.
- `zoom`: facoltativo, `[{ "inizio": 4.4, "durata": 1.2, "scala": 1.12 }]`. Avvicina la persona in un momento forte (entra in 0,25 s, esce in 0,4 s). Viene ignorato mentre la persona è di lato o sotto la chiusura.

## I riquadri
| Tipo | Cosa fa | Dove sta |
|---|---|---|
| `nome` | nome e ruolo su una scheda chiara con la barra arancio | in basso a sinistra, sopra i sottotitoli |
| `numero` | la cifra conta da 0 al valore, con un'etichetta sotto | pannello: la persona si sposta di lato |
| `frase` | una frase chiave, una parola in arancio | pannello |
| `schermata` | una schermata vera di Cato che si avvicina piano, con un titolo | pannello |
| `chiusura` | logo bianco, invito e indirizzo su fondo navy | tutto lo schermo, la voce continua |

**Pannello.** Nel 16:9 la persona va nella metà sinistra e il pannello (sfondo chiaro con la griglia del sito) occupa la metà destra. Nel 9:16 la persona scende nella metà bassa e il pannello sta sopra. Funziona bene se la persona è più o meno al centro dell'inquadratura. Pannelli a meno di 1,4 s l'uno dall'altro tengono la persona di lato senza farla tornare.

**Sottotitoli.** Da 2 a 4 parole (`parolePerGruppo`), con uno spezzone a ogni punto e a ogni pausa. Testo bianco su un riquadro navy semitrasparente grande quanto il testo. Stanno sotto la persona e si spostano con lei, e spariscono sotto la chiusura.

## Misure
Le posizioni vengono da `overlays.md` e `captions.md` di HyperFrames, adattate al brand (Manrope, navy, un solo accento). Testi principali da 88 px in su nel 16:9. Nome, ruolo ed etichette sono più piccoli (44–64 px): in un video parlato accompagnano la voce, non la sostituiscono. Tutte le misure stanno in cima a `tools/costruisci.mjs`, nell'oggetto `F`.

## Cosa non fa (ancora)
- Testo dietro la persona (la scritta grande tra lo sfondo e la testa): si può fare con `npx hyperframes remove-background` (vedi `captions.md` di HyperFrames), ma non è nel generatore. Va costruito a mano.
- Tagli, zoom e cambi di inquadratura sul video: il video resta com'è.
- Un video con più riprese montate: viene trattato come un unico pezzo.
