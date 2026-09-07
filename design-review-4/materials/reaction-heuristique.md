# Réaction au débat — Critique heuristique senior (cycle 4)

Position de départ inchangée : l'app est au-dessus de la médiane, plombée par H4 (cohérence) et H6 (reconnaissance). Après lecture des deux autres analyses, je durcis certains points et j'en lâche d'autres.

---

## J'appuie

**1. Design engineer #5–6 : la grammaire des labels, c'est MON H4 vu au microscope.**
J'avais localisé l'incohérence au niveau composant (pills vs `<select>`) ; l'ingénieur la localise au niveau typographique (serif small-caps synthétiques vs mono uppercase, sur la même vue). Les deux sont la même violation de l'heuristique de cohérence interne, et ensemble elles expliquent la totalité du grief client « app incohérente ». Je soutiens sa règle de tranchage — mono uppercase pour tout label ≤ 13px, serif réservé aux titres ≥ 15px — parce qu'elle est **systémique** : c'est une grammaire, pas une retouche. La loi de similarité (Gestalt) exige que même fonction = même forme ; aujourd'hui, même fonction = deux polices.

**2. Power-user P0-1 : l'undo global Ctrl+Z est la vraie réponse à ma violation H3 sev 3.**
Mon correctif (allonger le toast à 8–10 s) était un pansement ; sa pile de commandes est le traitement. Nielsen H3 ne demande pas un toast plus long, il demande une **sortie de secours toujours disponible**. Le power-user a raison sur un point que j'avais sous-pesé : le mis-clic le plus fréquent (cycler une sub, +1 sur requis) n'a aucun filet aujourd'hui — c'est exactement ma violation H5 « stepper silencieux », et Ctrl+Z la résout aussi. Une brique, trois heuristiques servies (H3, H5, H9).

**3. Design engineer #8 : l'élévation à deux niveaux.**
Il apporte la mesure (bordure à 5 % de blanc sur un delta de fond de 3 % de luminance) qui manquait à mon constat H8 sur `--faint`. « Estompé » n'est pas une esthétique quand c'est sous le seuil de discrimination : c'est de l'information supprimée. J'appuie sa grammaire à deux niveaux + ombre courte, et j'y rattache mon correctif contraste (`--faint` remonté) : même chantier, même PR.

## Je conteste

**1. Power-user : trois accélérateurs sur quatre sont invisibles par conception — c'est un outil à deux vitesses non découvrable.**
Ctrl+K « invisible par définition », alt-clic « geste pro invisible », syntaxe `set:salut` invisible : il revendique l'invisibilité comme une qualité. Nielsen H7 dit le contraire : les accélérateurs servent l'expert **à condition d'être appris**, et l'apprentissage passe par la visibilité (H1) et la reconnaissance (H6). Un utilisateur intermédiaire — la population majoritaire, celle qui décide de la rétention — ne franchira jamais le mur entre le formulaire et le royaume caché. Je n'accepte aucune de ces briques **sans son affordance d'apprentissage** : mention « Ctrl+K » visible dans le header, tooltip sur les gestes alt, chips de syntaxe suggérées sous la recherche. L'invisible au repos, oui ; l'inapprenable, non.

**2. Power-user P1-8 : l'alt-clic « édition verticale » est une violation H5 en puissance.**
Appliquer un état à *toutes les règles filtrées* d'un geste dont le modificateur est invisible, c'est fabriquer l'erreur catastrophique : alt enfoncé par accident (alt-tab raté, c'est un classique Windows) et 18 règles modifiées silencieusement. Mon audit relevait déjà qu'UN clic de stepper silencieux était sev 2 ; multiplier ce clic par 18 sans confirmation, même avec Ctrl+Z en filet, inverse la charge : la prévention d'erreur (H5) prime sur la récupération (H9). Je préfère sa propre alternative P0-3 (sélection multiple + barre contextuelle) : l'étendue de l'action y est **visible avant** l'action.

**3. Design engineer #9–10 : View Transitions et `@starting-style` n'ont rien à faire dans ce cycle.**
Techniquement justes, stratégiquement hors sujet. Le client se plaint d'incohérence et d'illisibilité ; animer le swap de vue polit un cut que personne n'a reproché, pendant que les dots de requis restent un code à déchiffrer (mon H6 sev 3, que personne ici n'adresse). La loi de Jakob joue aussi contre : une SPA artisanale qui « transitionne » crée une attente d'app native qu'on ne tiendra pas ailleurs. P2 au mieux.

## Je fusionne

**1. « ? » global = cheat-sheet + palette + légende : un seul système d'apprentissage.**
Mon H4 relevait trois systèmes d'aide sans logique ; le power-user veut une cheat-sheet derrière `?` et une palette Ctrl+K. Fusion : le `?` global ouvre un panneau unique — raccourcis, légende des encodages (dots, tri-état des chips : mon H6), syntaxe de recherche — et la palette Ctrl+K expose *les mêmes commandes* avec leurs raccourcis affichés à droite (pattern VS Code : la palette EST le tutoriel des raccourcis). Trois violations (H4-aide, H6-légende, H7-découvrabilité) traitées par un seul objet.

**2. Flux « recopie guidée » (P0-4) + ma save-line H1 : le mode focus comme écran d'état.**
Le mode recopie plein écran du power-user est l'endroit exact où répliquer l'état système que je reprochais de cacher : clé in-game **avec** son mode d'emploi (mon H2 : « où la coller »), jauge 0/18, état de sauvegarde. Le moment de plus forte anxiété (retaper 18 règles) devient le moment de plus forte visibilité. J'y ajoute la contrainte : Entrée = coché → suivante, d'accord, mais avec undo de la coche (Backspace = décocher-revenir).

## Je révise

**Ma violation H3 « dialogue » passe de conditionnelle (sev 2) à confirmée sev 3, et mon correctif était le mauvais.** J'écrivais « Échap/clic-overlay non vérifiables ». L'ingénieur a vérifié : le fond **reste tabbable**, pas de focus trap, Échap bricolé. Je demandais « Échap + × » ; c'était traiter les symptômes. Son `<dialog>`+`showModal()` donne trap, inert, Échap et backdrop d'un coup — je retire mon correctif au profit du sien, et je remonte ce point dans mon TOP 5 à la place du n°5.

**Ma note H7 (1) était trop généreuse.** J'avais audité la *présence* d'accélérateurs (`/`, duplication, export) ; le power-user a audité leur *couverture* : 30 gestes pour un scénario post-patch hebdomadaire, `/` confiné à une vue. La flexibilité de Nielsen se mesure sur les tâches fréquentes, pas sur l'inventaire des features. H7 passe à 2 — en exigeant, voir plus haut, que la réponse reste découvrable.

## Ma colline à défendre

**Aucune fonctionnalité dont la seule porte d'entrée est invisible.** J'accepte tout le modèle de commande du power-user — undo global, palette, sélection multiple, flux Entrée — mais chaque capacité doit avoir au moins un chemin visible ou auto-enseigné (mention à l'écran, tooltip, entrée de palette listant son raccourci). Et son corollaire H4 : **un seul composant par fonction** — un seul sélecteur d'onglets, une seule grammaire de label, un seul système d'aide. Un pro apprend un outil cohérent en une session ; personne n'apprend un outil secret. Là-dessus, je ne bouge pas.
