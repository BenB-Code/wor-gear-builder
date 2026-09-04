# 6 · Référence & données

<div align="center"><img src="captures/reference.png" width="850" alt="Référence et taux de drop"></div>

## La page Référence

C'est la doctrine qui fonde le tri, en blocs dépliables :

- **Lexique** — flats vs %, RR/HE/AS, pièces anciennes… ;
- **Contraintes de main par slot** — arme = ATK, torse = HP, exclusivités CC/AS/RR à
  droite, et leurs conséquences sur l'écriture des règles ;
- **Les budgets saturants** — l'arithmétique qui rend certaines stats mortes en fin de
  jeu, et pourquoi le design des règles en découle ;
- **La doctrine** & **Politique par tier** — quoi garder à chaque étape (early : équiper ;
  late : T1 quad parfait pour la transformation, filet T3, farm T2, T∞ à construire) ;
- **Mécanique de l'outil in-game & pièges** — la sémantique ★/requis confirmée en jeu et
  les chausse-trappes du builder officiel ;
- **Points ouverts** — ce qu'on ne sait pas encore.

## Les taux de drop mesurés

Le premier bloc de la page documente les taux qui alimentent le
[générateur d'échantillon](guide-03-testeur.md#échantillon--la-simulation-de-farm) :

| Source | T∞ | T2 | T1 | Provenance |
|---|---|---|---|---|
| Gear Raid 1 (post-T∞) | ≈ 16,8 % | ≈ 17,4 % | ≈ 65,8 % | 710 runs GR1 niv. 21 cumulés (1 089 pièces) |
| Gear Raid 3 (post-T∞) | ≈ 9,6 % | ≈ 18,2 % | ≈ 72,2 % | 279 runs GR3 niv. 21 cumulés (418 pièces) |
| Gear Raid 2 (sans T∞) | — | ≈ 38 % | ≈ 62 % | ~147 000 runs GR3 niv. 21, pré-T∞ |

Plus les **pièces anciennes** : ≈ 0,87 % des drops de raid — les seules à pouvoir porter
la sub RR sur arme et torse.

Ces chiffres sont des **moyennes mesurées au niveau 21**, appliquées telles quelles à tous
les niveaux. Les donjons et les niveaux où le T0 droppe restent en tirage uniforme, faute
de données.

## Contribuer des données 📊

Les échantillons post-T∞ grossissent (989 runs cumulés à ce jour) mais tout relevé
supplémentaire affine les taux — et le Raid 2 post-T∞ n'a encore aucune mesure. Si tu
farmes en notant tes drops :

1. note **la source et le niveau** (ex. GR3 niv. 21), le **nombre de runs**, et le compte
   de pièces par **tier** (+ les pièces anciennes si tu les repères) ;
2. ouvre une **issue** sur le dépôt avec tes chiffres ;
3. les taux de l'app seront mis à jour — trois endroits synchronisés : le générateur,
   le hint de l'échantillon et cette page.

Toute contribution compte, même 20 runs : c'est en agrégeant qu'on affine.

---

[← Partager & sauvegarder](guide-05-partage.md) · [Sommaire](README.md)
