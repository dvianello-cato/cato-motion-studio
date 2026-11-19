// Le molle di casa Cato (brand.md), risolte in forma chiusa: deterministiche, uguali in anteprima e nel render.
// Le quattro molle di casa (vedi brand.md, "Movimento").
(function () {
  const SPR = { snappy: { k: 520, c: 34, m: 1 }, default: { k: 260, c: 28, m: 1 }, heavy: { k: 140, c: 26, m: 1.2 } };
  function osc(p, t, d0, v0) {
    if (t <= 0) return d0;
    const w = Math.sqrt(p.k / p.m), z = p.c / (2 * Math.sqrt(p.k * p.m));
    if (Math.abs(z - 1) < 0.02) return Math.exp(-w * t) * (d0 + (v0 + w * d0) * t);
    if (z < 1) { const wd = w * Math.sqrt(1 - z * z); return Math.exp(-z * w * t) * (d0 * Math.cos(wd * t) + ((v0 + z * w * d0) / wd) * Math.sin(wd * t)); }
    const s = Math.sqrt(z * z - 1), r1 = -w * (z - s), r2 = -w * (z + s), B = (v0 - r1 * d0) / (r2 - r1), A = d0 - B;
    return A * Math.exp(r1 * t) + B * Math.exp(r2 * t);
  }
  const sp = (n, t) => (t <= 0 ? 0 : 1 - osc(SPR[n], t, 1, 0));
  const settle = (n, D) => (p) => sp(n, p * D) + p * (1 - sp(n, D));
  gsap.registerEase("spring-snappy", settle("snappy", 0.8));   // comparse, impatti
  gsap.registerEase("spring-default", settle("default", 1.2)); // spostamenti, uscite
  gsap.registerEase("spring-heavy", settle("heavy", 1.5));     // logo, entrate dei testi
})();
