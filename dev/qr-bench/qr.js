"use strict";
/* ── QR maison : mode octets, correction L, versions 1-15, masque 0 fixe.
      Tables v1-15 croisées arithmétiquement (total codewords = data + ec×blocs). ── */
const QR_SPEC = {
  1:{ec:7,  blocks:[[1,19]]},  2:{ec:10, blocks:[[1,34]]},  3:{ec:15, blocks:[[1,55]]},
  4:{ec:20, blocks:[[1,80]]},  5:{ec:26, blocks:[[1,108]]}, 6:{ec:18, blocks:[[2,68]]},
  7:{ec:20, blocks:[[2,78]]},  8:{ec:24, blocks:[[2,97]]},  9:{ec:30, blocks:[[2,116]]},
  10:{ec:18, blocks:[[2,68],[2,69]]}, 11:{ec:20, blocks:[[4,81]]},
  12:{ec:24, blocks:[[2,92],[2,93]]}, 13:{ec:26, blocks:[[4,107]]},
  14:{ec:30, blocks:[[3,115],[1,116]]}, 15:{ec:22, blocks:[[5,87],[1,88]]}
};
const QR_ALIGN = {1:[],2:[6,18],3:[6,22],4:[6,26],5:[6,30],6:[6,34],7:[6,22,38],8:[6,24,42],
  9:[6,26,46],10:[6,28,50],11:[6,30,54],12:[6,32,58],13:[6,34,62],14:[6,26,46,66],15:[6,26,48,70]};

const GEXP = new Uint8Array(512), GLOG = new Uint8Array(256);
(function(){
  let x = 1;
  for(let i=0;i<255;i++){ GEXP[i]=x; GLOG[x]=i; x<<=1; if(x & 0x100) x^=0x11d; }
  for(let i=255;i<512;i++) GEXP[i]=GEXP[i-255];
})();
function gmul(a,b){ return (a && b) ? GEXP[GLOG[a]+GLOG[b]] : 0; }

// Reste de la division par le polynôme générateur de degré `degree` (algorithme classique)
function rsRemainder(data, degree){
  const coefs = new Array(degree).fill(0);
  coefs[degree-1] = 1;
  let root = 1;
  for(let i=0;i<degree;i++){
    for(let j=0;j<degree;j++){
      coefs[j] = gmul(coefs[j], root);
      if(j+1 < degree) coefs[j] ^= coefs[j+1];
    }
    root = gmul(root, 2);
  }
  const res = new Array(degree).fill(0);
  for(const b of data){
    const factor = b ^ res.shift();
    res.push(0);
    for(let j=0;j<degree;j++) res[j] ^= gmul(coefs[j], factor);
  }

  return res;
}

function qrDataCap(v){ let k=0; for(const [n,dk] of QR_SPEC[v].blocks) k += n*dk; return k; }

function bchRemainder(value, gen, genDeg, valDeg){
  // value déjà décalé de genDeg bits ; réduit modulo gen
  for(let bit = valDeg + genDeg - 1; bit >= genDeg; bit--){
    if((value >> bit) & 1) value ^= gen << (bit - genDeg);
  }

  return value;
}
function formatBits(mask){
  const data = (0b01 << 3) | mask;           // niveau L = 01
  const rem = bchRemainder(data << 10, 0b10100110111, 10, 5);

  return ((data << 10) | rem) ^ 0b101010000010010;
}
function versionBits(v){
  const rem = bchRemainder(v << 12, 0b1111100100101, 12, 6);

  return (v << 12) | rem;
}

// Encode `text` (UTF-8) → {size, get(r,c)} ou null si trop long pour v15
function qrEncode(text){
  const bytes = (typeof TextEncoder !== "undefined") ? new TextEncoder().encode(text) : Buffer.from(text, "utf8");
  let v = 0;
  for(let cand=1; cand<=15; cand++){
    const capBits = qrDataCap(cand) * 8;
    const need = 4 + (cand < 10 ? 8 : 16) + bytes.length * 8;
    if(need <= capBits){ v = cand; break; }
  }
  if(!v) return null;
  const spec = QR_SPEC[v];
  const capBytes = qrDataCap(v);

  // flux de bits : mode 0100, longueur, données, terminateur, bourrage
  const buf = [];
  let acc = 0, accN = 0;
  const push = (val, n) => { for(let i=n-1;i>=0;i--){ acc = (acc<<1) | ((val>>i)&1); if(++accN===8){ buf.push(acc); acc=0; accN=0; } } };
  push(0b0100, 4);
  push(bytes.length, v < 10 ? 8 : 16);
  for(const b of bytes) push(b, 8);
  const termBits = Math.min(4, capBytes*8 - (buf.length*8 + accN));
  push(0, termBits);
  if(accN) push(0, 8-accN);
  let padFlip = true;
  while(buf.length < capBytes){ buf.push(padFlip ? 0xEC : 0x11); padFlip = !padFlip; }

  // blocs + correction + entrelacement
  const blocks = [];
  let off = 0;
  for(const [n, dk] of spec.blocks) for(let i=0;i<n;i++){ blocks.push(buf.slice(off, off+dk)); off += dk; }
  const ecs = blocks.map(b => rsRemainder(b, spec.ec));
  const inter = [];
  const maxDk = Math.max(...blocks.map(b=>b.length));
  for(let i=0;i<maxDk;i++) for(const b of blocks) if(i < b.length) inter.push(b[i]);
  for(let i=0;i<spec.ec;i++) for(const e of ecs) inter.push(e[i]);

  // matrice
  const size = 17 + 4*v;
  const M = Array.from({length:size}, () => new Int8Array(size).fill(-1));
  const set = (r,c,val) => { M[r][c] = val ? 1 : 0; };
  const finder = (r0,c0) => {
    for(let dr=-1;dr<=7;dr++) for(let dc=-1;dc<=7;dc++){
      const r = r0+dr, c = c0+dc;
      if(r<0||c<0||r>=size||c>=size) continue;
      if(dr<0||dr>6||dc<0||dc>6){ set(r,c,0); continue; } // séparateur
      const m = Math.max(Math.abs(dr-3), Math.abs(dc-3));
      set(r,c, m<=1 || m===3);
    }
  };
  finder(0,0); finder(0,size-7); finder(size-7,0);
  for(let i=8;i<size-8;i++){
    if(M[6][i]===-1) set(6,i, i%2===0);
    if(M[i][6]===-1) set(i,6, i%2===0);
  }
  const A = QR_ALIGN[v];
  for(let ai=0; ai<A.length; ai++) for(let aj=0; aj<A.length; aj++){
    // seuls les trois coins qui chevauchent les motifs de repère se sautent —
    // un motif d'alignement posé SUR la ligne de timing (coordonnée 6) est légitime
    if((ai===0 && aj===0) || (ai===0 && aj===A.length-1) || (ai===A.length-1 && aj===0)) continue;
    const r0 = A[ai], c0 = A[aj];
    for(let dr=-2;dr<=2;dr++) for(let dc=-2;dc<=2;dc++)
      set(r0+dr, c0+dc, Math.max(Math.abs(dr),Math.abs(dc)) !== 1);
  }
  set(size-8, 8, 1); // module sombre

  // réservation des zones de format (écrites après le masque)
  const fmtPos = [];
  for(let i=0;i<=5;i++) fmtPos.push([8,i]);
  fmtPos.push([8,7],[8,8],[7,8]);
  for(let i=9;i<=14;i++) fmtPos.push([14-i,8]);
  const fmtPos2 = [];
  for(let i=0;i<=6;i++) fmtPos2.push([size-1-i,8]);
  for(let i=7;i<=14;i++) fmtPos2.push([8, size-15+i]);
  for(const [r,c] of [...fmtPos, ...fmtPos2]) if(M[r][c]===-1) M[r][c]=0;

  // info de version (v ≥ 7)
  if(v >= 7){
    const vb = versionBits(v);
    for(let i=0;i<18;i++){
      const bit = (vb >> i) & 1;
      set(size-11 + (i%3), Math.floor(i/3), bit);
      set(Math.floor(i/3), size-11 + (i%3), bit);
    }
  }

  // placement des données en zigzag + masque 0
  const totalBits = inter.length * 8;
  let bi = 0, up = true;
  for(let col=size-1; col>0; col-=2){
    if(col===6) col--;
    for(let k=0;k<size;k++){
      const r = up ? size-1-k : k;
      for(const c of [col, col-1]){
        if(M[r][c] !== -1) continue;
        let bit = bi < totalBits ? (inter[bi>>3] >> (7-(bi&7))) & 1 : 0;
        bi++;
        if(((r+c) & 1) === 0) bit ^= 1; // masque 0
        M[r][c] = bit;
      }
    }
    up = !up;
  }

  // bits de format (masque 0)
  const fmt = formatBits(0);
  for(let i=0;i<15;i++){
    const bit = (fmt >> (14 - i)) & 1; // MSB en premier le long du parcours
    const [r1,c1] = fmtPos[i]; M[r1][c1] = bit;
    const [r2,c2] = fmtPos2[i]; M[r2][c2] = bit;
  }

  return { size, get:(r,c)=>M[r][c]===1, version:v };
}

if(typeof module !== "undefined") module.exports = { qrEncode };
