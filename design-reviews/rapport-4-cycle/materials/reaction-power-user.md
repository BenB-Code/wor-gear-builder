# Réaction au débat — Avocat du power-user (cycle 4)

Rappel de ma thèse : l'app a la lecture d'un outil pro et l'écriture d'un formulaire. Je lis vos deux analyses avec cette grille : est-ce que ça accélère ou ralentit l'utilisateur à 4 onglets et 18 règles qui itère chaque semaine ?

## J'appuie

**DE-2 (focus perdu au re-render) — c'est MON prérequis, je le co-signe des deux mains.** Sans focus stable après `rerenderRule()`, tout mon modèle j/k (P0-5) est mort-né : impossible d'incrémenter « requis » deux fois à l'Entrée, impossible de cycler trois subs de suite au clavier. Le patch-in-place (classe + `aria-pressed` + `.val`, sans `outerHTML`) est même supérieur à la restauration de focus proposée : zéro re-render = zéro scintillement pendant l'édition rapide. Effet expert : c'est la différence entre « le clavier existe » et « le clavier tient la cadence ».

**DE-3 (scrollTop animé) — oui, et c'est plus grave que du poli.** L'expert bascule entre vues des dizaines de fois par session (mon action n°6/7). Chaque bascule qui « glisse » sur 300 ms, multipliée par 40, c'est de la latence pure sur la boucle la plus fréquente. `behavior:"instant"` est un fix de vitesse, pas d'esthétique.

**H3 (undo toast-seulement, sev 3) — convergence totale avec mon P0-1.** Quand l'heuristicien et moi arrivons au même point par deux chemins (lui : 18 règles perdues sans recours ; moi : le mis-clic d'édition rapide sans filet), ce n'est plus une proposition, c'est un diagnostic. Idem H7 sur le réordonnancement clavier : mon P2-11 mot pour mot.

## Je conteste

**H6, la légende permanente au-dessus des cartes : non, elle vole des pixels à la seule chose qui compte, le scan.** « Une légende une ligne au-dessus de la première carte ouverte », c'est du chrome permanent que l'expert relira zéro fois après le jour 2 — mais qu'il scrollera 10 000 fois. Les dots et le tri-état s'apprennent en une session ; la densité se consomme à chaque session. La bonne réponse est déjà dans le correctif d'à côté : tooltip natif (« requis : 4/4 »), et le `?` en place. Reconnaissance à coût pixel nul, oui ; bandeau pédagogique permanent, non. Même objection au repli de la clé in-game (H8) : c'est l'artefact central de la recopie hebdomadaire — la replier ajoute un clic à LA boucle récurrente pour gagner 40 px chez le débutant.

**H5, « flash + confirmation » sur le stepper requis : la confirmation est un poison.** Une édition inline qui demande confirmation n'est plus une édition inline — c'est le dialogue qu'on vient d'éviter, en pire. Le vrai correctif du « clic de trop sur + » s'appelle Ctrl+Z, et il couvre AUSSI la sub mal cyclée, le chip de rôle, le set touché par erreur. On ne sécurise pas un outil rapide en le ralentissant ; on le sécurise en rendant toute erreur réversible en un geste. (Le flash visuel, lui, je le prends : feedback sans friction.)

**DE-9, View Transitions sur le changement de vue : incohérent avec DE-3, et je choisis DE-3.** On vient d'établir que le scroll animé fait « app qui rame » ; réintroduire une transition animée à chaque bascule de vue refait le même trou par l'autre bout. Pour qui bascule 40 fois par session, le cut sec est une feature. Si VT il y a : uniquement sur les événements rares (import, suppression d'onglet), jamais sur la navigation.

**Le séquençage du DE (« color-scheme à faire avant tout le reste ») : attention au cycle qui se dépense en CSS.** Onze de ses seize points sont du poli à effort faible — c'est précisément leur danger : ils se laissent tous faire « d'abord », et l'undo global, la palette et la sélection multiple glissent au cycle 5, puis 6. Une ligne de `color-scheme`, oui, évidemment. Mais un cycle entier de grammaire typographique pendant que la recopie coûte toujours 18 clics + scroll, c'est repeindre le cockpit d'un avion sans commandes.

## Je fusionne

**Une seule pile de commandes qui paie trois dettes (P0-1 + H3 + DE-2).** Mon Ctrl+Z global, l'« historique d'annulation » de l'heuristicien et le patch-in-place du DE sont le même chantier vu de trois fenêtres : chaque mutation passe par une commande (le point de passage `scheduleSave` existe déjà) → la pile donne Ctrl+Z/Ctrl+Shift+Z, le toast devient le simple affichage de la tête de pile (plus de course contre le timeout, H3 réglé), et parce qu'une commande sait ce qu'elle a touché, elle patche en place au lieu de re-render — le focus survit gratuitement (DE-2 réglé). Un chantier, trois P0.

**La palette Ctrl+K comme réponse à H4 (sélecteur d'onglet incohérent).** L'heuristicien veut UN composant sélecteur d'onglet partout — d'accord, les pills gagnent. Mais la palette est l'étage au-dessus : « aller à l'onglet Strict » devient une commande unique, identique depuis les 4 vues, avec `1..9` comme raccourci. On unifie la surface (son grief) ET on donne la voie rapide (le mien) ; et la cheat-sheet `?` qu'il réclame en H10 documente le tout.

**Le cran « tableur » (mon P1-9) écrit dans la grammaire mono du DE (points 5-6).** Sa consolidation « labels techniques = mono uppercase » est exactement la typo qu'exige une ligne-règle dense : chips abrégés, colonnes alignées, 11px lisibles. Le troisième cran de densité devient la vitrine de sa grammaire au lieu d'un dialecte de plus.

## Je révise

**Mon P1-8 (Alt-clic vertical), je le rétrograde honnêtement.** L'heuristicien démontre en H6 que le tri-état des subs est déjà illisible (opacité 0.28 vs plein vs ★) ; un geste invisible qui mute cet état sur 18 règles filtrées d'un coup, c'est de la vitesse construite sur du sable — l'utilisateur ne saura pas ce qu'il vient de faire. Alt-clic ne revient qu'APRÈS le Ctrl+Z global et après un renfort de l'affordance des chips (son point sur le grisé-cliquable est juste, je le prends aussi). D'ici là, la sélection multiple avec barre visible (P0-3) fait le même travail, en explicite.

## Ma colline

**La pile de commandes globale (Ctrl+Z universel) se livre CE cycle, avant tout chantier de poli.** Ce n'est pas une feature parmi seize : c'est le prérequis structurel de tout ce que nous voulons tous les trois — l'édition inline sans confirmation (H5), l'édition en masse (P0-3), le toast fiabilisé (H3), le patch-in-place (DE-2), et un jour l'Alt-clic. Chaque cycle sans undo, l'app reste un formulaire qu'on manipule avec des gants. Je lâcherai la palette, je lâcherai le mode tableur, je ne lâcherai pas ça.
