# Réaction — Design engineer (cycle 4, phase débat)

Je parle depuis le code : 3 100 lignes de JS, rendu par `innerHTML`, zéro dépendance. Chaque proposition ci-dessous est chiffrée contre CETTE base, pas contre une app idéale.

---

## J'appuie

### 1. Le sélecteur d'onglet unique (heuristique, H4 sev 3) — et c'est moins cher qu'il n'y paraît
C'est le constat le plus important du cycle, et je le dis en ayant raté sa racine dans ma propre analyse (voir « Je révise »). Coût réel : les pills existent déjà dans la vue Règles avec leur état actif et leurs compteurs ; en extraire une fonction `tabPicker(current, onChange)` et remplacer les deux `<select>` natifs (Testeur, Sets) est un refactor de ~40 lignes de template + 15 de CSS. Bonus technique immédiat : on supprime du même coup deux des popups système clairs qui poignardent le dark mode — mon P0-1 (`color-scheme`) reste nécessaire pour la scrollbar, mais la moitié du symptôme disparaît par ce refactor. Deux griefs client traités par un seul composant : le meilleur ratio du cycle.

### 2. L'undo global Ctrl+Z (power-user P0-1) — faisable en 2 jours, et il rembourse trois findings
Faisabilité vérifiée dans le code : toutes les mutations passent déjà par `scheduleSave`, le state est un objet sérialisable unique. Une pile de snapshots (structuredClone, cap à 50, ~quelques Ko par entrée) + deux listeners clavier : c'est ~80 lignes. Et il solde d'un coup : le toast éphémère de l'heuristique (H3 sev 3), le stepper silencieux (H5 sev 2), et le filet manquant de l'alt-clic du power-user. C'est LE multiplicateur du cycle : chaque feature d'édition future devient moins risquée à concevoir parce que le filet existe.

### 3. Les légendes des encodages (heuristique H6 sev 3) — coût quasi nul, je le prends dans mon lot
Tooltip natif `title="requis : 4/4"` sur les dots, une ligne de légende au-dessus de la première carte, hover renforcé sur les chips à 28 % d'opacité : c'est du template déterministe, ~20 lignes, aucune interaction nouvelle. Ça se livre avec mes correctifs P0 sans coût de coordination.

---

## Je conteste

### 1. La palette Ctrl+K (power-user P0-2) : construire une cathédrale sur du sable
Mon P0-2 le documente : `rerenderRule()` fait `el.outerHTML = ...` et **perd le focus à chaque interaction**. Une palette de commandes, c'est : un overlay avec focus trap (que l'app ne sait pas faire — le dialogue actuel laisse Tab s'échapper), une restitution du focus au point de départ après exécution (que le moteur de rendu détruit), et un routage d'actions vers des mutations qui n'ont pas encore d'undo. Livrer Ctrl+K aujourd'hui, c'est livrer une palette qui exécute « incrémenter requis » puis laisse l'utilisateur focus sur `<body>`, sans Ctrl+Z. L'ordre est non négociable : focus management + `<dialog>` + undo D'ABORD, palette ensuite. Elle passe de P0 à P1, conditionnée.

### 2. Le troisième cran « tableur » (power-user P1-9) : un fork de template qu'on paiera à chaque feature
La ligne repliée et la carte dépliée sont déjà deux templates à maintenir. Un troisième rendu « une règle = une ligne, chips cyclables inline » triple la surface : chaque évolution du modèle de règle (nouveau champ, nouvel état de sub) devra être implémentée et testée trois fois, sur une base sans composants ni tests. Contre-proposition moins chère : enrichir la ligne repliée EXISTANTE (sets en abrégé + subs cliquables) quand `data-density="compact"` — un seul template, densité obtenue, ~30 lignes.

### 3. Le spinner sur le recalcul du Testeur (heuristique H1) : mesurer avant d'habiller
172 410 profils, c'est une combinatoire, pas 172 410 itérations lourdes — sur le code actuel je parie < 100 ms sur machine médiane. Un spinner sur une opération sub-100 ms AJOUTE de la latence perçue (flash d'état intermédiaire). Le correctif honnête : mesurer (`performance.now()` autour du calcul), et n'afficher un état d'attente que s'il dépasse ~150 ms. Sev 1 « à vérifier » dans l'audit — alors vérifions avant de coder.

---

## Je fusionne

### 1. Le chantier « discipline du focus » : trois demandes, un seul socle
Mon P0-2 (restauration du focus au re-render), le j/k du power-user (P0-5), et le réordonnancement clavier (heuristique H7 sev 2 + power-user P2-11) sont le MÊME chantier : rendre le focus prévisible et pilotable sur la liste de règles. Livré ensemble : patch in place des toggles (pas de re-render), roving tabindex j/k, Alt+↑/↓ pour réordonner. ~120 lignes, et il débloque la palette et le flux recopie derrière.

### 2. `<dialog>` + flux recopie : la modale accessible devient le mode focus
Mon P0-4 (migrer vers `<dialog>`/`showModal()`) donne gratuitement le focus trap, Échap, `inert` du fond. Le flux « recopie guidée » du power-user (P0-4, Entrée = coché → suivante) est exactement un `<dialog>` plein écran avec un handler Entrée : en construisant la migration `<dialog>` comme un utilitaire réutilisable (~30 lignes), le mode recopie coûte ~60 lignes de plus au lieu d'un développement séparé. Le moment de douleur n°1 du power-user, payé par mon correctif a11y.

---

## Je révise

J'ai audité le CSS et les templates ligne à ligne et j'ai classé `color-scheme` « bug cheap n°1 » — mais j'ai raté que la racine du ressenti « incohérent » du client n'est pas chromatique : c'est le même objet métier (l'onglet) rendu par deux composants différents (H4). Mon analyse optimisait le rendu de chaque vue isolément ; l'heuristique a regardé ENTRE les vues. Je révise aussi mon P1-9 (View Transitions) : tant que le focus management n'est pas réglé, `startViewTransition` autour d'un swap `innerHTML` anime joliment une perte de focus — il passe derrière le chantier focus, comme la palette.

---

## Ma colline à défendre

**Aucune nouvelle surface de commande — palette, édition en masse, alt-clic, mode tableur — ne se construit tant que le moteur de rendu détruit le focus et que l'undo global n'existe pas.** L'ordre de livraison est : (1) `color-scheme` + scroll instant + légendes [1 jour], (2) discipline du focus + `<dialog>` [2-3 jours], (3) undo global [2 jours], (4) sélecteur d'onglet unifié [1 jour] — et SEULEMENT ensuite le royaume de l'invisible du power-user, qui devient alors bon marché et sûr. Toute inversion de cet ordre produit des features pro qui humilient l'utilisateur clavier qu'elles prétendent servir.
