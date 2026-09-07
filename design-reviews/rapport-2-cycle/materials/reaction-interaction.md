# Débat — réaction de l'interaction / motion designer (cycle 2)

Position de départ : le feedback doit migrer vers les 4 gestes qui comptent (cocher, générer, verdict, réordonner), les sauts de layout doivent disparaître, et le mouvement se normalise (2 durées, 1 easing, flash = « contenu arrivé »). Je lis vos deux analyses avec cette grille : **une restructuration ne vaut que si elle préserve — ou améliore — la continuité perçue du geste.**

---

## J'appuie

### 1. IA-5 / IA-13 — « Session » extraite du Testeur, atterrissage mobile par défaut
C'est la proposition la plus importante des trois analyses réunies. Mes constats n°1 (coche sans feedback sur mobile), n°4 (drag mort au touch) et n°8 (verdict sous la ligne de flottaison) sont tous des symptômes du même mal : l'usage réel est mobile-en-jeu et l'app est architecturée bureau. Ce que mon angle y ajoute : « Session » doit être conçue **pour une main et un pouce** — verdict en bandeau sticky bas (mon spec n°8 s'y transplante tel quel), cibles 44px partout, et un rythme de saisie où chaque étape validée **avance le focus automatiquement** (slot → main → subs → set) avec un scroll doux de 200ms, pas un saut. Si Session existe, elle mérite la seule transition d'entrée « habitée » de l'app : rise 6px + fade 160ms, parce qu'on y *entre en action*.

### 2. Game-UI P0-4 — la saisie en jeu traitée en quest log (« gravée », jalons ◆, fin sobre)
J'applaudis parce que c'est exactement ma thèse formulée dans la langue du joueur : la satisfaction vient de **l'état qui change**, pas de la particule. Mon ajout de motion designer : la séquence de la gravure. Le tap → pop du ✓ (180ms, overshoot léger) → la ligne glisse vers son état « gravée » (fond `--acc-dim`, 200ms `ease-out`) → **80ms plus tard seulement**, le jalon ◆ de la barre s'allume (120ms). Ce décalage de 80ms crée une chaîne causale lisible : *mon geste → la règle → la progression*. Simultané, ce serait trois choses qui clignotent ; enchaîné, c'est une phrase. À 18/18 : la bordure or de la barre arrive en 400ms, une fois, jamais rejouée.

### 3. IA-9 — un seul éditeur canonique : « + Nouvelle règle » insère une carte vide en tête de liste
Fort. La modale `pop` actuelle est une rupture de contexte (overlay, perte du scroll, perte des voisines qu'on veut imiter). L'insertion en place est *spatialement honnête* : on crée la règle là où elle vivra. Mon ajout : l'insertion utilise le même mécanisme `grid-template-rows: 0fr→1fr` que mes accordéons (200ms) — la liste **s'ouvre** pour accueillir la carte au lieu de sauter — puis `flash` court (600ms) sur la carte posée. Le pattern « flash = contenu arrivé » gagne son troisième cas d'usage (import, duplication, création) : la signature se consolide.

---

## Je conteste

### 1. IA-1 — la couverture affichée en permanence sur chaque carte de règle : oui à la fusion, non au « live »
Sur le fond, l'architecte a raison : la couverture est un attribut, l'aller-retour Règles→Testeur est absurde. Mais « afficher en permanence » un nombre **recalculé à chaque modification** crée le pire bruit de mouvement possible : j'édite un stepper Requis et *dix cartes* changent leurs chiffres sous mes yeux, avec reflow si « 36 profils » devient « 2 014 profils » (largeur du texte). C'est l'anti-thèse de la continuité : l'œil est arraché de son point de travail par des valeurs qui frétillent en périphérie. Ma contre-proposition : couverture affichée en **largeur réservée** (mono, `min-width` fixe), mise à jour **au commit du geste** (relâchement du stepper, blur du champ — pas au keystroke), avec un unique tint 400ms sur la carte *éditée* seulement. Les neuf autres cartes se mettent à jour en silence total. La donnée vit sur la carte ; le mouvement, lui, reste là où est le doigt.

### 2. IA-14 — le Testeur qui s'ouvre pré-généré avec 2000 pièces : non, pas au prix de la transition
« On ajuste un résultat, on ne configure pas un néant » — j'adhère à la philosophie. Mais déclencher une génération de 2000 cartes **au moment du changement de vue** empile le coût de rendu le plus lourd de l'app (mon constat n°3 : gel perceptible, scroll qui saute) sur le geste de navigation, qui doit être le plus fluide de tous (mon constat n°10). L'utilisateur paiera l'ouverture de l'onglet Simulation d'un freeze — et un freeze à l'entrée d'une vue se lit comme « l'app rame », pas comme « ça calcule ». Amendement : à l'entrée, on montre **le dernier résultat en cache instantanément** (stat-cards d'abord, grille ensuite par tranches rAF) ; on ne génère à froid que s'il n'existe aucun cache, et alors avec l'état busy complet de mon spec n°3. Pré-rempli, oui ; pré-calculé dans le dos de la transition, jamais.

### 3. Game-UI P2-11 — ◆ comme état coché des checkboxes : c'est mon geste n°1, on n'y touche pas
Systématiser ◆ en signature, d'accord — brand, jalons, marqueur d'onglet. Mais remplacer le ✓ de la coche par un ◆, c'est sacrifier l'affordance la plus universelle de l'interface (✓ = fait, appris depuis quarante ans) sur l'action la plus fréquente de l'app, au profit d'un glyphe qui portera déjà **quatre autres sens** (marque, pip de tier sur les chips — ton P1-7 —, jalon de barre, puce de liste). Au moment précis où l'utilisateur alterne jeu/téléphone et vérifie d'un coup d'œil « lesquelles j'ai faites », l'ambiguïté ◆-tier / ◆-coché est un coût de lecture réel pour un gain d'identité nul. Le ✓ reste ; le ◆ décore le monde, il ne confirme pas les gestes. Un ornement qui envahit le vocabulaire de feedback cesse d'être une signature, il devient un accent qui bégaie.

---

## Je fusionne

### 1. La « carte d'item vivante » = Game-UI P1-9 + mon verdict sticky (n°8) + IA-5 Session
La carte d'item de Game-UI n'est pas qu'un rendu : c'en est le **feedback de construction**. Dans Session, pendant le stepper (les diamants I→IV de Game-UI P1-10), la carte se construit *en direct* dans le bandeau sticky bas : je choisis le slot → le glyphe apparaît (fade 120ms) ; la main stat → elle se pose en `--fs-4` ; chaque sub → une ligne s'ajoute (mécanisme 0fr→1fr, pas de saut). Au dernier tap, la carte **est déjà là** — le verdict n'est plus un panneau qui surgit mais un simple changement d'état de l'objet qu'on regarde depuis le début : filet supérieur qui prend la couleur (or « Gardée » / désaturation + ⚒ « Recyclée »), tint 400ms. Continuité maximale, zéro apparition. Et cette même carte, figée, est la share card du backlog : trois usages, un composant, et le feedback est *dans* l'objet.

### 2. « Saisie en jeu » destination (IA-3) × quest log (Game-UI P0-4) × mes specs de coche (n°1)
L'architecte lui donne une adresse, le game-UI designer lui donne un langage d'état, je lui donne sa chorégraphie (la chaîne 0→180→280→400ms du point J'appuie-2). Fusion supplémentaire qui m'appartient : dans cette vue, la **prochaine règle à saisir** est auto-mise en évidence (scroll doux + liseré or) après chaque coche — le mode devient un tapis roulant : cocher → la suivante se présente. C'est le pattern « recopie guidée » du backlog obtenu presque gratuitement par l'assemblage de nos trois analyses.

---

## Je révise

1. **Mon compteur flottant « 12/18 » (spec n°1c) : retiré dans sa forme générale.** Il était un pansement sur l'absence de destination « Saisie en jeu ». Si IA-3 passe (et je le soutiens), la progression est ambiante dans le mode qui la porte ; mon pill flottant n'a plus de raison d'exister que pour la coche *opportuniste* faite depuis la vue Règles — et encore, un simple écho sur le badge de nav (pulse 150ms) suffit. Moins de feedback, mieux placé : je m'applique ma propre thèse.
2. **Mon count-up des gros chiffres (n°13) : je le restreins encore.** Avec le patron stat-cards généralisé (IA-8) et la liste de refus de Game-UI (P2-13 : rien ne bouge pour décorer), le count-up ne se justifie plus que sur **la toute première génération d'une session**. Partout ailleurs : swap sec + tint. J'avais gardé un réflexe de « moment de résultat » ; leurs deux analyses montrent que la solidité du patron (même forme partout) porte plus de sens que l'animation du nombre.

---

## Ma colline à défendre

**Aucun feedback ne déplace la mise en page, et aucun feedback ne meurt sous `prefers-reduced-motion`.** Concrètement : espace réservé partout où un contenu peut apparaître (★ des subs, message « injouable », couverture sur carte, lignes de la carte d'item), transitions de hauteur en `0fr→1fr` jamais en `display`, et chaque animation porteuse de sens doublée d'un état statique équivalent. On peut renommer les vues, fusionner la couverture, repeindre les tiers aux couleurs du jeu — je signerai tout. Mais une interface qui bouge sous le doigt de l'utilisateur au moment où il agit, ou qui devient muette pour ceux qui désactivent le mouvement, je la bloque, quel que soit l'auteur de la proposition.
