# Réaction au débat — Accessibilité cognitive & vulgarisation (cycle 3)

Position de départ : l'app explique AVANT ou À CÔTÉ, jamais PENDANT. Je lis les deux analyses avec cette grille : est-ce que la proposition rapproche l'explication du point d'action, ou est-ce qu'elle ajoute une couche à décoder ?

---

## J'appuie

**Growth §1 — atterrir sur le verdict, pas sur la config.** C'est la meilleure proposition des deux copies, et elle est plus forte que mon propre §12 (onboarding « pars de Démo, ouvre G1 »). Ce que mon angle y ajoute : le verdict n'est pas seulement le *aha* d'activation, c'est le **meilleur support d'apprentissage du modèle mental**. Une carte « ✓ Gardée par G7 » avec les subs qui ont compté surlignés (mon §8) enseigne la sémantique sub/★/requis par l'exemple, sans un mot de doc. L'atterrissage verdict-first fait d'une pierre trois coups : activation, vulgarisation, et il rend mon §4 (verdict avant les gros chiffres) structurel au lieu de cosmétique.

**Growth §4 — créer une règle depuis une pièce réelle.** Cognitivement, c'est du concret-vers-abstrait : le novice ne sait pas remplir « 30 sets, 11 subs, requis », mais il sait décrire le drop qu'il a en main. La pièce joue le rôle d'exemple travaillé (worked example) : chaque champ de la règle naît pré-rempli d'une valeur qu'il vient de VOIR, donc de la reconnaissance, jamais du rappel. C'est aussi la vraie réponse à mon §3 (dialogue qui exige de tout comprendre avant une action).

**Visual §5 — trois familles typographiques, trois rôles étanches.** J'appuie sans réserve : quand le mono signifie « valeur issue du jeu » et rien d'autre, la police devient un canal sémantique gratuit — le novice apprend à lire l'écran par la matière avant de lire les mots. Ça converge avec mon §13 (les clés chuchotent) : rétrograder le mono, c'est mécaniquement remonter les labels. Même appui pour Visual §6 (décaler les accents hors des teintes de tier) : une collision accent/badge T1 est une erreur *sémantique*, pas esthétique — deux sens pour une même teinte, c'est une double négation chromatique.

## Je conteste

**Visual §3 — remplacer ●●●● et surtout le ✓ des checkbox par ◆.** Le canon « 3 usages » (§4 visual) est violé par sa propre spec : identité + métrique + ponctuation + « fait » = quatre sens pour un seul glyphe. Le ✓ est l'un des rares symboles à lecture universelle instantanée ; le remplacer par la marque force chaque utilisateur à réapprendre « ◆ = coché » — du rappel pur, réintroduit là où il n'existait pas. Et des ◆ plein/creux distingués par couleur-vs-bordure à 10px sont moins discriminables que plein/vide sur des ronds (basse vision, écran mobile au soleil pendant un farm). La marque sur les jauges, d'accord ; sur l'état « fait », non négociable : le ✓ reste.

**Visual §11 + §15 — halo intensifié, vignettage bas, grain.** « Une cohérence de matière que l'œil lit sans la nommer », c'est précisément une charge perceptive que l'œil paie sans la nommer. Le vignettage `rgba(0,0,0,.25)` assombrit le bas de l'écran — là où vivent la jauge 0/18 et les pieds de listes — donc dégrade le contraste effectif d'éléments fonctionnels pour un bénéfice d'ambiance. Le grain à opacité .02 est du bruit ajouté au sens strict, et les profils dys/fatigue visuelle le paient en premier. Le liseré interne des cartes (§2) suffit à raconter la lumière zénithale : je prends la grammaire de matière, je refuse la brume.

**Growth §2 — les templates comme « unique chemin de création initial ».** Remplacer « + Nouvelle règle » quand Mes règles est vide, c'est un gate — exactement ce que mon §3 refuse (« des défauts intelligents, pas des gates »). L'expert qui arrive de Discord avec sa règle en tête ne doit jamais devoir passer par un template pour la saisir. Templates **premiers et proéminents**, oui ; éditeur direct toujours visible, même vide, même petit.

## Je fusionne

**« Le verdict comme scène » — growth §1 × visual §7 × mes §4/§7/§8.** L'atterrissage auto-simulé de growth, mis en scène par la cérémonie de verdict de visual (bandeau, ◆ vert, symétrique rouge), portant mes charges pédagogiques : subs gagnants surlignés sur la carte, toute mention de règle en `.ruleref` cliquable, verdicts formulés en positif. Un seul écran devient à la fois le aha d'activation, le moment signature de la DA, et la leçon n°1 du système. Les trois angles financent la même feature — c'est LE P0 commun du cycle.

**« La phrase voyage » — mon §2 × growth §5/§3.** La phrase générée en langage naturel (« Garde une pièce si : set ∈ {…} ET main ATK/HP ET ≥ 4 subs dont ★ DEF% ») ne sert pas qu'à l'éditeur : c'est le contenu idéal de la share card PNG et de la landing d'import. Le receveur Discord lit une phrase, pas un tableau de config — il comprend le ruleset AVANT de l'adopter, et il a appris la sémantique de l'app avant même sa première visite. La vulgarisation devient l'actif viral.

## Je révise

**Mon parcours novice était dans le mauvais ordre.** Mon §12 proposait « construire → tester → recopier » avec Démo comme point de départ — growth démontre que ça atterrit encore sur de la configuration. Je retourne ma copie : **comprendre (verdict auto) → s'approprier (template ou pièce) → recopier**. Le testeur d'abord, l'éditeur ensuite.

**Le wording seul ne suffit pas.** Je traitais la hiérarchie signal/bruit (§4, §10) comme un problème de libellés et d'ordre. Visual §2 me convainc que sur des encarts indiscernables, un verdict reformulé en positif reste un panel parmi d'autres : ma hiérarchie sémantique a besoin de sa hiérarchie de matière (socle/carte/encart éditorial) pour être lue. J'intègre les 3 couches comme prérequis de mes fixes P0.

**Mon micro-label éphémère (§1) assumé comme exception.** Mon propre §14 interdit l'éphémère pour ce qui demande décision ; le label d'état au clic n'en demande aucune (il nomme ce qui vient d'arriver), donc il reste — mais je précise la règle pour éviter qu'on m'oppose ma contradiction : éphémère pour *nommer*, persistant pour *décider*.

## Ma colline à défendre

**Aucune information nécessaire à l'action ne peut être portée uniquement par la couleur, la matière, un glyphe de marque ou un message éphémère — la sémantique du système s'énonce en toutes lettres, au point d'action, en lecture seule, et jamais derrière un gate.** La DA peut tout habiller, le growth peut tout réordonner ; le jour où comprendre l'écran exige d'avoir appris le code (◆ creux vs plein, teinte d'accent, hint replié), on a reperdu le novice qu'on venait de gagner.
