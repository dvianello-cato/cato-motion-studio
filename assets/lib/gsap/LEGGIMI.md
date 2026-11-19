# GSAP 3.15.1 e i suoi plugin

Copie locali di GSAP, il motore di animazione dei film, e dei suoi plugin. Sono gratuiti anche per uso commerciale (licenza standard: https://gsap.com/standard-license). Stanno qui, e non si caricano da internet, perché ogni film usi sempre la stessa versione e si possa esportare anche offline.

| File | A cosa serve |
|---|---|
| `gsap.min.js` | il motore: si carica sempre per primo |
| `SplitText.min.js` | testo che entra lettera per lettera, parola per parola o riga per riga |
| `DrawSVGPlugin.min.js` | linee e percorsi che si disegnano (connettori, sottolineature, frecce) |
| `MorphSVGPlugin.min.js` | una forma che si trasforma in un'altra (un'icona che diventa il simbolo di Cato) |
| `MotionPathPlugin.min.js` | un oggetto che viaggia lungo una curva |
| `CustomEase.min.js`, `CustomBounce.min.js`, `CustomWiggle.min.js` | curve di movimento su misura, rimbalzi, vibrazioni |
| `Physics2DPlugin.min.js` | lanci con gravità e attrito |
| `Flip.min.js` | un elemento che passa da una posizione o dimensione all'altra in modo fluido |

Si copiano nel film con `cp -R assets/lib films/<nome>/progetto/assets/` e si caricano così:
```html
<script src="assets/lib/gsap/gsap.min.js"></script>
<script src="assets/lib/gsap/SplitText.min.js"></script>
<script> gsap.registerPlugin(SplitText); </script>
```

Per aggiornarli: riscarica gli stessi file da `https://cdn.jsdelivr.net/npm/gsap@<versione>/dist/<file>` e cambia la versione in questo file.
