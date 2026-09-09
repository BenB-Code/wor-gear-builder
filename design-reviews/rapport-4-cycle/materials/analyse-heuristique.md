# Audit heuristique — WoR Gear Builder (cycle 4)

Évaluation Nielsen, 10 heuristiques, severity 0-4 (0 = non-problème, 4 = catastrophe utilisabilité).
Matière : 9 captures (Règles, Testeur ×3, Sets, Référence, dialogue, clair, mobile), CSS l.15-560, i18n FR l.800-910.

---

## H1 — Visibilité de l'état du système — **Note : 1**
**Constats positifs.** Sauvegarde matérialisée en continu (`save-line` : « enregistré (local) », « restauré », « session seule » avec pastille couleur) ; progression « Saisie en jeu 0/18 » avec barre ; résultat d'échantillon chiffré (« 48 gardée(s) / 2000 — 2,4 % ») ; filtre actif visible (« Gardées » en surbrillance) ; compteurs partout (nav, onglets, groupes).
**Violations.**
- La save-line est en `--fs-0` (11px) couleur `--faint`, tout en bas de sidebar : l'information la plus rassurante de l'app est la moins visible. En mobile (drawer fermé), elle disparaît totalement. *(sev 2)*
- « restauré » / « session seule » : vocabulaire d'état sans explication au survol — que signifie « session seule » pour un joueur non technicien ? Risque de perte silencieuse. *(sev 2)*
- Le recalcul du Testeur (172 410 profils) n'affiche aucun indicateur de calcul en cours ; sur machine lente, écran figé sans feedback. *(sev 1, à vérifier)*
**Correctifs.** Tooltip explicite sur chaque état de sauvegarde ; état de sauvegarde répliqué dans le header mobile ; spinner/skeleton sur le recalcul de couverture.

## H2 — Correspondance système / monde réel — **Note : 1**
Le lexique (Main, Subs, T∞, GR1, ★) est le jargon **exact** du jeu : pour la cible (joueurs investis), c'est une force, pas une faute — et un « Lexique » dépliable existe en Référence. Les messages sont en langage joueur (« c'est voulu, pas cassé », « rien à mesurer »).
**Violations.**
- « Clé in-game `ODM1OTE=` » : un artefact Base64 présenté sans dire *où* le saisir dans le jeu ni ce qu'il fait. Premier élément sous les onglets, zéro explication in situ. *(sev 2)*
- « Scope », « Couverture », « profils » : vocabulaire d'ingénieur glissé dans une app de joueurs ; « profils possibles » ≠ « pièces » dans la tête d'un joueur. *(sev 1)*
**Correctifs.** Micro-texte sous la clé (« à coller dans l'écran Tri du jeu ») ; renommer « Scope » → « Périmètre du tirage » ou icône « ? » directement adjacente (elle existe, mais après le label, discrète).

## H3 — Contrôle et liberté — **Note : 2**
**Positif.** Undo par toast sur suppressions (`t_tab_del` + `undo:"annuler"`) — mieux que le standard. Duplication avant modification possible. Import = nouvel onglet suffixé « (import) », jamais d'écrasement.
**Violations.**
- L'undo vit **uniquement** dans un toast éphémère : toast raté = 18 règles perdues sans recours. Pas de Ctrl+Z, pas de corbeille. *(sev 3)*
- Dialogue « Nouvelle règle » : aucun « × » de fermeture visible ; Annuler existe mais Échap/clic-overlay non vérifiables dans le code lu — si absents, on est piégé au clavier. *(sev 2, conditionnel)*
- Pas de sortie visible du mode « armé » du bouton Supprimer (`.btn.arm`) : comment désarmer sans cliquer ailleurs ? *(sev 1)*
**Correctifs.** Allonger la durée du toast destructif (8-10 s) + historique d'annulation (dernière suppression restaurable depuis un menu) ; Échap + × sur le dialogue ; désarmement au blur documenté.

## H4 — Cohérence et standards — **Note : 3** ⚠
**Violations.**
- **Le même objet « onglet » a deux représentations** : rangée de pills dans Règles, `<select>` natif dans Testeur et Sets. L'utilisateur doit réapprendre le sélecteur à chaque vue — c'est très probablement la racine du « app jugée incohérente » du client. *(sev 3)*
- Les onglets ressemblent à des boutons (pills identiques aux `.tab-btn` d'outils juste en dessous : Renommer, Dupliquer…) — même forme, deux natures (navigation vs action). Jakob : un onglet se reconnaît à sa ligne d'attache. *(sev 2)*
- Trois systèmes d'aide coexistent : bouton rond « ? », blocs `hint` permanents, panneaux Référence — sans logique discernable de répartition. *(sev 1)*
- Deux patterns d'accordéon (`details.acc` chevron avant, `.rule` chevron après, `.tm-step` chevron après). *(sev 1)*
- Mode clair/sombre : libellé porte l'action cible (« ☀ Mode clair » affiché en sombre) — convention respectée, OK.
**Correctifs.** Un composant sélecteur d'onglet unique partout (les pills, avec compteur) ; différencier visuellement rangée d'onglets et rangée d'outils (ligne d'attache ou fond distinct).

## H5 — Prévention des erreurs — **Note : 2**
**Positif.** Garde « requis > liste — injouable » **en direct** dans le dialogue et sur la carte (`rc-warn`) ; suppression d'onglet en deux temps (pattern « armé » `.btn.arm` rouge) ; « requis effectif n (★ obligatoires) » anticipe l'incompréhension.
**Violations.**
- Le warning « injouable » est affiché mais rien n'indique que « Créer la règle » soit bloqué (capture : bouton toujours plein). Si la création passe, on prévient sans empêcher. *(sev 2)*
- Le stepper Requis sur la carte modifie la règle **sans confirmation ni trace** — un clic de trop sur « + » change silencieusement le tri de tout un set. Pas de dirty state, pas d'annulation locale. *(sev 2)*
- Partage : « lien très long… préfère le fichier JSON » arrive **après** la copie — prévention transformée en constat. *(sev 1)*
**Correctifs.** Désactiver « Créer » tant qu'injouable (avec raison) ; flash + undo sur la modification inline du requis.

## H6 — Reconnaissance plutôt que rappel — **Note : 3** ⚠
**Violations.**
- Meta de ligne repliée : « ATK · HP ●●●●  4 sets ». Les 4 points encodent le requis — **aucune légende**, il faut avoir lu le « ? ». Idem tri-état des chips subs (opacité 0.28 + tirets = hors liste, plein = liste, ★ = obligatoire) : trois états distingués par des nuances d'opacité, à mémoriser. *(sev 3)*
- Les chips grisées `stateoff` à 28 % d'opacité se confondent avec des chips *désactivées* (convention web : grisé = non disponible), alors qu'elles sont cliquables. Contre-affordance. *(sev 2)*
- Codes « G1/D3 » des règles : mnémonique interne (Gauche/Droite ? ensemble 2p/3p ?) jamais expliquée à l'écran. *(sev 1)*
**Correctifs.** Tooltip natif sur les dots (« requis : 4/4 ») ; légende une ligne au-dessus de la première carte ouverte ; distinguer « hors pool » (tiret) de « désactivé » (jamais utilisé ici, donc renforcer le curseur/hover).

## H7 — Flexibilité et efficacité — **Note : 1**
**Positif — au-dessus du standard.** Raccourci « / » vers la recherche (affiché dans le placeholder) ; duplication règle/onglet ; export/import JSON + lien de partage + lien court avec fallback ; densité compacte ; 5 accents ; FR/EN ; tout replier/déplier ; `focus-visible` soigné partout (navigable clavier).
**Violations.**
- « / » est le seul accélérateur ; pas de n/e/d (nouvelle/éditer/dupliquer), pas de navigation clavier entre règles documentée. *(sev 1)*
- Réordonner les règles : drag seul (`.drag`), aucune alternative clavier — bloquant en accessibilité, pénible en mobile tactile. *(sev 2)*
**Correctifs.** Monter/descendre au clavier (flèches sur la poignée focusée) ; deux-trois raccourcis de plus, listés derrière le « ? » global.

## H8 — Esthétique et design minimaliste — **Note : 1**
Direction artistique remarquable et tenue (small-caps Palatino, or sur nuit, thème clair réussi, print view dédiée sobre). Densité maîtrisée avec option compacte. Refus de surcharge globalement respecté : les hints lourds sont dépliables.
**Violations.**
- `--faint` #6f6880 sur #14121a ≈ 3,5:1, utilisé pour des textes de 11 px (labels, save-line, meta) : sous le seuil AA 4.5:1. L'esthétique « estompée » coûte de la lisibilité exactement là où sont les états système. *(sev 2)*
- Vue Règles : 6 zones empilées avant la première règle (onglets, outils, clé, filtres, boutons, titre de groupe) — le contenu principal démarre sous la ligne de flottaison en confort. *(sev 1)*
**Correctifs.** Remonter `--faint` (~#8a8298) ; envisager clé in-game et outils d'onglet repliés par défaut.

## H9 — Aide à la reconnaissance et récupération d'erreurs — **Note : 1**
**Positif.** Messages d'erreur exemplaires : cause précise en langage clair (« JSON illisible », « structure inattendue (pas de liste de règles) », « aucune règle valide dans ce fichier »), fallback actif (« Raccourcisseur injoignable — le lien long a été copié à la place »). Diagnostic testeur : « ne garde rien — sets, mains ou seuil incompatibles : à corriger ou à supprimer » — constat + cause + action.
**Violations.**
- « Téléchargement impossible dans cet environnement » : aucune piste de récupération (quel environnement ? que faire ?). *(sev 1)*
- Les erreurs vivent en toasts éphémères : une erreur d'import ratée n'est ré-affichable nulle part. *(sev 1)*

## H10 — Aide et documentation — **Note : 1**
**Positif.** Aide contextuelle en couches : « ? » ponctuels, hints dépliables, vue Référence complète (lexique, doctrine, contraintes, taux mesurés avec leurs sources et limites — « hypothèses affichées, pas des vérités »). Rare à ce niveau.
**Violations.**
- Pas d'onboarding : premier lancement sur « Mes règles 0 » avec l'écran vide — l'onglet Démo existe mais rien n'y pointe. *(sev 2)*
- Aucune aide sur les raccourcis clavier ni sur le workflow global (Règles → Testeur → saisie → cocher). Le lede le résume, mais une seule fois, en 12 px. *(sev 1)*
**Correctif.** État vide qui propose « Explorer la démo » + « Créer ma première règle » ; entrée « raccourcis » derrière le ?.

---

## TOP 5 des violations (tous critères)

1. **Sélecteur d'onglet incohérent entre vues** (pills vs `<select>` natif) — H4, sev 3. Racine probable du ressenti « incohérent ».
2. **Encodage d'états non légendé** (dots de requis, tri-état des chips par opacité/tirets/★) — H6, sev 3. L'app se lit comme un code à déchiffrer.
3. **Undo uniquement par toast éphémère** sur suppression d'onglet (jusqu'à 18 règles) — H3, sev 3.
4. **Contraste sous AA sur les textes d'état** (`--faint` 11 px ≈ 3,5:1 : save-line, labels, meta) — H8/accessibilité, sev 2-3 pour ce public qui joue de nuit.
5. **Modification inline silencieuse du requis** (stepper sur carte, sans confirmation/undo) + warning « injouable » sans blocage avéré du bouton Créer — H5, sev 2.

## Où l'app dépasse le standard

- **Diagnostics du Testeur** : « ne garde rien » / « doublon », avec pédagogie anti-fausse-alerte (« quelques profils sur des milliers : c'est voulu, pas cassé ») — de l'évaluation heuristique intégrée au produit.
- **Messages système** : erreurs causales en langage clair, fallbacks actifs, honnêteté épistémique sur les taux de drop. Peu d'apps professionnelles font aussi bien.
- **Finitions transverses** : print view dédiée, `prefers-reduced-motion`, `focus-visible` systématique, thème clair réellement retravaillé (pas une inversion), i18n complet à la clé près.

## Verdict global

**2,6 / 4 en moyenne inversée — app solide, au-dessus de la médiane du genre, plombée par un déficit de cohérence de surface (H4) et de reconnaissance (H6)** : les mécaniques profondes sont excellentes, mais l'habillage demande un apprentissage que rien ne guide. Les cinq correctifs du TOP coûtent peu et traitent directement le grief client.
