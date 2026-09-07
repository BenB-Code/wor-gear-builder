# Analyse interaction & motion — WoR Gear Builder (cycle 2)

Angle : gestes, feedback, transitions, états, continuité perçue. Base : 9 captures + CSS lignes 15-560.
Existant recensé : `flash` 1.6s (ring accent), `pop` .18s (dialog), `tin` .2s (toast), chevrons `.15-.2s`, drag (`opacity .45` + liserés drop), `prog-bar width .3s`, drawer mobile `.22s`, kill-switch `prefers-reduced-motion` global (`*{transition:none!important;animation:none!important}`).

---

## P0 — le cœur de la boucle d'usage

### 1. Cocher une règle : l'action n°1 n'a aucun feedback là où elle se joue (mobile)
La boucle réelle est jeu ↔ téléphone : je saisis la règle en jeu, je la coche dans l'app. Or le seul écho de la coche est la barre « Saisie en jeu » — dans la sidebar, **cachée derrière le burger sur mobile**. Résultat : un tap → un ✓ apparaît instantanément (`transition:all .15s` sur la box, rien sur le glyphe), et c'est tout.
**Spec** : (a) pop du ✓ : `scale .6→1`, 180ms, `cubic-bezier(.34,1.56,.64,1)` ; (b) la ligne cochée s'atténue (`opacity .55` + nom barré léger) en 200ms `ease-out` pour matérialiser « fait » ; (c) un compteur flottant transitoire `12/18` (pill fixe bas d'écran, 1.2s puis fade) sur mobile. Reduced-motion : garder (b) et (c) sans animation — le *changement d'état visuel* doit survivre, pas le mouvement.

### 2. Accordéons : `display:none → block`, le layout saute à chaque ouverture
`.row-body`, `.p-body`, `.tm-step .step-body`, tous les `details` : bascule brute. Ouvrir G1 pousse G2-G10 de ~260px en 0ms ; sur mobile en plein alternat jeu/app, on perd sa ligne. C'est le plus gros défaut de continuité de l'app, invisible sur capture statique.
**Spec** : `grid-template-rows: 0fr→1fr` sur un wrapper (`transition: grid-template-rows 200ms ease-out`) — pas de JS de mesure, pas de `max-height` magique. Chevron déjà animé : aligner sa durée (200ms). Reduced-motion : bascule instantanée (comportement actuel, acceptable).

### 3. « Générer » 2000 pièces : aucun état de chargement, aucune arrivée
Rien dans le CSS ne prévoit un état pending (pas de skeleton, pas de spinner, pas de `.btn[aria-busy]`). Un rendu synchrone de 2000 cartes = gel perceptible + apparition en bloc + scroll qui saute. Le bouton primaire le plus « lourd » de l'app est muet.
**Spec** : bouton → état busy (label « Génération… », opacity .7, spinner 14px) ; rendu par tranches (`requestAnimationFrame`, 200 cartes/frame) ; le bandeau Résultat (`48 gardées / 2000 — 2,4 %`) apparaît en premier avec un léger `tin` (translateY 6px, 160ms) ; cartes en fade simple 120ms **sans stagger** (2000 items staggerés = surcharge). Reduced-motion : tranches conservées (perf, pas motion), fades supprimés.

### 4. Drag & drop : inutilisable au doigt, et sans résolution visuelle
HTML5 DnD (`.dragging`, `.drop-before/after`) ne fonctionne pas au touch — sur téléphone, le réordonnancement est donc **mort**, dans une app pensée mobile-first d'usage. Et au drop desktop, la ligne se téléporte : les liserés 3px disparaissent, aucun settle.
**Spec** : mobile → boutons ↑/↓ au long-press ou poignée à 44px avec pointer events ; desktop → FLIP au drop (translateY inverse puis `transform 220ms cubic-bezier(.2,0,0,1)`) + `flash` court (600ms, pas 1.6s) sur la ligne posée. Reduced-motion : pas de FLIP, flash remplacé par un fond `--acc-dim` 1s.

---

## P1 — feedback et états

### 5. Le clic-cycle des subs (hors→liste→★) est le geste le plus opaque de l'app
Trois états au même endroit, zéro affordance de cycle : rien n'indique qu'un 2e clic donne ★ ni qu'un 3e éteint. Pire : l'ajout du glyphe ★ **élargit la chip** → toute la rangée se décale au clic (reflow latéral), le doigt perd sa cible en plein triple-tap.
**Spec** : réserver l'espace du ★ (`::before` de largeur fixe, opacity 0→1 120ms) — plus aucun shift ; micro-pulse au changement d'état (`scale 1→1.06→1`, 150ms) ; au premier cycle de la session, un hint transitoire « clic : liste → ★ requis → retiré » (toast discret, une seule fois). Reduced-motion : pulse off, réservation d'espace conservée (c'est du layout, pas du motion).

### 6. Aucun état `:active` nulle part : l'app ne « répond » pas sous le doigt
Tout le CSS gère `:hover` et `:focus-visible` (excellent), mais pas un seul `:active`. Sur mobile, hover n'existe pas : entre le tap et le résultat, il n'y a **rien**. C'est la cause principale du feel « inerte » sans rien coûter en charge visuelle.
**Spec** : global `.btn:active,.fchip:active,.chip.pick:active,.seg button:active,.tab-btn:active{transform:scale(.97);transition-duration:60ms}` ; retour 120ms `ease-out`. Reduced-motion : remplacer par `filter:brightness(.92)` (changement instantané, pas de mouvement).

### 7. `transition:all .15s` partout : easing par défaut, propriétés non maîtrisées
`.tab-btn`, `.btn`, `.fchip`, `.chk`, `.help`, `.ruleref` : `all` anime aussi padding/border au reflow et donne ce micro-flou générique. Une app avec une identité typographique aussi affirmée mérite une signature de mouvement.
**Spec** : tokens `--ease-out:cubic-bezier(.2,0,0,1)`, `--dur-1:120ms`, `--dur-2:200ms` ; transitions énumérées (`color,background-color,border-color,box-shadow`) ; jamais `all`. Coût : une passe de refactor, zéro pixel de plus à l'écran.

### 8. Import / vérif de pièce : le verdict arrive sous la ligne de flottaison
En « Pièce manuelle », le panneau « ✓ Gardée par » se construit **sous** les sélecteurs : au dernier tap (set), le résultat apparaît hors viewport mobile — il faut scroller pour savoir. Le moment de vérité de tout le testeur n'est pas vu.
**Spec** : verdict en bandeau sticky (bas de viewport mobile, `position:sticky;bottom:0`), qui se met à jour en place : swap contenu par cross-fade 140ms + tint de fond vert/rouge 400ms (`--util`/`--off` à 12 %). Reduced-motion : swap sec, tint conservé.

### 9. Import JSON / copier la clé : succès muet ou toast générique
« copier » n'a pas d'état de confirmation local (le toast bas-droite est loin du geste, angle mort mobile). L'import remplace des règles sans montrer *ce qui a changé*.
**Spec** : « copier » → le bouton lui-même devient « copié ✓ » 1.2s (swap texte, pas de toast) ; import → `flash` (réduit à 600ms) sur chaque règle ajoutée + résumé toast « 12 règles importées · onglet Démo ». Le pattern flash existe déjà : s'en servir comme signature d'arrivée de contenu, partout (création, duplication, import).

### 10. Changement de vue : coupe sèche + risque de scroll hérité
Un seul scroller (`main#view`) pour 4 vues : au switch, aucun raccord (pas de fade) et le scroll de la vue précédente peut se retrouver appliqué à la nouvelle (arrivée mi-page). La navigation, geste le plus fréquent après la coche, est la moins soignée.
**Spec** : mémoriser le scroll par vue (restitution instantanée) ; entrée de vue en fade+rise 4px, 140ms `ease-out`, sur le conteneur seulement. Pas de slide directionnel (les 4 vues ne sont pas ordonnées). Reduced-motion : fade off, restitution scroll conservée.

---

## P2 — le supplément d'âme (sans surcharge)

### 11. Reduced-motion : le kill-switch global détruit aussi le *feedback*
`*{animation:none!important}` supprime `flash` : un utilisateur reduced-motion qui importe/duplique ne voit **plus aucune confirmation**. Reduced-motion ≠ reduced-feedback.
**Spec** : doubler chaque animation de mouvement d'un état statique équivalent sous media query (fond `--acc-dim` temporisé via JS `setTimeout` + classe, ou `transition:background-color` seule, autorisée). Règle d'équipe : toute anim porteuse de sens a sa variante immobile.

### 12. Les steppers (Requis, Niveau) : cibles 24px et valeur muette
`.stepper button{width:24px;height:24px}` non repassé à 40px par la media query mobile (contrairement à `.btn`). Et la valeur change sans tick — sur un réglage aussi conséquent (« requis > liste — injouable »), le lien cause-effet est faible.
**Spec** : mobile `min-width:36px;min-height:36px` ; au clic, la valeur pulse (`scale 1.15→1`, 120ms) ; le message « injouable » apparaît en fade 120ms **avec hauteur réservée** (`min-height` fixe) pour ne pas pousser les boutons Créer/Annuler au moment où on va les taper.

### 13. Les gros chiffres du Testeur peuvent respirer une fois, pas plus
`172 410 / 1 767 / 86 / 0` : un count-up court (300ms, `ease-out`, uniquement au premier calcul ou changement d'onglet) donne le « moment de résultat » d'une app de jeu. Au-delà (recalculs successifs), swap sec — l'outil reste un instrument, pas un slot machine. Le `0` de « règles qui ne gardent rien » mérite l'inverse : s'il devient > 0, tint `--off` 400ms, c'est une alerte, pas une célébration. Reduced-motion : valeurs sèches, tint conservé.

### 14. La barre « Saisie en jeu » : un fil narratif sous-exploité
Elle anime déjà sa largeur (.3s). À 18/18, rien ne se passe — la fin de LA tâche de l'app est un non-événement.
**Spec** : à 100 %, la barre passe `--util` (400ms) + toast « Jeu de règles saisi ✓ » ; le pattern reste unique (une seule célébration dans toute l'app, à l'endroit qui la mérite). Coût quasi nul, sens maximal.

---

## Thèse
L'app a déjà un vocabulaire de mouvement (flash, pop, tin) mais il est **décoratif là où il devrait être fonctionnel** : les moments qui portent la boucle d'usage (cocher, générer, verdict, réordonner au doigt) sont muets ou cassants, pendant que des transitions génériques (`all .15s`) tournent partout. La priorité n'est pas d'ajouter de la vie, c'est de **déplacer le feedback vers les 4 gestes qui comptent**, de supprimer les sauts de layout (accordéons, chip ★, message injouable), et de normaliser une signature (2 durées, 1 easing, flash = « contenu arrivé »). Une app de jeu plus vivante sans être plus chargée : oui — en animant les *conséquences* (état qui change) et jamais les *décors*.
