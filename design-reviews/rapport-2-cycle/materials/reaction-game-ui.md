# Réaction — game-UI designer (cycle 2, phase débat)

Lu : analyse-architecte-info.md, analyse-interaction.md. Ma grille de lecture reste la même : cette
app doit parler « compagnon de WoR », pas « dashboard » ni « site web ». Je juge chaque proposition
à cette aune.

---

## J'appuie

**AI-5 — « Pièce manuelle » devient la destination Session, mobile-first.** C'est la meilleure idée
structurelle du cycle. Ce que mon angle y ajoute : la Session ne doit pas être un formulaire mobile,
elle doit rendre le drop comme une **carte d'item** (ma proposition 9 : glyphe de slot, main stat en
gros corps mono, subs en colonne, filet coloré au tier). Le joueur vient de looter une pièce in-game ;
l'app doit lui montrer *la même pièce* qui se construit sous ses taps. C'est le code visuel qui fait
la différence entre « je remplis un form » et « je vérifie mon loot » — exactement ce que Fribbels et
Genshin Optimizer ont compris.

**IX-6 — `:active` partout + IX-11 — reduced-motion ≠ reduced-feedback.** J'appuie sans réserve, et
je les revendique comme faisant partie de mon pacte de sobriété : un jeu « répond sous le doigt »
(c'est la moitié du game-feel), et ça ne coûte pas un pixel de décor. Le principe d'IX-11 — « toute
anim porteuse de sens a sa variante immobile » — est la formulation motion de ma règle P0-4 (« la
satisfaction vient de l'état qui change, pas du mouvement »). On tient là une doctrine commune.

**AI-1 — la couverture devient un attribut permanent de la carte de règle.** Code visuel de jeu qui
porte l'idée : c'est le **power rating** affiché sur l'item dans tous les gachas — une valeur de
synthèse toujours visible sur la fiche, jamais dans un écran de calcul à part. `36 profils · 2,14 %`
en mono sur la row-head, verdict ok/alerte en `.ok-txt`/`.warn-txt` : la grammaire existe déjà.

## Je conteste

**IX-1(b) — la règle cochée s'atténue en `opacity .55` + nom barré.** Non. Le texte barré, c'est la
to-do list web ; l'opacité, c'est mon propre grief contre les cartes recyclées (8px muets). Dans un
jeu, une quête accomplie ne se raye pas : elle passe à un état **accompli** — fond `--acc-dim`,
✓ or, ID G1 plein (mon P0-4, état « gravée »). Une règle cochée est une victoire, pas une corvée
purgée. Je garde son pop du ✓ et son compteur flottant 12/18 (excellents), je refuse le barré.

**IX-13 — count-up 300ms sur les gros chiffres du Testeur.** C'est le code des landing pages SaaS et
des dashboards marketing — précisément le « site web » qu'on veut fuir. L'interaction designer le
sent lui-même (« l'outil reste un instrument, pas un slot machine ») mais garde l'anim « au premier
calcul » : je tranche plus dur — jamais. Le moment de résultat, c'est l'arrivée du bandeau verdict
(son IX-3, très juste) ; les valeurs, elles, tombent sèches comme un jet de dés. En revanche son
tint `--off` quand « 0 règle ne garde rien » devient > 0 : oui, c'est du feedback d'alerte, pas du décor.

**AI-6 — découdre « Sets & transfo » entre Référence (faits) et « Angles morts » (audit).** Je
conteste la découpe, pas le diagnostic. Dans un gacha, la page Sets est le **codex** : un set = une
fiche unique (bonus, source de farm, transfo, et — pourquoi pas — sa couverture). Éclater cette
entité sur deux vues trahit le modèle mental du joueur, qui pense « la page du set Crinière d'or »,
comme le wiki in-game. Contre-proposition : une vue Sets unique façon codex, où « angles morts »
est un **tri/filtre par défaut** (non couverts d'abord, tier décroissant) — l'audit devient une
lecture du codex, pas une vue de plus. D'accord en revanche pour tuer le badge « 48 » en nav.

## Je fusionne

**Le quest log « Saisie en jeu » = AI-3 × IX-14 × mon P0-4.** L'architecte prouve que j'avais soigné
la jauge au mauvais endroit : promue 5e destination de nav (AI-3), elle devient le vrai quest log —
liste des règles à l'état gravée/à graver, clé in-game rapatriée là (AI-4), jalons ◆ par groupe,
et l'**unique célébration de l'app** à 18/18 (IX-14 : barre qui passe or, « Jeu de règles gravé en
jeu »). Trois analyses, un seul écran, et le pacte de sobriété tient : une célébration, à l'endroit
qui la mérite.

**La carte d'item vivante = mon P1-9 × AI-5 × IX-8.** Dans la Session, le verdict sticky d'IX-8 ne
doit pas être un bandeau séparé de la pièce : c'est le **cadre de la carte d'item** qui se teinte —
liseré or + « ✓ Gardée par G5 » si gardée, désaturation + ⚒ si recyclée (mon P0-3). Le verdict est
un état de l'objet, pas un message à côté de l'objet. Son cross-fade 140ms + tint 400ms s'applique
tel quel au cadre. Un seul composant porte alors Session, Simulation et la future share card.

## Je révise

**Ma carte d'item monte de P1 à P0.** Je l'avais rangée en « grammaire & hiérarchie » ; l'architecte
démontre qu'elle est le composant central de trois destinations (Session, Simulation, partage) et
l'interaction designer lui donne son comportement (verdict en place, sticky mobile). Ce n'est pas une
finition, c'est une fondation — au même rang que les glyphes de slots qui la composent.

**Mon pacte de sobriété s'étend au mouvement.** Ma liste de refus (P2-13) était purement statique
(« rien qui bouge ou brille pour décorer ») ; j'y intègre les tokens d'IX-7 : 2 durées, 1 easing,
flash = « contenu arrivé », jamais `all`. Une charte unique statique + motion, co-signée.

**Mon P0-4 était mal situé.** J'avais raison sur l'état (« gravée ») et tort sur le lieu (pied de
sidebar) : je suis AI-3, l'état vit dans la destination « Saisie en jeu ».

## Ma colline à défendre

**L'app est un miroir du jeu, pas un jeu.** Concrètement, deux clauses non négociables : (1) les
couleurs de tiers sont un miroir 1:1 de l'écran d'équipement in-game — vérifiées contre le jeu et
figées **avant** tout autre chantier visuel, sinon on bâtit carte d'item, chips ◆ et jauges sur un
encodage faux ; (2) aucun code F2P importé — pas de dégradés or, pas de particules, pas de count-up :
l'ornement est statique et typographique (◆, or, small-caps), le seul mouvement est le feedback
d'action. C'est cette retenue qui rendra l'outil crédible auprès d'une communauté saturée de sites
clinquants — je ne la négocie pas, même contre une « respiration » de 300ms.
