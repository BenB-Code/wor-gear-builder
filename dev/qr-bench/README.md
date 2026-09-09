# Banc de test de l'encodeur QR maison

`qr.js` est la copie de référence de l'encodeur embarqué dans `index.html`
(mode octets, correction L, versions 1-15, masque 0 fixe). Si l'encodeur de
l'app évolue, reporter le changement ici et rejouer le banc.

```
npm i jsqr
node test.js
```

`test.js` encode des liens d'import réalistes (5 c → ~511 c, v1 → v15), rend
chaque matrice en RGBA (quiet zone 4, échelle 8) et vérifie le décodage via
jsQR. Attendu : `TOUS DÉCODÉS`. La validation initiale a aussi balayé les
longueurs 1..520 par pas de 7 (75/75) et une chaîne UTF-8 accentuée.

Pièges historiques (déjà corrigés, à ne pas réintroduire) :
- bits de FORMAT écrits MSB en premier le long du parcours (`(fmt >> (14-i)) & 1`) —
  l'info de VERSION, elle, reste LSB-first ;
- motifs d'alignement : seuls les 3 coins qui chevauchent les repères se sautent
  (par index), un motif posé sur la ligne de timing est légitime ;
- centres d'alignement v10-13 : le dernier centre vaut taille−7
  ([6,28,50] / [6,30,54] / [6,32,58] / [6,34,62]).
