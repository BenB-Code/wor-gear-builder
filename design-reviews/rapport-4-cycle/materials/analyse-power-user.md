# Analyse power-user — densité de commande, vitesse, échelle (cycle 4)

Angle : l'utilisateur intensif (2-4 onglets, 18+ règles, itération hebdomadaire, recopie in-game complète à chaque refonte). Constat d'ensemble : l'app est **excellente en lecture** (coverage, gardée-par, goto-flash) et **artisanale en écriture**. Tout ce qui touche une règle se fait à l'unité, à la souris, après dépliage. Le clavier existant se résume à `/` (recherche, vue Règles seulement), Échap, et Espace/Entrée pour déplier une ligne focusée. C'est un début de modèle clavier — pas un modèle.

## Audit des 10 actions les plus fréquentes (coût actuel)

| # | Action expert | Coût actuel | Raccourci manquant |
|---|---|---|---|
| 1 | Cycler une sub (pool→★→off) | 1 clic **si dépliée** ; sinon déplier + scroll + clic | ligne compacte éditable sans dépliage |
| 2 | Cocher « saisie en jeu » ×18 | 18 clics + scroll sur toute la liste | flux recopie : Entrée = coché → suivante |
| 3 | Modifier les sets d'une règle | déplier → `modifier` → dialogue → clics → enregistrer ≈ 5 | édition inline des sets (comme les subs) |
| 4 | Ajuster « requis » | déplier + n clics stepper | +/− au clavier sur la ligne focusée |
| 5 | Dupliquer une règle | déplier + 1 clic | `d` sur la ligne focusée |
| 6 | Aller au Testeur et générer | 3 clics (nav, mode, Générer) | `g t`, `Entrée` relance le dernier échantillon |
| 7 | Changer d'onglet de règles | 1 clic (souris obligatoire) | `1..4` ou `[`/`]` |
| 8 | Post-patch : ajouter 1 set à 6 règles | ≈ 5 clics × 6 = **30 gestes** | édition en masse (voir P0-3) |
| 9 | Comparer 2 onglets | impossible (bascule de select, mémoire humaine) | delta de couverture A vs B |
| 10 | Chercher partout | `/` marche **uniquement** vue Règles | `/` global + syntaxe de requête |

## Constats & propositions

### P0-1 — Undo global Ctrl+Z : le contrat de confiance n'est pas tenu
Le toast « annuler » ne couvre que 3 opérations (suppr. règle, suppr. onglet, import). Le mis-clic le plus probable — cycler une sub par erreur, incrémenter « requis », toucher un set dans le dialogue — n'a **aucun** filet, et le toast disparaît. Un power-user qui édite vite fait des erreurs vite. Pile de commandes globale (state snapshots par mutation, déjà centralisées via `scheduleSave`), Ctrl+Z/Ctrl+Shift+Z. Zéro chrome : le toast actuel devient une simple confirmation de ce que Ctrl+Z sait déjà faire.

### P0-2 — Palette de commandes Ctrl+K : la densité de commande sans un pixel de plus
4 vues, 3 modes testeur, 4 onglets, 18+ règles nommées : la surface de navigation dépasse déjà ce qu'une sidebar peut porter. Ctrl+K avec fuzzy : « G7 » → saute et flash (le mécanisme `data-goto`+`.flash` existe déjà), « échantillon » → Testeur/mode, « dupliquer l'onglet », « mode compact ». C'est LA fonctionnalité invisible par définition — les débutants ne la verront jamais, les pros ne vivront que dedans.

### P0-3 — Édition à l'échelle : sélection multiple + trouver/remplacer un set
Le scénario post-patch (le jeu ajoute un set) coûte ~30 gestes pour 6 règles, ~90 pour 18. Deux mécanismes invisibles au repos : (a) **shift-clic / `x`** sur le badge `rc-id` sélectionne des règles → une barre d'action contextuelle n'apparaît **que** s'il y a sélection (ajouter/retirer set, rôle, ±requis, dupliquer, supprimer) ; (b) dans la palette, « remplacer Salut → Grâce de la lumière dans cet onglet ». Sans ça, l'app punit exactement l'utilisateur qui itère chaque semaine.

### P0-4 — Flux « recopie guidée » piloté à l'Entrée (backlog validé : le prioriser)
La recopie in-game est LE moment de douleur récurrent : 18 règles à retaper, en cochant au fur et à mesure, dans l'ordre du jeu. Mode focus : une règle plein écran (clé in-game copiable), **Entrée = saisie ✓ → suivante**, ←/→ pour naviguer, la jauge 0/18 existante comme seul indicateur. Passer de 18 clics + scroll à 18 Entrée les yeux sur le jeu.

### P0-5 — Modèle j/k sur la liste de règles
Le socle existe (`row-head` focusable, Espace/Entrée déplie). Le compléter : `j`/`k` déplacent le focus, `o` déplie, `x` coche la saisie, `e` ouvre l'édition, `d` duplique, `+`/`−` sur requis, `Suppr` arme la suppression. Attention au conflit : Espace déplie aujourd'hui — le réserver au dépliage, `x` pour cocher. Coût visuel : nul (l'outline focus existe déjà).

### P1-6 — Syntaxe de recherche : `set:salut sub:AS req:4 role:tank`
La recherche fouille déjà id/nom/sets/mains/rôles en vrac. Des préfixes de champ la transforment en requête sans toucher aux 7 contrôles de filtres (qui restent pour les autres). Invisible, documentée dans le `?` déjà en place. Et étendre `/` aux 4 vues — son confinement à Règles est un bug d'attente, pas un choix.

### P1-7 — Navigation g-puis-x + chiffres pour les onglets
`g r`/`g t`/`g s`/`g f` (vues), `1..9` (onglets de rulesets), `?` affiche la cheat-sheet des raccourcis en overlay. Le power-user à 3 onglets bascule des dizaines de fois par session ; aujourd'hui chaque bascule est un aller-retour souris vers une rangée scrollable.

### P1-8 — Alt-clic : l'édition verticale
Alt-clic sur une sub d'une règle = appliquer le même état à **toutes les règles actuellement filtrées** (toast + Ctrl+Z en filet). Idem alt-clic sur un chip de set. C'est le geste pro par excellence : invisible, découvrable par tooltip, et il résout 80 % des cas d'édition en masse sans même passer par P0-3.

### P1-9 — Le mode compact ne va pas assez loin : il compresse du vide
`data-density="compact"` ne réduit que paddings et marges ; la ligne repliée ne montre toujours que nom + mains + jauge + « n sets ». Or l'expert veut **scanner** ses 18 règles : sets et subs visibles d'un coup d'œil. Troisième cran « tableur » : une règle = une ligne, chips de subs cliquables-cyclables directement, sets en abrégé. C'est la vue Sets & transfo qui prouve que cette densité est déjà dans l'ADN de l'app.

### P1-10 — Comparaison d'onglets : un delta, pas un split-screen
Pas de côte à côte (coût chrome + mobile). Dans le Testeur/Couverture : un second select « comparer à » (discret, à côté du select onglet existant) → colonnes delta (gardés A/B, règles muettes ici et pas là, sets couverts par l'un seul). Répond au vrai besoin (« mon Strict jette-t-il ce que mon Large garde ? ») sans layout nouveau.

### P2-11 — Réordonner au clavier
Le drag `⠿` est souris-only. Alt+↑/↓ sur la ligne focusée réordonne — accessoirement un gain d'accessibilité, pas seulement de vitesse.

### P2-12 — Double-clic « créer une règle depuis cette pièce »
Dans Échantillon/Pièce manuelle, une pièce recyclée à tort = double-clic → dialogue Nouvelle règle pré-rempli (slot→section, set, main, subs). Le backlog le valide ; le geste d'entrée doit être invisible (double-clic ou entrée de palette), pas un bouton par carte.

### P2-13 — Copier la clé in-game au clavier
Pendant la recopie, `c` sur la règle/l'onglet focusé copie la clé. Micro-geste × fréquence élevée = réel.

## Thèse
L'app a la **lecture d'un outil pro et l'écriture d'un formulaire**. Tout le backlog visible (jauge, notes, tooltips) est cosmétique à côté du vrai déficit : un modèle de commande — undo universel, palette, sélection multiple, flux Entrée. Aucune de ces quatre briques n'ajoute un pixel au repos ; ensemble elles divisent par 5 à 10 le coût des boucles hebdomadaires (itération post-farm, post-patch, recopie). Le royaume de l'invisible n'est pas un bonus pour experts : c'est ce qui décide si l'utilisateur à 4 onglets reste.
