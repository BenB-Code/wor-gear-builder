# Arbitrages finaux — WoR Gear Builder

**Document de travail de l'équipe finale** (design system, charte graphique v3, maquettes, roadmap).
Synthèse-arbitrage des 4 design reviews (22 regards, sept. 2026). Toutes les décisions ci-dessous sont **fermes** :
plus aucun « à trancher » ne descend vers les livrables. Les seules réserves restantes sont listées en fin de
document (décisions client + dettes de terrain), et aucune ne bloque le démarrage.

Rappels contractuels client : refus de surcharge visible · verdicts/listes à puces = préférence explicite ·
l'or et le ◆ = identité · single-file vanilla conservé · budget dev solo.

---

## 1. La doctrine finale — 8 principes

1. **Le précieux est rare.** L'apparat (Palatino small-caps, or, ◆) vit au sommet et nulle part ailleurs :
   jamais de display sous 16 px ni sur un interactif. L'or n'a que trois allumages — marque, sélection,
   accomplissement — et n'est généreux que deux fois : le 18/18 de la recopie et la share card.
2. **La forme dit le rôle — un composant par fonction.** Un rayon, une bordure, une couleur, une fonte, un mot,
   un glyphe = un seul sens, partout. Corollaires : un seul sélecteur d'onglets, une seule grammaire de label,
   un seul système d'aide, un seul bandeau d'ouverture à la fois (slot unique, priorité import > patch > verdict).
3. **L'information vit sur l'objet qu'elle décrit ; le feedback est un état de cet objet.** La couverture vit sur
   la carte de règle, le verdict est un état de la carte d'item, la progression de saisie vit sur la règle —
   jamais de panneau qui surgit à côté.
4. **La preuve avant la configuration — mais compréhensible d'abord.** L'app démontre sa valeur (scène du
   verdict) avant d'exiger d'être comprise ; et tout chantier s'ordonne **par dépendance fonctionnelle** :
   le moteur avant la scène, la lisibilité avant l'atterrissage.
5. **Réversible plutôt que confirmé.** Toute mutation passe par la pile de commandes : Ctrl+Z global, toast =
   affichage de la tête de pile. On ne sécurise jamais un outil en le ralentissant — jamais de confirmation sur
   les gestes fréquents.
6. **Invisible au repos, jamais inapprenable.** Les accélérateurs experts (clavier, palette, sélection multiple)
   n'ajoutent rien au repos, mais chaque capacité a un chemin d'apprentissage visible : le panneau `?` et la
   palette qui affiche ses raccourcis (« la palette EST le tutoriel »).
7. **Plancher AA absolu — et l'exécution s'audite dans le rendu.** Aucun texte < 4,5:1 dans aucun thème ;
   le design system se vérifie aussi contre le navigateur (color-scheme, small-caps synthétiques interdites,
   focus préservé, contrastes non-texte discriminables).
8. **Le chrome se finance, la navigation n'est jamais animée.** Toute feature réutilise un point d'entrée
   existant ; les cérémonies sont réservées aux événements rares (import, suppression d'onglet, 18/18, share
   card) et doublées d'un état statique équivalent (reduced-motion ≠ reduced-feedback).

---

## 2. Les arbitrages tranchés

### A1 — Typographie des labels : **SANS uppercase. Figé.**

**Décision** : tous les labels d'interface et `th` en **body sans, uppercase, 11.5px/600/.08em**. Le **mono est
strictement réservé aux valeurs issues du jeu** (stats, IDs, clé in-game, chiffres tabulaires). Le display
small-caps est réservé aux titres ≥ 16 px, jamais interactif. Les small-caps synthétiques sont **interdites**
sous 16 px (défaillance mesurée par le design engineer du cycle 4).

**Pourquoi** : quatre renversements en quatre cycles (R1 sans → R2 mono → R3 sans → C4 mono), deux écoles à
égalité — on tranche par la doctrine, pas par le goût. « Mono = valeur du jeu » est le canal sémantique le plus
précieux de l'app (entériné par R2, R3 et le principe 2) : mettre aussi les labels en mono détruit ce canal.
Les labels étant tokenisés, le swap coûte une ligne si un test utilisateur futur contredit — mais la charte v3
l'écrit comme définitif et le débat est clos.

### A2 — Encodage du requis : **micro-barre + libellé texte. Le ◆ exclu.**

**Décision** : les ●●●● deviennent une **micro-barre de progression + libellé texte** (« 4/4 subs · 2 sets »),
auto-porteurs, tooltip natif toléré (« requis : 4 sur 4 »), **jamais de légende permanente**. Le ◆ plein/creux
est exclu de cet encodage.

**Pourquoi** : colline cognitive figée — aucune information portée uniquement par un glyphe de marque ; les
◆ plein/creux à 10 px sont moins discriminables que barre pleine/vide (basse vision, mobile au soleil). H6 sev 3
du cycle 4 impose l'auto-porteur ; la doctrine anti-légende du power-user interdit le bandeau. L'hybride
barre + libellé était déjà le favori des rapports 3 et 4 — on le fige.

### A3 — Navigation : **5 destinations. Tab bar basse en mobile.**

**Décision** : **Règles · Simulation · Session · Saisie en jeu · Référence**. Le mode Couverture disparaît
(fusionné dans Règles), le Testeur se réduit à Simulation, la vérification de pièce devient Session
(mobile-first), la saisie in-game sort du pied de sidebar. Mobile ≤ 920 px : **tab bar basse à 5 entrées**,
réglages dans une sheet « ⋯ », les focus modes (téléprompteur, farm) masquent la tab bar.

**Pourquoi** : le « 4 entrées contractuel » du rapport 1 comptait le chrome, pas les entrées — et le chrome net
est ici *réduit* : deux vues dissoutes (Couverture, modes du Testeur) pour deux destinations qui correspondent
au cycle vécu du joueur (construire → vérifier → recopier → farmer). Trois profils du cycle 2 ont condamné
indépendamment le pied de sidebar pour la raison d'être de l'app ; personne en quatre cycles n'a défendu le
statu quo.

### A4 — Picker d'accents : **conservé, recomposé hors des teintes de tiers.**

**Décision** : le picker reste (on ne retire pas une option choisie par des utilisateurs) mais sa palette est
**recomposée : or (défaut) · sarcelle · acier · mauve gris · cuivre**. Le rouge/rose disparaît des options.
Les 5 accents sont dérivés par `color-mix()` depuis une seule `--c` (coût de maintenance nul). Deux interdits
de charte : l'accent ne colore **jamais** un contrôle destructif ni un verdict ; il ne pilote que les états de
sélection/interaction.

**Pourquoi** : la donnée GUI-6 (cycle 2) est décisive — 4 accents sur 5 de l'ancienne palette percutaient
l'encodage des couleurs de tiers, et le cycle 3 a confirmé la collision sémantique. La recomposition hors
teintes de tiers évite le conflit **par construction**, ce qui débloque la décision sans attendre la
vérification in-game (qui reste due pour figer les teintes de tiers elles-mêmes, pas les accents).

### A5 — ✓ vs ◆ : **le ✓ reste sur toutes les coches. Entrée de charte, débat clos.**

**Décision** : le **✓ confirme les gestes** (coches, états « fait », validations) ; le **◆ décore le monde** —
trois usages codifiés : marque/brand, jalons et pips de jauges, marqueur d'onglet actif. Une seule taille de
puce ; suppression des ◆ décoratifs (`hint li`, filets de section). Tous les glyphes UI (✓ compris) migrent
sur le système SVG `ICON` existant, ce qui fige aussi leur rendu.

**Pourquoi** : deux cycles, deux contestations internes (IX au cycle 2, cognitif au cycle 3), un seul verdict —
le ✓ est l'un des rares symboles à lecture universelle instantanée. Le rapport 4 déclare « aucun nouveau débat
recevable » ; la charte v3 l'écrit.

### A6 — Priorité chantier 1 : **le moteur d'abord, la pile de commandes ensuite, la scène après.**

**Décision** : le chantier 1 est **le moteur** — lots 1-2 du cycle 4 (~4 j : `color-scheme`, scroll instant,
tooltips des dots, patch-in-place du focus, utilitaire `<dialog>`) puis **la pile de commandes** (~2 j :
Ctrl+Z/Ctrl+Shift+Z, toast = tête de pile) et le **sélecteur d'onglet unique** (~1 j, H4). La **scène du
verdict** est le chantier 3, après les fondations de peau (tokens, 5 niveaux, matières).

**Pourquoi** : la logique de dépendance du rapport 3 lui-même l'exige — construire la scène sur un rendu qui
perd le focus et un dark mode trahi, c'est « afficher plus vite un résultat toujours illisible » au niveau du
code. Les lots moteur sont chiffrés et vérifiés contre le code (~1 semaine au total), servent le novice ET
l'expert, et la pile de commandes rend toute la suite moins risquée à construire. Budget dev solo : on livre
le certain multiplicateur avant le composé.

### A7 — Palette Ctrl+K : **P1, strictement conditionnée au moteur.**

**Décision** : la palette est **actée mais P1**, livrable uniquement après focus + `<dialog>` + undo (l'ordre
du design engineer, co-signé). Périmètre initial : **navigation + commandes couvertes à 100 % par l'undo** —
aucune mutation hors filet. Affichage : mention « Ctrl+K » visible dans le header. Elle se livre **avec** le
panneau `?` (raccourcis, légende des encodages, syntaxe de recherche) : la palette affiche les mêmes commandes
avec leurs raccourcis — c'est le système d'apprentissage unifié.

**Pourquoi** : « livrer Ctrl+K aujourd'hui, c'est une cathédrale sur du sable » — argument de code accepté par
son propre promoteur au débat du cycle 4. Le conditionnement est technique, pas politique : dès que les P0 2-3
du moteur sont livrés, la palette suit.

---

## 3. Les décisions structurantes (toutes fermes)

| # | Décision | Contenu figé |
|---|----------|--------------|
| D1 | **Sélecteur global « Jeu de règles »** | Adopté. « Onglet » disparaît du lexique. Une ligne compacte sous le titre en mobile, dans le rail en desktop. C'est le « sur quoi tout ça porte » ; la nav est le « où je vais ». |
| D2 | **La carte d'item vivante = composant canonique** | Glyphe de slot, main stat en gros corps mono, subs en colonne, filet coloré au tier. Trois usages : bandeau sticky de Session (se construit tap après tap), grille de Simulation, source de la share card. Le verdict est un état de l'objet : liseré or « ✓ Gardée par G5 » / désaturation + ⚒ « Recyclée ». Convergence ×3 indépendante du cycle 2 — le composant n°1 du design system. |
| D3 | **La scène du verdict EST la vue Simulation** | Première visite : simulation échantillon auto-lancée sur le ruleset démo, rendue en scène composée — brand + ◆, UNE phrase de verdict en display, 2-3 cartes d'item, un CTA. Subs gagnants surlignés (teinte utilitaire, pas d'or), règle gagnante en pill cliquable, « ↳ Créer une règle qui garde cette pièce », bandeau-oracle en encart éditorial (◆ vert / symétrique rouge), stat-cards cliquables, « Partager ce résultat ». Visites suivantes : atterrissage contextuel (reprise de saisie si en cours, bandeau patch le cas échéant — slot unique). |
| D4 | **Recopie téléprompteur + reprise — spec touch incluse** | Destination « Saisie en jeu ». Une règle à la fois, plein écran sur socle `<dialog>`, mono dominant (le seul écran où il règne), Entrée = coché → suivante, Backspace = décocher-revenir, clé copiable, jauge 0/18, reprise (« il te reste 7 règles »). **Déclinaison touch obligatoire dès la v1** : boutons ✓ / retour en zone pouce (44 px, bas d'écran) — c'est l'écran mobile-en-jeu par excellence, trois cycles l'ont oublié, pas nous. À 18/18 : dorure + « ◆ Jeu complet » — le seul état lumineux de l'app. |
| D5 | **Hiérarchie de luminance à 5 niveaux** | `--ink-hi` / `--ink` / `--head` (#c4bcd0) / `--label` (#a59dae) / `--deco` (ex-`--faint`, jamais de texte). Textes d'état 11 px remontés AA (~#8a8298). S'y ajoutent : les **3 matières** (socle assombri / carte au liseré zénithal / encart éditorial = slot unique de la pédagogie in-situ), la grammaire d'élévation à 2 niveaux (conteneur = bordure visible, sous-élément = hairline), le pas vertical de 8. Zéro texte < 4,5:1, deux thèmes. |
| D6 | **DA « grimoire d'armurerie » — la dose exacte** | **Retenu** : liseré zénithal (une lumière venue du haut), 3 matières, dorure à 3 allumages, mode clair parchemin assumé (AA d'abord), brand aérée + filet or en sidebar, ex-libris d'auteur sur la share card. **Refusé** : vignettage, grain feTurbulence, halo excessif, brume, ◆ en checkbox, count-up généralisé, dégradés or hors 18/18 et share card, particules/étoiles/FOMO/faux sons. L'ambition visuelle maximale se concentre sur **la share card** — la seule surface vue par des non-utilisateurs. |
| D7 | **Mono = valeurs du jeu** | Figé (corollaire d'A1). Stats, IDs de règles, clé in-game, chiffres tabulaires (tabular-nums, alignés à droite). Les sigles mono des 11 stats restent la langue de la communauté — pas d'iconification des stats. Les 5 glyphes SVG de slots (épée, plastron, brassard, amulette, anneau) entrent au lexique. |
| D8 | **Le mode Couverture est tué comme vue** | Fusionné : la couverture devient un attribut de la carte de règle (« 36 profils · 2,14 % · ok », largeur réservée en mono, mise à jour au commit du geste) + stat-cards globales en tête de Règles + l'étape 2 experte des presets d'échantillon (« 1 semaine de farm Raid 1 niv. 21 »). Plus jamais un point d'atterrissage. |
| D9 | **Templates & onboarding — jamais de gate** | Empty state « Mes règles » : templates **Early / Mid / End** en premier (l'onglet Démo devient le template Early) + « Dupliquer la démo », l'éditeur direct toujours visible. Onboarding = scène du verdict + 2 toasts, pas d'overlay tutorial. « ↳ Créer une règle qui garde cette pièce » sur toute pièce vérifiée, chaque champ pré-rempli d'une valeur qu'on vient de voir. Quatre cycles convergents sur l'empty state actif. |
| D10 | **Share card PNG = artefact composé de premier ordre** | Pas un export de carte figée : nom du ruleset, crédit d'auteur en ex-libris, nb règles, % gardé en display **doré**, la phrase de règle générée, clé in-game en mono, lien d'import en pied — fond socle, liseré zénithal. À l'arrivée via lien : landing d'aperçu (« Ruleset de Khalgar — 12 règles, garde 1,8 % ») avec « Adopter » / « Juste regarder ». L'actif d'acquisition n°1. |
| D11 | **Pile de commandes = brique fondatrice** | Chaque mutation = une commande (point de passage `scheduleSave` existant), pile de snapshots (structuredClone, cap 50), Ctrl+Z / Ctrl+Shift+Z globaux, toast = tête de pile. Le stepper et le clic-cycle gardent leur vitesse et gagnent leur filet. ~80 lignes, ~2 j — le multiplicateur du corpus. |
| D12 | **Édition à l'échelle : explicite, pas invisible** | Shift-clic / `x` sélectionne → barre d'action contextuelle (visible seulement s'il y a sélection) : ajouter/retirer set, rôle, ±requis, dupliquer, supprimer. L'alt-clic « édition verticale » est **gelé** (P2, ne revient qu'après pile + affordance des chips). Recherche `/` étendue aux 4 vues + préfixes `set: sub: req: role:` avec chips de syntaxe suggérées. |
| D13 | **Motion : 2 durées, 1 easing, navigation jamais animée** | Tokens `--dur-1:120ms`, `--dur-2:200ms`, `--ease-out` ; transitions énumérées, jamais `all` ; flash 600 ms = signature unique « contenu arrivé » ; `:active` global (scale .97). Cérémonies réservées aux événements rares. Reduced-motion ≠ reduced-feedback : chaque animation porteuse de sens a un état statique équivalent. |
| D14 | **Cinzel : écarté** | Le Palatino discipliné (display ≥ 16 px, small-caps réelles uniquement) est la direction. La clause de bascule du rapport 1 reste dormante : seulement si le client redit « Times » après le chantier peau. Aucune webfont d'ici là. Direction C (tout-sans) : définitivement enterrée. |
| D15 | **Ordre de saisie : conservé (Slot → Main → Subs → Set)** | On ne change pas une gestuelle installée sur une hypothèse divergente (R1 proposait Slot → Set → Main → Subs ; le game-UI du cycle 2 a spontanément gardé l'ordre actuel). Ne sera rejoué que si la vérification in-game contredit — charge de la preuve inversée. |
| D16 | **Gouvernance des erreurs & du système** | Verdicts et états sains **formulés en positif** ; micro-labels d'état au clic-cycle (un style codifié, éphémère pour nommer — tooltip/panneau `?` pour persister, jamais de bandeau permanent) ; phrase de règle générée en langage naturel dans l'éditeur et la carte dépliée ; warning « injouable » bloque « Créer la règle » avec raison ; save-line remontée en contraste + répliquée dans le header mobile ; état d'attente seulement au-delà de ~150 ms mesurés. |
| D17 | **PWA : en tout dernier, proposée au 2ᵉ retour** | Après une session de farm ou une recopie terminée — un service rendu, pas un prompt. Seul vrai risque de régression globale : il ferme la roadmap. |

---

## 4. Le périmètre refusé (consolidé, définitif)

- Direction C tout-sans ; Cinzel avant discipline ; toute webfont immédiate.
- Vignettage, grain, brume, halo excessif ; ◆ en checkbox ; count-up généralisé ; dégradés or hors 18/18 + share card ; particules, étoiles, FOMO, faux sons.
- Légende permanente / chrome pédagogique permanent ; tooltips dans les chips et tables (textes d'aide uniquement).
- Confirmations sur les gestes fréquents (la réversibilité les remplace).
- Alt-clic « édition verticale » avant pile + affordance (gelé P2).
- Matrice n×n des chevauchements ; split-screen de comparaison (le delta par colonnes suffit).
- Virtualisation / framework pour les 2 000 cartes (cap 60 + agrégats + bandeau-résultat-d'abord) ; subgrid et container queries sur cette base.
- 6ᵉ entrée de nav, bannières, chrome permanent ; badge « 48 » en nav.
- Renommer « gardée / recyclée » (canon figé) ; animer la navigation ; View Transitions hors événements rares.
- Templates en gate (l'éditeur direct reste toujours accessible).
- Thème clair séparé (le clair se répare par les tokens).

---

## 5. Les décisions restant au client (les vraies, réduites au minimum)

1. **Tab bar basse à 5 entrées en mobile** (remplace le burger ; réglages en sheet « ⋯ ») — oui/non. Toute la nav mobile en dépend.
2. **Palette d'accents recomposée** (or · sarcelle · acier · mauve gris · cuivre — le rouge disparaît des options) — validation, car des utilisateurs ont choisi l'ancien rouge.
3. **« Onglet » → « Jeu de règles » partout** — renommage visible par toute la communauté.
4. **Clause Cinzel dormante** — accord de principe (~60 Ko) si le mode clair post-chantier peau ne convainc toujours pas.
5. **Les deux dettes de terrain** — à payer pendant le chantier moteur, avant les chantiers structurels : ① ouvrir l'écran d'équipement réel de WoR (couleurs de tiers, ordre de lecture — fige les teintes de la carte d'item et clôt D15) ; ② 5 sessions d'observation de vrais joueurs Discord (elles éclairent A6 en aval : qui perd-on le plus, le novice du lien ou l'expert à 4 onglets).

---

## 6. Les 10 maquettes prioritaires (pour le maquettiste)

| # | Écran | Contenu clé | Format |
|---|-------|-------------|--------|
| M1 | **La scène du verdict** (première visite) | Phrase de verdict en display, 2-3 cartes d'item (gardée/recyclée), bandeau-oracle ◆ vert, CTA unique, « Partager ce résultat » | Desktop |
| M2 | **La scène du verdict** | La même scène recomposée pour le pouce ; tab bar basse visible | Mobile 375 px |
| M3 | **La carte d'item vivante — planche d'états** | En construction (Session, tap après tap) / ✓ Gardée par G5 (liseré or) / Recyclée (désaturée + ⚒) / subs gagnants surlignés | Desktop (composant) |
| M4 | **Vue Règles unifiée** | Sélecteur « Jeu de règles », stat-cards de couverture en tête, cartes de règle avec « 36 profils · 2,14 % · ok », micro-barre + libellé du requis (A2), carte dépliée avec phrase générée | Desktop |
| M5 | **Recopie téléprompteur** | Une règle plein écran, mono dominant, jauge 7/18, boutons ✓/retour en zone pouce, clé + « où la coller » ; + l'état 18/18 doré | Mobile 375 px |
| M6 | **Session — vérifier une pièce** | Saisie 1 main : carte d'item sticky qui se construit, verdict = état de la carte, « ↳ Créer une règle qui garde cette pièce » | Mobile 375 px |
| M7 | **La share card PNG** | Le concentré de DA : fond socle, liseré zénithal, % gardé doré, phrase générée, ex-libris, clé mono, lien d'import — telle qu'elle s'embarque dans Discord | Format fixe (1200×630) |
| M8 | **Navigation 5 destinations** | Tab bar basse (5 icônes + états actifs ◆), sheet « ⋯ » de réglages, sélecteur « Jeu de règles » compact sous le titre | Mobile 375 px |
| M9 | **Palette Ctrl+K + panneau `?`** | La palette avec raccourcis affichés à droite (pattern VS Code), le panneau `?` : raccourcis, légende des encodages, syntaxe de recherche | Desktop |
| M10 | **Édition à l'échelle** | Sélection multiple (shift-clic) + barre d'action contextuelle ; ligne repliée enrichie (density compact) ; toast « tête de pile » avec Ctrl+Z | Desktop |

---

*Synthèse-arbitrage finale · directeur de design du rapport final · sept. 2026.*
*Sources : design-review (10 regards), design-review-2/-3/-4 (3 regards chacun + modération).*


## Amendements client (post-livraison — PRIMENT sur tout ce qui précède)
- **C1** — La recopie in-game est RARE (un ensemble stable des semaines/mois). Le téléprompteur reste (événement lourd), mais aucune justification « hebdomadaire » n'est valide.
- **C2** — AUCUNE valeur de roll dans l'app : seules les stats présentes (main/subs) existent, jamais leurs valeurs. Cartes d'item = noms de stats uniquement.
- **C3** — Le farm se compte en PIÈCES PAR SESSION, jamais en semaines. Presets : « Session · 400 pièces · Raid 1 niv. 21 ».
- **C4** — Champ DESCRIPTION optionnel par règle ET par ensemble (fusionne/remplace « notes par règle »).
- **C5** — La share card affiche la description de l'ensemble si présente (phrase générée = repli).
