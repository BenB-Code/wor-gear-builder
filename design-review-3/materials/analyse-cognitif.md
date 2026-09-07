# Analyse cognitive & apprenabilité — WoR Gear Builder (cycle 3)

Angle : charge mentale, mémoire de travail, reconnaissance vs rappel, chemin novice vs expert.
Matière : 9 captures (lots D/E + audit), CSS l.15–560, i18n FR l.800–910. Analyse à froid, sans lecture des reviews précédentes.

---

## P0 — bloquants d'apprenabilité

### 1. La sémantique à 3 états du chip sub n'est apprenable que par la doc
Le clic cycle hors-pool → liste → ★ obligatoire. Les 3 états sont codés par des micro-différences (opacité .28 + tirets / plein / bordure 1.5px + gras + ★) qu'aucun novice ne verbalise, et la légende vit dans un hint dépliable (`hint_rules`) qu'il faut avoir ouvert AVANT de cliquer. C'est du rappel pur : il faut connaître le système pour lire l'écran. Fix : au premier cycle d'un chip, un micro-label éphémère sous le doigt (« dans la liste » / « ★ obligatoire » / « hors liste ») — 3 affichages suffisent, l'utilisateur a appris par l'usage. Les libellés existent déjà dans i18n (`st_ess`, `st_pool`, `st_off`) : ils ne sont montrés nulle part au moment de l'action.

### 2. « Requis » force à simuler l'algorithme de tête
Pour régler le stepper il faut tenir simultanément : taille de la liste, nombre de ★, la règle « le requis se compte sur la liste, ★ incluses », et le seuil. 4 items interdépendants = plafond de mémoire de travail atteint, d'où les warnings (`warn_unplayable`, `warn_eff`) qui corrigent après coup au lieu de prévenir. Fix : une **phrase générée en langage naturel** sous la carte, mise à jour en direct — « Garde une pièce si : set ∈ {4 sets} ET main ATK/HP ET ≥ 4 subs parmi 7, dont obligatoirement DEF% et HP% ». Ça externalise la simulation mentale, ça enseigne la sémantique à chaque lecture, et ça ne coûte rien à l'expert (lecture seule). C'est aussi le socle naturel de la jauge stricte/permissive du backlog.

### 3. Le dialogue « Nouvelle règle » affiche une erreur avant tout geste
`audit-dialog.png` : à l'ouverture, requis=1, liste vide → « requis > liste — injouable » en rouge mono. On punit l'utilisateur avant sa première interaction, et on lui présente ~7 dimensions d'un coup (nom, ensemble, rôles, 30 sets, 11 mains, 11 subs, requis). C'est l'écran qui exige de comprendre TOUT le système avant de faire UNE action. Fix : (a) le warning n'apparaît qu'après première modification du stepper ou de la liste ; (b) révélation progressive à la création — partir d'un template par phase de jeu ou d'une pièce (les deux sont au backlog validé), l'éditeur complet restant l'entrée directe pour l'expert. Jamais de wizard obligatoire : des défauts intelligents, pas des gates.

### 4. Le Testeur inverse la hiérarchie signal/bruit
La vue Couverture ouvre sur 172 410 · 1 767 · 1,02 % · 86 — quatre nombres dont l'app avoue elle-même (dans le hint !) qu'ils ne sont pas le signal : « les deux vrais signaux d'alerte : ne garde rien et doublon ». Or ces verdicts vivent dans la colonne « Lecture », la plus petite (fs-0, mono), tout à droite. Le novice lit 1,02 % et conclut « mes règles sont cassées » ; c'est exactement l'anti-pattern que le texte tente de désamorcer par 4 puces d'explication. Fix : verdict d'abord — un bandeau « ✓ Aucune règle morte · ✓ Aucun doublon » (ou les alertes, en premier), les grands nombres relégués en second plan, et « 1,02 % » remplacé par une lecture ordinale (« très strict », avec le % au survol). Les 2 décimales sont de la fausse précision sur des hypothèses assumées comme telles (`hint_scope` : « hypothèses affichées, pas des vérités »).

### 5. La recopie in-game — le job final — est réduite à une progress-bar de pied de sidebar
« Saisie en jeu 0/18 » + checkbox par règle : la seule tâche qui se fait ÉCRAN CONTRE ÉCRAN (app d'un côté, jeu de l'autre = double tâche, la pire condition de mémoire de travail) n'a aucun mode dédié. Recopier une règle = retenir sets + main + subs + ★ + requis en basculant d'écran : ~10 items. Le « mode recopie guidée » du backlog est LE P0 produit : une règle à la fois, plein écran, typo énorme, ordre de saisie imposé, cocher-suivant. L'app doit devenir un téléprompteur, pas une liste à cocher.

---

## P1 — frictions structurantes

### 6. La logique OU/ET n'est énoncée qu'une fois, puis plus jamais
« Conservée si elle satisfait AU MOINS UNE règle » (lede de Règles) : disjonction entre règles, conjonction dans une règle. C'est le modèle mental fondateur et il n'est rappelé nulle part au moment où il compte (création, verdict). La phrase générée (§2) règle le ET ; pour le OU, le verdict du testeur devrait dire « il suffisait d'une : G5 » quand plusieurs matchent, au lieu du neutre « gardée par ≥ 2 règles » qui laisse croire à un problème.

### 7. Les ids G1/D3 imposent du rappel inter-vues
Retenir « G5 · Heal ATK » vu dans l'échantillon, naviguer vers Règles, scanner la liste : mémoire de travail inter-écrans. Le CSS a déjà `.ruleref` cliquable + `.rule.flash` (atterrissage surligné) — mais les verdicts des cartes échantillon (« ✓ Gardée par G5 · Heal ATK ») semblent en texte mort. Règle simple : **toute mention d'une règle, partout, est un `.ruleref` cliquable**. Reconnaissance remplace rappel, coût quasi nul.

### 8. On explique l'échec, jamais le succès
Les recyclées ont un « pourquoi » riche (`why_main`, `why_ess`, `why_count`, « règles proches — ce qui leur manque »). Les gardées disent juste « Gardée par G6 » sans montrer QUELS subs ont compté. Surligner sur la carte les subs qui matchent (et la ★ satisfaite) transforme chaque pièce gardée en micro-leçon de la sémantique — l'apprentissage par l'exemple que le §1 réclame, gratuit en mode échantillon.

### 9. Mode Échantillon : 6 décisions avant le premier verdict
Onglet + mode + scope + source + niveau + nb pièces avant « Générer » — et l'empty state dit « Choisis un scope puis génère » (séquence à mémoriser). Fix : presets 1-tap (« 1 semaine de farm Raid 1 niv. 21 ») qui compriment 4 choix — c'est exactement la « session de farm 3-taps » du backlog ; les contrôles fins restent dessous pour l'expert. Et Couverture (zéro config, auto-calculée) doit rester le mode d'atterrissage.

### 10. Doubles négations en série
« 0 · règles qui ne gardent rien » : lire un zéro d'une négation = deux inversions mentales pour comprendre que tout va bien. Idem « Sets non couverts (n) — 100 % recyclés », « ne garde rien — à corriger ». Reformuler l'état sain en positif (« Toutes les règles attrapent quelque chose ✓ », « Chaque set est couvert ✓ ») et réserver la forme négative aux vraies alertes. La valence (bon/mauvais) doit être portée par le libellé, pas déduite.

### 11. Le jargon se résout par déplacement, pas sur place
T∞/T2/T1/T0, « pièces anciennes », « main exclu », ATK vs ATK%, « quad » : tout est défini… dans Référence, une navigation plus loin. C'est du rappel institutionnalisé. Le backlog tooltips-jargon est le bon fix ; le prioriser sur les ~6 termes qui bloquent la PREMIÈRE règle (main, sub, ★, requis, tier, set) plutôt que de tooltipper toute la Référence.

### 12. Le chemin du novice n'est pas tracé — mais tout existe déjà
Onglets Démo et End Game pré-remplis : excellents exemples, jamais désignés comme point de départ. Le parcours réel a 3 verbes — construire → tester → recopier — qui mappent les vues. Un onboarding 5 min (backlog) qui dit juste « pars de Démo, ouvre G1, regarde le Testeur, coche quand c'est saisi » suffit ; pas de tour guidé de 12 étapes. Simplifier ainsi ne dégrade rien pour l'expert : c'est un overlay de première visite, pas une structure.

---

## P2 — fond de charge

### 13. Les clés chuchotent, les valeurs crient
Les labels (Rôles, Sets, Main(s), Subs, Requis) — l'ossature d'apprentissage du novice — sont en `--faint` small-caps fs-2, l'élément le plus faible de la carte. L'expert n'en a plus besoin, le novice n'a qu'eux. Remonter d'un cran le contraste des clés dans l'éditeur/carte dépliée ; les small-caps à fs-2 + letterspacing ralentissent aussi la lecture (dys, fatigue).

### 14. Des décisions portées par des toasts éphémères
`t_share_long` : « très long pour ce volume : préfère le fichier JSON » — un conseil d'action dans un message qui disparaît. Ce qui demande une décision doit persister (inline près du bouton Partager), le toast ne confirme que ce qui est déjà fait.

### 15. Nombres non formatés pour la comparaison
Dans « Ce que chaque règle attrape », 36 / 14 / 300 se comparent mal en colonnes de texte ; une micro-barre proportionnelle par ligne donnerait la lecture ordinale en un scan (qui attrape large, qui attrape fin) sans aucun chiffre à interpréter.

---

**Thèse** : l'app documente admirablement son système (hints, Référence, doctrine) mais l'enseigne par la doc, pas par l'usage — elle explique AVANT ou À CÔTÉ, jamais PENDANT. Déplacer l'explication au point d'action (labels d'état au clic, phrase générée, subs surlignés sur les gardées, verdicts en positif) vide la mémoire de travail sans rien retirer à l'expert : tout est additif et en lecture seule.
