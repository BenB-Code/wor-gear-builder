# Analyse visual / brand design — WoR Gear Builder (cycle 3)

**Angle : direction artistique & craft.** Jugé sur 9 captures (dark, light, mobile, dialog, testeur, sets, référence) + CSS lignes 15-560.

## Diagnostic d'ensemble

L'app a un *vocabulaire* (Palatino small-caps, or, ◆, mono pour la donnée) mais pas de *grammaire* : chaque élément est correct isolément, aucun ne se subordonne aux autres. Tout est éclairé pareil, bordé pareil, espacé presque-pareil (7, 9, 10, 11, 12, 14 px…). Résultat : un outil sombre compétent et anonyme. Un screenshot du Testeur parmi dix outils dark ne serait pas reconnu — sauf, paradoxalement, le mode clair parchemin, qui est aujourd'hui la chose la plus identitaire de l'app.

**Thèse : assumer une DA « grimoire d'armurerie » — une seule lumière (venue du haut), l'or traité comme une dorure (rare, chaud, réservé aux moments qui comptent), le ◆ codifié en 3 usages canoniques, et le mono rétrogradé au rang de « chiffre de jeu ». Zéro ajout de contenu : on redistribue la lumière, on ne charge pas.**

---

## P0 — fondations (résout « incohérent » + « hiérarchie inversée »)

### 1. P0 · Il n'y a pas de grille verticale — instaurer un pas de 8
Les marges sont au pifomètre : `.rule{margin:9px}`, `.row-head{padding:11px 14px}`, `.panel{margin:14px}`, `h3.grp-head{margin:26px 0 10px}`. L'œil sent ces différences d'1-3 px comme du flou, pas comme du rythme. Spec : tout aligner sur les tokens existants `--s-2/3/4/5` (8/12/16/24) et les *utiliser* (ils sont déclarés ligne 24 puis ignorés partout). Rythme cible : 24 entre sections, 12 entre cartes sœurs, 8 en intra-carte. C'est la correction la moins spectaculaire et la plus rentable du lot.

### 2. P0 · Encarts indiscernables : créer 3 niveaux de matière, pas un
Aujourd'hui panel, cov-card, stat-card, rule, tm-step partagent le même traitement (fond +1 cran, `--hairline` à 5 % invisible). Spec à 3 couches :
- **Socle** (fond de page) : assombrir `--bg` à `#0f0d15` — le dark actuel (#14121a) est trop proche des panels, d'où la « hiérarchie inversée » ressentie ;
- **Carte** (rule, piece, cov-card) : `background:linear-gradient(180deg,#211d2b,#1c1926)` + `box-shadow:inset 0 1px 0 rgba(255,255,255,.045), 0 1px 2px rgba(0,0,0,.3)` — le liseré interne haut = lumière zénithale, signature immédiate ;
- **Encart éditorial** (note, verdict) : garde le filet gauche 3px mais passe le fond en `--acc-glow` pleine largeur. Trois matières, lisibles sans légende.

### 3. P0 · Les pastilles rondes ●●●● deviennent des ◆ — le geste signature à coût nul
`.dot{border-radius:50%}` : des ronds génériques pour noter la force d'une règle, alors que la marque EST un losange. Spec : remplacer par un ◆ en pseudo-élément (`content:"◆"`, plein/creux via couleur vs `--border`), 10px, même grille. Chaque ligne de règle porte alors la marque — c'est LE détail qu'un utilisateur retiendra d'un screenshot. Étendre au checkbox coché : `content:"◆"` au lieu de "✓".

### 4. P0 · Codifier le ◆ : 3 usages canoniques, pas plus
Actuellement : brand (18px or) + puces de listes (7px et 9px, deux tailles !) — sous-exploité ET incohérent. Canon proposé : **(a)** identité — brand + fin des filets de section (`grp-head::after` : le dégradé se termine par un ◆ 6px `--faint`) ; **(b)** métrique — les jauges du point 3 ; **(c)** ponctuation — puces `ul.clean` à une seule taille (8px, or). Supprimer le ◆ des `.hint li` (7px faint : bruit). Trois rôles nets > dissémination.

### 5. P0 · Typo : le mono a pris le pouvoir, le rétrograder
Le reproche « polices trop éloignées » vient de là : mono partout (compteurs, th de tables, labels ACCENT/LANGUE, verdicts, boutons copier, badges), il est devenu une 2e police de labeur qui frotte contre les small-caps. Règle stricte : **display small-caps = titres, nav, clés de formulaire** ; **mono = valeurs issues du jeu uniquement** (stats ATK/HP, IDs G1-D5, clé in-game, gros chiffres) ; **sans = tout le reste**, y compris `th` (passer les en-têtes de table en sans 11px, letterspacing .04em — le mono uppercase en th est le plus gros point de friction). Trois familles, trois rôles étanches : la « cacophonie » disparaît sans retirer une police.

### 6. P0 · Les 5 accents percutent la sémantique des tiers — c'est le vrai problème
Vert/bleu/violet/rouge ≈ exactement t4/t0/t1/t3 (lignes 20 et 49-52). En accent violet, un onglet actif devient illisible face à un badge T1 ; l'or, lui, se confond avec T2. Verdict : **la personnalisation d'accent dilue l'identité ET casse le code couleur métier**. Spec : l'or reste non-négociable sur les zones de marque (brand, CTA primaire, progression 18/18) ; l'accent choisi ne pilote que les états de sélection (tabs, chips actives, focus). Si on peut trancher plus fort : décaler les 4 accents alternatifs hors des teintes de tier (sarcelle #4fb8a8, acier #7d96c9, mauve gris #a08cc0, cuivre #c97f5a) — un choix de teinte, pas un déguisement.

---

## P1 — moments signature (résout « pas appealing »)

### 7. P1 · Le verdict « Gardée par » mérite une cérémonie
C'est LE moment de l'app (lotE-manual) : aujourd'hui un panel à filet vert. Spec : bandeau pleine largeur `background:linear-gradient(90deg,rgba(111,191,143,.14),transparent 60%)`, ◆ vert 14px devant le titre (au lieu du ✓ système), titre display `--fs-4`, les règles gagnantes en cartes cliquables (pas en liste à puces). Symétrique rouge pour « Recyclée ». Le testeur devient un oracle qui rend un jugement, pas un log.

### 8. P1 · Le 18/18 : la seule récompense de l'app, aujourd'hui une barre de 5px
« Saisie en jeu 0/18 » est l'objectif final de l'utilisateur et vit en pied de sidebar. Spec : à 100 %, la barre passe `background:linear-gradient(90deg,var(--acc),#f0d08a)` + `box-shadow:0 0 12px var(--acc-dim)` et le libellé devient « ◆ Jeu complet ». Un seul état lumineux dans toute l'app = il devient précieux. Coût : 4 lignes CSS + une classe.

### 9. P1 · Les 4 stat-cards du Testeur : hiérarchiser le chiffre-santé
« 0 règles qui ne gardent rien » est le signal vital, traité comme les 3 autres. Spec : cette carte porte l'état (`border-color` et chiffre en `--util` si 0, `--off` sinon) ; les gros chiffres passent en `--fs-5` display + libellé sans (pas mono uppercase). Quatre cartes égales = aucune ne parle ; une carte qui change de couleur = un tableau de bord.

### 10. P1 · L'écran vide et le dialogue : deux scènes sans décor
L'empty state est une boîte pointillée muette ; le dialogue « Nouvelle règle » un panel plat au titre timide. Spec empty : ◆ 64px en `--border` (filaire, opacité .5) centré au-dessus du texte — un blason en attente. Spec dialogue : titre display `--fs-5` précédé d'un ◆ or, sections (Rôles/Sets/Mains/Subs) séparées par de vraies hairlines plutôt que des labels flottants, CTA « Créer la règle » min-height 40px. La création d'une règle est un acte fondateur, le dialogue doit le dire.

### 11. P1 · Une seule source de lumière : intensifier le halo, ajouter le vignettage
Le radial-gradient de `main#view` à 5 % d'alpha est indétectable à l'écran. Spec : monter `--acc-glow` à `rgba(226,176,74,.09)` et doubler d'un vignettage bas `linear-gradient(180deg,transparent 70%,rgba(0,0,0,.25))` sur le même `background-image`. Combiné au liseré interne des cartes (point 2), toute l'app devient éclairée par le haut — une cohérence de matière que l'œil lit sans la nommer. Zéro asset, deux dégradés.

---

## P2 — finitions

### 12. P2 · Mode clair : il a une direction (parchemin) — l'assumer jusqu'au bout
Le light n'est PAS un dark inversé : #f4f1e8 / crème est un vrai choix manuscrit, plus identitaire que le dark actuel. Mais il garde les ombres et la structure du dark. Spec : ombres teintées encre déjà présentes (bien), ajouter le liseré interne en `rgba(255,255,255,.6)`, foncer d'un cran les chips de sets (les pastels actuels s'évaporent sur crème, cf. lotD-light). Et voler son idée au dark : le dark doit devenir « bibliothèque de nuit » du même monde, pas un dashboard générique.

### 13. P2 · Deux grammaires de chips qui se marchent dessus
`.chip` (rect 6px, mono, fond panel2) et `.fchip` (pill, mono, transparent) cohabitent dans les mêmes écrans sans logique perceptible — ça participe aux « encarts indiscernables ». Règle : **pill = interactif/filtre** (fchip, tier-badge, seg), **rect = valeur de donnée** (stats, sets, IDs). Auditer les usages croisés (le `.ruleref` est un bouton en forme de donnée : le passer pill).

### 14. P2 · Sidebar : le poids visuel est inversé
Trois boutons utilitaires pleine largeur (Importer / Mode clair / Densité) pèsent plus lourd que la navigation elle-même. Spec : les passer en liens texte `--fs-1` avec icône, groupés sous le disclosure « Apparence » déjà existant ; la brand gagne 6px d'air en dessous (`padding-bottom:20px`) et un filet or 1px sous le bloc. La nav respire, l'or de la brand redevient le premier or vu à l'écran.

### 15. P2 · Grain optionnel — la seule « texture » admissible
Si on veut de la matière au-delà de la lumière : un bruit feTurbulence en SVG data-URI (embarqué, pas une ressource externe) à `opacity:.02` sur `body::before`, `pointer-events:none`. À tester : au moindre doute de moiré ou de coût de peinture, on s'en passe — les points 2 et 11 suffisent à tuer le « tout plat ».

---

## Ce que ça donne
Un utilisateur reconnaîtra l'app à : la lumière zénithale sur cartes sombres, les jauges en losanges, l'or-dorure qui ne s'allume que pour la marque, la sélection et l'accomplissement, et les small-caps Palatino qui titrent chaque scène. Rien n'a été ajouté — tout a été mis à sa place.
