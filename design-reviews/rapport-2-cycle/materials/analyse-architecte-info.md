# Analyse — Architecture d'information (cycle 2, à froid)

**Analyste : architecte d'information senior. Matière : 9 captures + CSS (l. 15-560). Aucune lecture des reviews antérieures.**

## Thèse

L'app est organisée par **nature d'outil** (Règles / Testeur / Sets / Référence) alors que l'utilisateur vit un **cycle** : construire → vérifier → recopier en jeu → farmer → réviser. Chaque frontière de vue actuelle coupe ce cycle en deux. Les corrections les plus rentables ne sont pas cosmétiques : ce sont des **fusions et des renversements de hiérarchie** — la couverture appartient aux règles, la pièce manuelle appartient au farm, la saisie en jeu est un mode à part entière et non une jauge de pied de page.

---

## P0 — Structurel

### 1. La couverture n'est pas un « test », c'est un attribut de la règle — fusionner
Le mode « Couverture » du Testeur est un calcul instantané et déterministe : il n'y a rien à « lancer ». Forcer l'aller-retour Règles → Testeur → Règles pour voir si une modification garde 36 ou 0 profils casse la boucle d'édition. **Afficher « 36 profils · 2,14 % · ok » en permanence sur chaque carte de règle** (la row-head a déjà la place : ATK·HP / dots / 4 sets), et les 4 stat-cards globales en tête de la vue Règles. Le Testeur perd ce mode ; il ne garde que ce qui se génère (Échantillon) et ce qui se saisit (Pièce).

### 2. « Onglet » : un mot d'UI promu concept de domaine — renommer et centraliser
« Chaque onglet est un jeu de règles indépendant » : on définit un concept métier par son widget. Pire, ce concept est sélectionné **trois fois avec trois UI différentes** (tabs dans Règles, `<select>` dans Testeur, `<select>` dans Sets). Le nommer **« Jeu de règles »** (ou « Profil ») partout, et faire du jeu actif un **contexte global du shell** : sélecteur unique dans la sidebar sous la marque, visible et changeable depuis toutes les vues. Les vues cessent chacune de re-poser la question « sur quoi je travaille ? ».

### 3. « Saisie en jeu 0/18 » : le but final de l'app vit en pied de sidebar, entre Mode clair et Densité
La recopie manuelle dans le jeu est LA raison d'être de l'outil — et elle est rangée avec les préférences d'apparence. Avec la « recopie guidée plein écran » du backlog, c'est une **cinquième destination de nav** (« Saisie en jeu », avec le badge 0/18) ou un CTA primaire dans Règles. Règle d'or violée ici : ne jamais mélanger progression métier et réglages d'UI dans le même bloc.

### 4. La vue Règles enterre les règles — inverser la hiérarchie verticale
~40 % de la hauteur avant la première règle : titre + lede, tabs, 5 outils d'onglet (Renommer/Dupliquer/Supprimer/Exporter/Partager), encart Clé in-game, Recherche & filtres, rangée de boutons. Renommer/Supprimer servent une fois par mois : les replier dans un **menu « ⋯ » porté par l'onglet actif**. La clé in-game appartient au flux de saisie (constat 3), pas au header permanent. Objectif mesurable : G1 Tank visible au-dessus de la ligne de flottaison.

## P1 — Réorganisations

### 5. « Pièce manuelle » est mal rangée : c'est l'embryon du mode farm
Le backlog (session de farm 3-taps, créer-règle-depuis-pièce, vérif d'un drop réel) décrit un usage **en jeu, sur mobile, répété** — l'opposé du Testeur analytique posé au bureau. Sortir Pièce manuelle du Testeur et en faire la destination **« Session »** (ou « Drop »), mobile-first, qui absorbera le mode farm. Le Testeur redevient conceptuellement pur : simulation statistique uniquement. Bonus : « créer une règle depuis cette pièce » y devient naturel, alors que créer une règle depuis un « testeur » est un non-sens de modèle mental.

### 6. « Sets & transfo » est deux vues cousues ensemble — la découdre
La table mélange de la **référence statique** (bonus, source, destination de transfo — ne change jamais) et de l'**audit dynamique** (colonne Couverture, dépendante du jeu de règles actif). La référence statique part dans Référence. La colonne Couverture devient l'écran qu'elle essaie d'être : **« Angles morts »** — sets non couverts d'abord, tri par tier décroissant, chips de règles cliquables. Le badge « 48 » en nav disparaît : c'est un compteur d'inventaire statique déguisé en information actionnable.

### 7. Le groupement premier des règles est technique, pas mental
« Ensemble 2 pièces / Ensemble 3 pièces » : personne ne pense son tri par taille de set. Le joueur pense **par archétype** (Tank, Heal, DPS — c'est déjà le nom des règles : G1 Tank, G4 Heal HP…). Proposer le groupement par rôle comme vue par défaut, la taille d'ensemble devenant un badge de carte ; garder le groupement actuel en option de tri. Les IDs G/D (qui encodent le groupe) survivent tels quels.

### 8. L'Échantillon enterre sa réponse
La ligne « 48 gardée(s) / 2000 — 2,4 % » est le verdict de toute la simulation, rendue en mono 11px, écrasée par une grille de 2000 cartes de pièces. Renverser : **le verdict global + répartition par tier en stat-cards** (même patron que Couverture — cohérence inter-modes gratuite), les pièces individuelles en second niveau, repliées ou paginées. C'est aussi là que vivra la jauge stricte/permissive du backlog.

### 9. Deux éditeurs de règle concurrents — un seul formulaire canonique
La modale « Nouvelle règle » et la carte dépliée (Rôles/Sets/Main/Subs/Requis + dupliquer/supprimer/modifier) sont le même formulaire implémenté deux fois, avec des ordres de champs différents. Supprimer la modale : « + Nouvelle règle » **insère une carte vide dépliée en tête de liste**. Cohérence spatiale (on édite toujours au même endroit), un écran de moins, et le futur « créer-règle-depuis-pièce » réutilise la même carte pré-remplie.

## P2 — Nommage & liaisons

### 10. Vocabulaire non aligné sur son propre lexique
« Sets » (ligne de règle) vs « Ensemble » (groupe et champ du dialogue) vs « Sets & transfo » (vue) ; « Main(s) » vs « mains exclusifs » ; « Subs » jamais défini in situ. Un Lexique existe — mais dans Référence, à quatre clics du jargon. Faire du lexique la **source unique** alimentant les tooltips du backlog : chaque terme (Main, Sub, RR, T∞, saturant) cliquable partout, défini une fois.

### 11. Référence mélange faits et opinions — la doctrine appartient aux règles
« Taux de drop mesurés » et « Lexique » sont des **faits**. « La doctrine », « Politique par tier », « Budgets saturants » sont les **justifications des règles de l'auteur**. Avec les notes-par-règle du backlog, rapatrier ces justifications au niveau de la règle (note « pourquoi 4 subs requis ») et lier la politique par tier depuis les groupes. Référence redevient courte : données du jeu + lexique + mécanique in-game.

### 12. Le statut de persistance est un murmure — en faire un bloc « Données »
« ● enregistré (local) » en fs-0 sous les pastilles d'accent : l'information « tout vit dans ce navigateur et peut disparaître » est un risque majeur traité comme une note de bas de page. Regrouper Importer / Exporter / Partager / statut de sauvegarde en un bloc **« Mes données »** unique (sidebar), au lieu de : import dans la sidebar, export dans les outils d'onglet, statut en pied. Répond directement à « export mis en avant » du backlog.

### 13. Mobile : la destination la plus utile est la plus chère en taps
Sur mobile (usage : à côté du jeu, vérifier un drop), atteindre Pièce manuelle = burger → Testeur → mode Pièce → scroll. Une fois « Session » extraite (constat 5), en faire la **vue d'atterrissage mobile par défaut** (ou raccourci fixe en bas d'écran). Le desktop atterrit sur Règles, le mobile sur Session : deux contextes d'usage, deux entrées.

### 14. Le Testeur s'ouvre sur une question au lieu d'une réponse
Onglet + Mode + (scope, source, niveau, pièces) avant tout contenu : l'écran s'ouvre vide de sens. Après fusion de Couverture (constat 1), l'Échantillon doit s'ouvrir **pré-généré avec des défauts sensés** (dernier scope utilisé, 2000 pièces) : on ajuste un résultat, on ne configure pas un néant. Même logique pour les templates par phase du backlog : ils vivent dans le flux « + nouveau jeu de règles », pas dans une vue dédiée.

---

## Cible de navigation proposée

**Règles** (avec couverture intégrée) · **Simulation** (ex-Échantillon) · **Session** (ex-Pièce manuelle + futur farm + créer-règle-depuis-pièce) · **Saisie en jeu** (recopie guidée, clé, progression) · **Référence** (faits + lexique + angles morts des sets) — et le sélecteur de jeu de règles dans le shell, hors des vues.
