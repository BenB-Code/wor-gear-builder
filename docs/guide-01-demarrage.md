# 1 · Premiers pas

## Ouvrir l'app

Rien à installer : ouvre simplement **https://benb-code.github.io/wor-gear-builder/** dans
n'importe quel navigateur, sur PC comme sur mobile. L'app est un unique fichier HTML — tu
peux aussi la télécharger et l'ouvrir en local, elle fonctionne hors ligne.

## L'écran

- **La barre latérale** (menu ☰ sur mobile) navigue entre les quatre pages : **Règles**,
  **Testeur**, **Sets & transfo**, **Référence**.
- En bas de la barre : import JSON, thème clair/sombre, densité d'affichage, langue
  (détectée depuis ton navigateur — le toggle la fige), couleur d'accent, et l'indicateur
  de sauvegarde.
- La barre **« Saisie en jeu »** suit ta progression quand tu recopies tes règles dans le
  builder du jeu (voir [guide 2](guide-02-regles.md#suivre-la-saisie-en-jeu)).

## Créer ton premier ensemble de règles

Un **onglet = un jeu de règles indépendant** (par exemple « Early game », « End game
strict », « Test heals »). Une pièce est **gardée** si elle satisfait au moins une règle de
l'onglet ; tout le reste part au recyclage.

1. Sur la page **Règles**, clique le **＋** à droite de la barre d'onglets pour créer un
   ensemble (ou utilise l'onglet par défaut) ;
2. **Renommer / Dupliquer / Supprimer / Exporter / Partager** agissent sur l'onglet actif ;
3. Le champ **Clé in-game** accueille le code de partage du jeu pour cet ensemble — il
   voyagera avec tes liens de partage (voir [guide 5](guide-05-partage.md)).

> 💡 **Tu préfères partir d'un exemple ?** Ouvre
> [ce lien de partage](https://tinyurl.com/WoR-526bsr) : il importe un set end game
> strict de 36 règles dans un nouvel onglet, sans toucher aux tiens.

## Où vivent tes données

**Tout est stocké localement dans ton navigateur** : pas de compte, pas de serveur, rien
n'est envoyé nulle part. La sauvegarde est automatique (indicateur en bas de la barre
latérale). Conséquences pratiques :

- tes règles ne te suivent pas d'un navigateur à l'autre → utilise **Exporter** (fichier
  JSON) ou **Partager** (lien) pour les transférer ;
- vider les données du site efface tes règles → garde un export JSON des ensembles
  auxquels tu tiens.

---

[Sommaire](README.md) · [Les règles →](guide-02-regles.md)
