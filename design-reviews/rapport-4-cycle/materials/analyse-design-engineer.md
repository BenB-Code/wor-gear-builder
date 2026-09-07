# Analyse — Design engineer (cycle 4) : là où le rendu trahit l'intention

Angle : exécution du design dans le code. Fichier audité : `wor-regles-tri.html` (CSS l.15–560, templates l.1440–2060, routeur l.2352–2418, listeners l.3040–3105). Constats tranchés, avec code exact.

---

## P0 — Les trahisons visibles

### 1. `color-scheme` absent : la scrollbar native blanche poignarde le dark mode
Visible sur TOUTES les captures dark : une scrollbar claire système sur le bord droit, plus les `<select>` (Onglet, Niveau, Pièces) qui ouvrent des popups clairs. Une ligne corrige tout :
```css
:root{color-scheme:dark}  body.light{color-scheme:light}
```
C'est le bug « cheap » n°1 : zéro effort, énorme gain de cohérence perçue. À faire avant tout le reste.

### 2. `rerenderRule()` détruit le bouton qu'on vient de cliquer → focus clavier perdu
`el.outerHTML = ruleRow(r)` (l.1653) : toggle d'une sub, +/− du stepper, chip de rôle — chaque interaction régénère la carte entière et le focus retombe sur `<body>`. Un utilisateur clavier ne peut PAS incrémenter « Requis » deux fois avec Entrée. Pattern minimal de restauration :
```js
function rerenderRule(id){
  const a=document.activeElement, sel=a?.dataset.stat?`[data-rule="${id}"][data-stat="${a.dataset.stat}"]`
        :a?.classList.contains("st-plus")?`.st-plus[data-rule="${id}"]`:null;
  /* ...outerHTML... */
  if(sel) document.querySelector(sel)?.focus();
}
```
Idéalement : pour un toggle de chip, ne pas re-render — patcher classe + `aria-pressed` + le `.val` du stepper en place. Le HTML est déjà déterministe, c'est 10 lignes.

### 3. `renderView()` : `scrollTop=0` + `scroll-behavior:smooth` = navigation qui « glisse » au lieu de changer de page
`main#view{scroll-behavior:smooth}` (l.101) s'applique aussi au `main.scrollTop=0` du routeur (l.2359) : chaque changement de vue ANIME le retour en haut — sensation d'app qui rame. Pire : changer d'onglet dans le Testeur (`ts-tab`, l.3058) passe par `renderView()` et remet le scroll à zéro alors qu'on n'a pas changé de vue. Fix : `main.scrollTo({top:0,behavior:"instant"})`, et garder smooth uniquement dans le `scrollIntoView({behavior:"smooth"})` explicite.

### 4. Le dialogue « Nouvelle règle » n'est pas un `<dialog>` : pas de focus trap
`.overlay` est un div + `hidden` (l.424) : Tab s'échappe dans la page floutée derrière (capture audit-dialog : le fond reste tabbable), Échap est géré à la main, le scroll du fond n'est pas verrouillé. `<dialog>` + `showModal()` donne trap, `inert` du fond, Échap et `::backdrop` gratuits — zéro dépendance, support universel. Le blur du backdrop migre tel quel sur `::backdrop`.

---

## P1 — La cohérence typographique et chromatique

### 5. Deux grammaires de labels concurrentes — c'est ÇA l'« incohérence des polices » du client
Les micro-labels utilisent tantôt `--display` + `font-variant:small-caps` (`.lab`, `.rb-grid .k`, `.p-slot`), tantôt `--mono` + `text-transform:uppercase` (`th`, `.cov-card .lbl`). Sur la même vue Testeur : « Onglet/Mode » en Palatino small-caps, « RÈGLE / PIÈCES GARDÉES » en mono uppercase. Trancher : **une seule** grammaire de label technique (mono uppercase, déjà la plus lisible à 11px), et réserver le serif small-caps aux titres ≥ 15px (h2, h4, nav, noms de règles).

### 6. Small-caps synthétiques à 11–13px : rendu boueux garanti
`font-variant:small-caps` sur Palatino Linotype : le navigateur SYNTHÉTISE (capitales réduites ~80%) car la feature `smcp` n'est pas exploitée sur la stack fallback. À `--fs-2` (13px), les pseudo-petites-capitales font ~9px de haut avec des fûts amaigris par l'anti-aliasing sur fond sombre — exactement le rendu « cheap » des labels `.lab`. Là où le serif reste (titres), forcer l'honnêteté : `font-variant-caps:small-caps; font-synthesis:none` révèle qu'il n'y a pas de vraies small caps → assumer `text-transform:uppercase` + `letter-spacing:.08em` + taille réduite pour les labels, et garder les small-caps synthétiques uniquement ≥ 15px où la synthèse tient.

### 7. `color-mix()` : tuer la jungle des ~40 rgba() dupliqués dark/light
`.chip.set.t3{border-color:rgba(224,99,90,.55);color:#ef948c}` + son override light + `.tier-badge.b3` + `.chip.ess.off`… Chaque teinte existe en 3–5 variantes codées en dur, et la moitié seulement a un override light (t2/t4 comptent sur la var, t3/t1/t0 sont redéfinis — l.42–44) : incohérence structurelle. Remplacer par dérivation :
```css
.chip.set.t3{--c:var(--t3)}
.chip.set{border-color:color-mix(in oklab,var(--c) 55%,transparent);
  color:color-mix(in oklab,var(--c) 78%,var(--ink));
  }
.chip.pick.sel{background:color-mix(in oklab,var(--c) 14%,transparent)}
```
Support : Chrome/Edge 111+, Safari 16.2+, Firefox 113+ — acquis. ~60 lignes supprimées, thèmes et 5 accents automatiquement cohérents.

### 8. `--hairline: rgba(255,255,255,.05)` : les « encarts indiscernables » sont mesurables
`.panel`/`.rule`/`.cov-card` : bordure à 5% de blanc sur un delta de fond de ~3% de luminance (#1d1a24 sur #14121a). Le client a raison : c'est sous le seuil de discrimination sur la plupart des dalles. Grammaire d'élévation à 2 niveaux, pas plus : conteneurs de page = `--border-soft` (visible), sous-éléments internes = hairline. Et donner à `.rule` une ombre courte (`box-shadow:0 1px 0 rgba(0,0,0,.25)`) — sur fond sombre, l'ombre sépare mieux qu'une bordure.

### 9. View Transitions API : le SPA-feel pour une ligne
Le swap `main.innerHTML = viewX()` produit un cut sec. Enhancement progressif honnête :
```js
const paint=()=>renderView();
document.startViewTransition ? document.startViewTransition(paint) : paint();
```
Chrome/Edge 111+, Safari 18+ ; Firefox : fallback = comportement actuel, rien à perdre. Réserver aux changements de VUE (pas à `updateRuleList` pendant la frappe, sinon latence perçue).

### 10. `@starting-style` pour toasts et dialogue, et sortie animée
`@keyframes tin/pop` gèrent l'entrée mais la sortie du toast est un hack `.out` + setTimeout. Avec `transition-behavior:allow-discrete` + `@starting-style`, entrée ET sortie déclaratives, y compris depuis `display:none` — et `prefers-reduced-motion` déjà en place les neutralise. Support 2024 acquis sur Chromium/Safari, Firefox 129+.

### 11. Orphelins et ellipses : les 3 détails qui font « fini »
- `text-wrap:balance` sur `h2/h4/.p-sum`, `text-wrap:pretty` sur `.lede/.hint` — zéro coût, supprime les orphelins des ledes (visible sur « …tout le / reste part au recyclage »).
- `.rc-name` sans `min-width:0`/ellipsis : un nom de règle long pousse `.row-meta` à la ligne (flex-wrap) et casse l'alignement des jauges entre cartes. `flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap`.
- `.chip` hérite `line-height:1.6` du body : hauteur de chip gonflée et centrage optique faux. `line-height:1.2` sur `.chip,.mini,.fchip,.btn`.

---

## P2 — Le poli

### 12. Glyphes texte pour l'UI : `⠿ ＋ ▾ ◆ ✓` rendus par la loterie des fallbacks
Le drag-handle braille, le ＋ fullwidth (baseline décalée dans son carré 32px, visible capture lotD-regles), le ✓ du checkbox : rendu dépendant de Segoe UI Symbol/Noto. Les remplacer par les SVG inline déjà utilisés partout ailleurs (le projet a déjà son système `ICON` — l'étendre, cohérence gratuite).

### 13. Bordures 1.5px (`.chk`, `.dot`) : arrondi inégal en 125/150% Windows
À scale fractionnaire, 1.5px devient 1px d'un côté, 2px de l'autre — les 4 jauges `.dot` de la liste des règles n'ont pas toutes le même anneau. Passer à 1px + `outline` pour l'épaisseur perçue, ou SVG.

### 14. Subgrid : aligner la colonne « Rôles/Sets/Main(s)/Subs » entre cartes ouvertes
Chaque `.rb-grid` calcule sa colonne label indépendamment → léger zigzag quand plusieurs règles sont dépliées. Fix simple sans subgrid : `grid-template-columns:7ch 1fr`. Subgrid serait le fix noble mais exige de restructurer `.rule-list` en grid — pas rentable ici : container queries et subgrid sont les deux « modernités » que je NE recommande PAS sur cette base.

### 15. Print : bon squelette, deux trous
Le `#print-view` dédié est une vraie qualité (rare). Manque : `@page{margin:14mm}` sans `orphans/widows` (mettre `orphans:3;widows:3` sur `.pv-rule`), et les liens `ruleref`/couleurs d'accent en `print-color-adjust:exact` sinon les bordures or `#b58a2e` passent au gris selon le navigateur.

### 16. Perf perçue au premier paint : correcte, un seul risque
CSS inline, pas de fonts réseau, JS en fin de body : le premier paint est complet — bon. Le seul moment vide : `#view` n'a pas de contenu statique avant `route()` ; si le JS grossit (3100 lignes aujourd'hui), pré-rendre le squelette de la vue Règles dans le HTML coûterait peu. Non urgent, à garder pour la migration framework.

---

## Synthèse des priorités

| P | # | Effort | Effet |
|---|---|--------|-------|
| P0 | 1 color-scheme | 1 ligne | cohérence dark immédiate |
| P0 | 2 focus perdu re-render | ~15 lignes | clavier utilisable |
| P0 | 3 scroll reset/smooth | 3 lignes | nav qui répond |
| P0 | 4 `<dialog>` | ~30 lignes | a11y modale réelle |
| P1 | 5–6 grammaire labels | CSS only | LA plainte « polices » |
| P1 | 7 color-mix | −60 lignes | thèmes/accents fiables |
| P1 | 8 élévation | CSS only | LA plainte « encarts » |
| P1 | 9–11 VT/starting-style/text-wrap | ~10 lignes | fini perçu |
