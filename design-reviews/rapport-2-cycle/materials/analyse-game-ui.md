# Analyse — langage visuel jeu & outils compagnons (cycle 2)

Angle : cette app parle-t-elle la langue de Watcher of Realms et de sa communauté gacha ?
Verdict global : **l'app parle "dashboard élégant", pas encore "outil compagnon de WoR"**. La grammaire
gacha (rareté, slots, cartes d'item, boucle de collection) est présente en germe (couleurs de tiers,
chips de sets, coche de saisie) mais jamais exploitée comme un joueur l'attend. Bonne nouvelle :
tout se règle en SVG inline / unicode, zéro dépendance.

---

## P0 — fondations du langage

**1. L'échelle de rareté viole la grammaire gacha universelle — à vérifier contre le jeu, puis figer.**
Le CSS encode `--t4` (T∞) en **vert** (#4ef08a), au-dessus de T3 rouge, T2 or, T1 violet, T0 bleu.
Pour n'importe quel joueur de gacha, vert = uncommon, violet = épique > or ou l'inverse selon le jeu —
mais jamais vert = sommet. Cette app est un outil de **recopie** : son encodage couleur des tiers doit
être un miroir 1:1 de l'écran d'équipement in-game (frames/lueurs du jeu), pas une palette inventée.
Si le jeu dit autre chose que vert pour T∞, on s'aligne ; si c'est bien vert, on le documente dans
Référence ("pourquoi nos couleurs = celles du jeu") pour désamorcer le réflexe.

**2. Zéro glyphe de slot : 5 icônes SVG inline suffisent à transformer le scan.**
Arme / Torse / Bracelet / Collier / Bague ne sont que du texte small-caps (`.p-slot`, tester,
pièce manuelle, référence "contraintes par slot"). Le style existe déjà : les 4 icônes de nav
(stroke 1.6, 15px, currentColor). Dessiner 5 glyphes assortis — épée, plastron, brassard (arc de
cercle + fermoir), amulette (losange pendu), anneau — et les poser devant chaque occurrence de slot.
Dans la grille échantillon (2000 pièces), l'œil trie alors par silhouette avant de lire ; c'est LE
gain de scan le moins cher de toute l'app. Ne PAS iconifier les 11 stats (ATK, DEF%, RR…) : les
sigles mono sont déjà la langue de la communauté (Discord, spreadsheets) — une icône par stat
ajouterait un apprentissage sans gain.

**3. Le verdict gardée/recyclée est le moment de vérité — il est encodé sur 8 pixels.**
`.p-verd-ico` : un point vert ou rouge de 8px, plus `opacity:.72` sur la carte rejetée. Dans un jeu,
garder/détruire un item est une décision cérémonielle (confirmation, éclat, son). Ici : carte gardée
= liseré gauche 3px or (le motif `.key-row`/`.panel.note` existe déjà) + « ✓ Gardée par G5 » ;
recyclée = désaturation actuelle + glyphe ⚒ (U+2692, enclume/forge — cohérent avec "Gear Forge"
déjà présent dans les données) devant « Recyclée ». Le tri visuel Gardées/Recyclées devient
instantané même en vignette.

**4. La boucle cœur (recopier in-game) est enterrée en bas de sidebar.**
« Saisie en jeu 0/18 » + barre de 5px : c'est pourtant LA jauge de progression de l'app, son seul
"collectible". À traiter comme un quest log : la coche d'une règle la fait passer à l'état « gravée »
(fond `--acc-dim`, ✓ or, ID G1 plein au lieu de teinté), la barre gagne un jalon ◆ à chaque groupe
complété, et 18/18 déclenche un état terminé sobre (bordure or de la barre, texte « Jeu de règles
gravé en jeu »). Aucune particule, aucun confetti — la satisfaction vient de l'état qui change.

---

## P1 — grammaire & hiérarchie

**5. Small-caps Palatino partout = hiérarchie plate.** Nav, tabs, labels, summaries, boutons,
noms de règles, `.lab`, `.p-sum`… tout est cérémoniel, donc rien ne l'est. Deux registres :
le serif small-caps réservé aux **titres de vue + noms de règles + noms de sets** (les objets du
monde) ; les **labels d'interface** (Rôles, Sets, Main(s), Subs, Requis, Onglet, Mode, Scope) passent
en mono uppercase `--fs-0` letterspacé — le registre existe déjà dans les `th` de tables. Le monde
médiéval garde sa voix, l'outil retrouve la sienne. Répond directement au grief "polices incohérentes".

**6. L'accent configurable (5 pastilles) dilue l'identité ET percute les tiers.** Accent violet ≈
T1 violet, bleu ≈ T0, rouge ≈ T3, vert ≈ T∞ : quatre des cinq choix rendent l'accent ambigu avec un
encodage sémantique. L'or EST l'identité médiévale de l'app (et la couleur d'accent du jeu lui-même).
Trancher : supprimer le picker, ou le reléguer en easter egg — jamais en réglage de premier niveau.

**7. Le tier d'un set n'est encodé que par une bordure de chip 1px.** `.chip.set.t3` etc. : à 13px,
la teinte de bordure est illisible en périphérie. Préfixer chaque chip set d'un ◆ coloré au tier
(le glyphe brand devient l'encodage de rareté — un « pip » de gemme, version typographique) :
`◆ Crinière d'or`. Daltonisme couvert par le badge T∞/T3/T2 déjà présent dans la table Sets ;
ajouter `title="T3"` sur les chips ailleurs. Un seul glyphe, zéro asset.

**8. Les ●●●● du row-head sont un encodage muet.** Cinq points dont N remplis + « 4 sets » : aucun
joueur ne devine que les points = subs requis. Remplacer par la forme explicite que le mono permet :
`4 subs · 4 sets` (ou une fraction `4/4`), ou garder les points mais les préfixer d'un label mono
`subs`. Un encodage qu'il faut expliquer dans le "?" n'est pas un encodage, c'est une devinette.

**9. Ce que Fribbels (E7/HSR) et Genshin Optimizer font que cette app ne fait pas : rendre la pièce
comme une carte d'item.** Leur force : l'item affiché ressemble à l'item in-game (glyphe slot, main
stat en gros corps, subs en liste hiérarchisée, cadre au tier) → confiance immédiate + screenshots
partagés spontanément sur Discord. Ici la pièce du testeur est un formulaire à chips. Créer un
composant « carte d'item » (glyphe slot P0-2, main stat en `--fs-4` mono, subs en colonne, filet
supérieur coloré au tier du set) réutilisé dans : échantillon, pièce manuelle (aperçu vivant à
droite pendant la saisie), et — gratuitement — la share card du backlog.

**10. Le stepper "pièce manuelle" (grief client) : numéroter en diamants.** Le mix
accordéon/bouton actuel (`.tm-step`) n'a ni ordre ni état. Structure de stepper assumée :
`◆ I Slot → ◆ II Main → ◆ III Subs → ◆ IV Set`, diamant plein = étape renseignée, creux = vide,
or = courante. Chiffres romains : gratuits, lisibles, médiévaux sans clinquant. L'accordéon reste
(le contenu se déplie), seule la tête change — correction locale, pas de refonte.

---

## P2 — finitions & garde-fous

**11. Systématiser ◆ comme signature.** Il est déjà : brand, bullets (`ul.clean`), hint. L'étendre :
état coché du `.chk` (◆ au lieu de ✓), jalons de la barre de progression, marqueur d'onglet actif.
Une app single-file n'a droit qu'à un seul ornement — le sien est bon, qu'il soit partout le même.

**12. La jauge de couverture verte percute T∞ vert.** `.covbar` en dégradé `#3f7d55→--util` : dans
une app où le vert devient (ou reste) une couleur de tier, une jauge verte se lit « du T∞ ». Passer
les jauges neutres (couverture, progression) en or/accent ; réserver vert/rouge aux verdicts
ok/alerte textuels (`.ok-txt`/`.warn-txt`), où ils sont déjà bien employés.

**13. Les codes F2P à NE PAS importer — liste de refus explicite.** Pas de : dégradés or sur
boutons, lueurs/particules, gemmes skeuomorphiques, étoiles multiples, compteurs/FOMO, bannières
d'artwork, faux sons de coffre. La sobriété actuelle (hairlines, panneaux mats, liserés) est un
avantage compétitif face aux sites de tier-lists saturés de pubs. Règle simple : ornement **statique
et typographique** oui (◆, liserés, small-caps), tout ce qui **bouge ou brille** pour décorer, non.
Le seul mouvement autorisé reste le feedback d'action (flash de règle, toast — déjà justes).

**14. « Mes règles 0 » : l'onboarding des outils compagnons, c'est l'exemple.** Un onglet vide doit
offrir 2-3 templates nommés en langue de communauté (« Early game · large », « End game · strict »,
« Farm GR1 ») en un clic — c'est exactement le backlog templates/onboarding, et le pattern de tous
les optimiseurs qui convertissent (presets Fribbels). L'empty state actuel (`.empty`, pointillés)
peut porter les trois boutons sans rien ajouter d'autre.

---

## Synthèse

Le squelette est sain (tokens, tiers, mono pour la donnée, serif pour le monde). Ce qui manque est
un **pacte de fidélité au jeu** : couleurs de tiers = celles du jeu (P0-1), silhouettes de slots
(P0-2), pièce rendue en carte d'item (P1-9), et un **pacte de sobriété** : un seul ornement (◆),
un seul accent (or), deux registres typographiques — le reste est du refus (P2-13).
