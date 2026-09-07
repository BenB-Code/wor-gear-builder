# Analyse Growth & Rétention — WoR Gear Builder (cycle 3)

**Angle : activation, boucles d'engagement, moments aha, viralité organique — sans dark pattern.**
Matière : 9 captures (lots D/E, audits, light, mobile) + CSS lignes 15-560 de `wor-regles-tri.html`.

---

## Le funnel tel que je le lis

**Lien Discord → arrivée** : on atterrit sur la vue Règles, onglet démo « End Game | Strict (18) » —
c'est-à-dire sur la **configuration**, pas sur le **résultat**. La liste (G1 Tank, subs, mains, requis)
est du jargon d'expert dense ; la valeur (« ce jeu de règles garde 2,4 % de 2000 drops, voilà pourquoi »)
est à 3-4 clics de là, cachée derrière Testeur → choix d'onglet → choix de mode → Générer.
**Le moment aha de cette app, c'est le verdict** — la carte pièce qui dit « ✓ Gardée par G7 · Dps ATK »,
ou le compteur « 48 gardées / 2000 — 2,4 % ». Il est aujourd'hui à ~60-90 s et 5+ clics d'un nouvel arrivant
qui ne connaît pas le modèle mental « onglet = jeu de règles ». C'est la fuite principale.

Deuxième fuite : « Mes règles 0 ». Le passage démo → appropriation exige d'affronter le dialogue
« Nouvelle règle » (rôles + 30 sets + 11 mains + 11 subs + requis, avec un warning `requis > liste — injouable`) :
une page blanche d'expert. La démo prouve, mais « End Game | Strict » ne ressemble au compte de personne
en early/mid game — elle ne se recopie pas, elle s'admire.

---

## Constats & propositions

### P0 — Activation

**1. Inverser l'atterrissage : montrer le verdict avant la config.**
Première visite = lancer automatiquement une simulation échantillon sur le ruleset démo et afficher
le strip de résultat (« 2 000 drops simulés aux taux mesurés → 48 gardées, le reste recyclé ») avec
2-3 cartes pièces vertes/rouges. L'aha passe de ~90 s à ~5 s, zéro clic. La vue Règles devient l'étape 2
(« comment c'est décidé »), pas la porte d'entrée.

**2. Tuer la page blanche : templates par phase de jeu comme unique chemin de création initial.**
Quand « Mes règles » est vide, remplacer « + Nouvelle règle » par « Partir d'un template »
(Early / Mid / End game — backlog déjà validé) + « Dupliquer la démo ». La démo 18 règles est un bon
vecteur de preuve mais un mauvais vecteur d'appropriation : trop stricte, trop experte. Le template
mid-game à 6-8 règles est le vrai « premier ruleset à moi ».

**3. Faire du lien partagé une landing page, pas un import muet.**
Un lien qui importe est déjà l'actif viral n°1 : chaque post Discord est une porte d'entrée. À l'arrivée
via lien : écran d'aperçu « Ruleset de <pseudo> — 12 règles, garde 1,8 % des drops GR1 » avec mini-couverture,
puis « Adopter » / « Juste regarder ». Sans ça, l'import silencieux écrase ou déroute — et le receveur
ne vit jamais le aha du partageur.

**4. Créer-règle-depuis-pièce : l'éditeur inversé existe déjà à 90 %.**
Le mode « Pièce manuelle » (slot → main → subs → set → « Gardée par / Règles proches — ce qui leur manque »)
est le meilleur onboarding déguisé de l'app. Ajouter « ↳ Créer une règle qui garde cette pièce » referme
la boucle : je décris le drop que je viens d'avoir en jeu → j'ai ma première règle. C'est l'activation
par le réel, pas par l'abstraction.

### P0/P1 — Boucle de partage

**5. La share card PNG doit porter la preuve, pas le titre.**
Sur Discord, une image embed bat un lien nu. La card doit montrer : nom du ruleset, pseudo, nb règles,
% gardé en couverture exhaustive, clé in-game — et le lien d'import en pied. Le « Partager » actuel
(bouton discret à côté d'Exporter) ne donne rien à montrer : on partage quand on est fier d'un chiffre,
donc générer la card **depuis l'écran de résultats du Testeur** (« Partager ce résultat »), pas depuis la liste.

**6. Créditer l'auteur dans le lien = statut honnête, zéro infra.**
Encoder un pseudo optionnel dans le lien court/le JSON. « Ruleset de Khalgar » à l'import et dans la future
bibliothèque : la reconnaissance communautaire est la seule monnaie d'une app gratuite locale, et elle
motive le partage sans aucun dark pattern.

### P1 — Rétention (les cycles du jeu, les silences de l'app)

**7. L'app doit savoir quand le jeu bouge : badge « données patch » + diff de taux.**
Pas d'email, pas de notif — très bien. Substitut honnête : à l'ouverture, si les données embarquées
(sets, taux mesurés) ont changé depuis la dernière visite, un bandeau « Patch X : 2 nouveaux sets,
taux GR1 réévalués » + diff. Et surtout : « ces 2 nouveaux sets ne sont couverts par aucune de tes règles
→ recyclés silencieusement » — c'est une vraie douleur de joueur, donc une vraie raison de revenir.

**8. « Saisie en jeu 0/18 » est le seul mécanisme de retour existant — en faire le fil rouge.**
La jauge sidebar est bien mais passive. La recopie guidée (backlog) doit reprendre où on s'est arrêté :
au retour, « Il te reste 7 règles à saisir — reprendre ». C'est la boucle app→jeu→app la plus courte,
et elle est déjà à moitié construite (checkbox par règle, compteur, barre).

**9. Session de farm = trois boucles en une feature.**
Pendant un farm, je note mes drops → l'app vérifie que mes règles ont gardé ce qu'il fallait (rétention :
raison de revenir chaque session) → l'écart taux observés/taux mesurés alimente la contribution (boucle
communautaire) → un bon résultat se partage (boucle virale). Prioriser cette feature du backlog au-dessus
des cosmétiques : c'est la seule qui capitalise sur le cycle hebdomadaire réel du joueur.

**10. Rendre « 86 gardés par ≥ 2 règles » cliquable : le aha de l'expert.**
Les 4 stat-cards de couverture sont mortes au clic. Le doublon est pourtant LE signal actionnable
(la doc le dit elle-même : « les deux vrais signaux d'alerte »). Cliquer → liste des recouvrements →
j'affine → je relance. C'est la boucle d'itération qui fait revenir l'utilisateur avancé après chaque édit,
et elle ne coûte qu'un drill-down.

### P1/P2 — Contribution & distribution

**11. Le pont app→issue GitHub est trop long pour un public Discord.**
Exiger un compte GitHub coupe ~90 % des contributeurs potentiels. Raccourcir : bouton « Contribuer mes taux »
qui pré-remplit une issue via URL template (données de session déjà formatées) pour ceux qui ont un compte,
**et** un « copier le rapport » formaté à coller dans le canal Discord pour les autres — le dev fait
la saisie GitHub lui-même. Le pipeline de données passe avant la pureté du process.

**12. PWA : proposer l'installation au 2e retour, pas à la 1re visite.**
Le retour hebdo passe par une icône sur l'écran d'accueil du téléphone (le mobile drawer existe déjà).
Un prompt à froid est du bruit ; après une session de farm ou une recopie terminée, « Installer pour
retrouver tes règles d'un tap » est un service rendu.

**13. Instrumenter le funnel sans télémétrie : des liens Discord différenciés.**
100 % local = zéro analytics, donc zéro pilotage. Substitut honnête et gratuit : varier les ancres/params
des liens postés (`#demo`, `#template-mid`, lien d'un ruleset partagé) et regarder ce que les gens citent,
importent et re-partagent sur le serveur. Le canal Discord EST l'outil de mesure du dev solo.

---

## Thèse

L'app a déjà son moteur viral (le lien qui importe, la clé in-game) et son moteur de rétention
(les cycles du jeu : patch, farm, recopie) — mais elle les cache derrière la configuration.
Tout le travail growth consiste à **mettre le verdict avant la règle** : atterrir sur un résultat,
créer depuis une pièce réelle, partager depuis un chiffre dont on est fier, revenir parce que le jeu
a bougé et que l'app l'a remarqué. Aucun de ces leviers n'ajoute une feature lourde : ils réordonnent
ce qui existe.
