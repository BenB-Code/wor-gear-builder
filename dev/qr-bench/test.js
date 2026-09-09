"use strict";
const jsQR = require("jsqr");
const { qrEncode } = require("./qr.js");

function decode(qr){
  const scale = 8, quiet = 4;
  const dim = (qr.size + quiet*2) * scale;
  const rgba = new Uint8ClampedArray(dim*dim*4).fill(255);
  for(let r=0;r<qr.size;r++) for(let c=0;c<qr.size;c++){
    if(!qr.get(r,c)) continue;
    for(let dy=0;dy<scale;dy++) for(let dx=0;dx<scale;dx++){
      const y = (r+quiet)*scale+dy, x = (c+quiet)*scale+dx;
      const o = (y*dim+x)*4;
      rgba[o]=0; rgba[o+1]=0; rgba[o+2]=0;
    }
  }

  return jsQR(rgba, dim, dim);
}

const cases = [
  "HELLO",
  "https://benb-code.github.io/wor-gear-builder/",
  "https://benb-code.github.io/wor-gear-builder/#/import=2." + "qAzErTy0123-_".repeat(12),           // ~200 c → ~v8-9
  "https://benb-code.github.io/wor-gear-builder/#/import=2." + "qAzErTy0123-_".repeat(26),           // ~390 c → ~v12-13
  "https://benb-code.github.io/wor-gear-builder/#/import=2." + "qAzErTy0123-_".repeat(35)            // ~500 c → v15
];

let ok = 0;
for(const text of cases){
  const qr = qrEncode(text);
  if(!qr){ console.log(`✗ (${text.length} c) : trop long pour v15`); continue; }
  const res = decode(qr);
  if(res && res.data === text){ console.log(`✓ v${qr.version} · ${text.length} c`); ok++; }
  else console.log(`✗ v${qr.version} · ${text.length} c : ${res ? "décodé ≠ source ("+String(res.data).slice(0,40)+"…)" : "AUCUN décodage"}`);
}
console.log(ok === cases.length ? "TOUS DÉCODÉS" : "ÉCHECS PRÉSENTS");
