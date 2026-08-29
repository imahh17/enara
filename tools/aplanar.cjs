/**
 * Fusiona un PNG con transparencia sobre un color de fondo plano y escribe un
 * PNG opaco (que luego se convierte a JPEG con sips).
 *
 * Por qué: estas ilustraciones en PNG con alfa pesaban 1,8 MB entre las tres.
 * Como las tarjetas tienen un fondo liso conocido, fusionarlas contra ese color
 * da exactamente el mismo resultado en pantalla por una fracción del peso.
 *
 * OJO: esto ata las imágenes al color de fondo de la tarjeta. Si cambia
 * --papiro-alto en el CSS, hay que volver a generar estas imágenes.
 *   node tools/aplanar.cjs entrada.png salida.png "#F3EADC"
 */
const fs = require('fs');
const zlib = require('zlib');

const [, , entrada, salida, colorHex] = process.argv;
const fondo = [1, 3, 5].map((i) => parseInt(colorHex.slice(i, i + 2), 16));

const d = fs.readFileSync(entrada);
const w = d.readUInt32BE(16), h = d.readUInt32BE(20);
const tipo = d[25];
if (tipo !== 6) throw new Error('se esperaba RGBA (tipo 6), llegó tipo ' + tipo);

let i = 8, trozos = [];
while (i < d.length) {
  const largo = d.readUInt32BE(i);
  if (d.toString('ascii', i + 4, i + 8) === 'IDAT') trozos.push(d.subarray(i + 8, i + 8 + largo));
  i += 12 + largo;
}
const cruda = zlib.inflateSync(Buffer.concat(trozos));

const paeth = (a, b, c) => {
  const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
};

const C = 4, anchoLinea = w * C;
let prev = Buffer.alloc(anchoLinea), pos = 0;
const salidaRGB = Buffer.alloc(h * (1 + w * 3));
let o = 0;

for (let y = 0; y < h; y++) {
  const filtro = cruda[pos++];
  const linea = Buffer.from(cruda.subarray(pos, pos + anchoLinea)); pos += anchoLinea;
  for (let x = 0; x < anchoLinea; x++) {
    const a = x >= C ? linea[x - C] : 0, b = prev[x], c = x >= C ? prev[x - C] : 0;
    if (filtro === 1) linea[x] = (linea[x] + a) & 255;
    else if (filtro === 2) linea[x] = (linea[x] + b) & 255;
    else if (filtro === 3) linea[x] = (linea[x] + ((a + b) >> 1)) & 255;
    else if (filtro === 4) linea[x] = (linea[x] + paeth(a, b, c)) & 255;
  }
  salidaRGB[o++] = 0;                               // filtro None
  for (let x = 0; x < w; x++) {
    const p = x * C, alfa = linea[p + 3] / 255;
    for (let ch = 0; ch < 3; ch++) {
      salidaRGB[o++] = Math.round(linea[p + ch] * alfa + fondo[ch] * (1 - alfa));
    }
  }
  prev = linea;
}

const trozo = (nombre, datos) => {
  const cab = Buffer.alloc(4); cab.writeUInt32BE(datos.length);
  const cuerpo = Buffer.concat([Buffer.from(nombre, 'ascii'), datos]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(zlib.crc32 ? zlib.crc32(cuerpo) : crc32(cuerpo));
  return Buffer.concat([cab, cuerpo, crc]);
};
// Node 18 no trae zlib.crc32
let tabla = null;
function crc32(buf) {
  if (!tabla) {
    tabla = new Int32Array(256);
    for (let n = 0; n < 256; n++) { let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
      tabla[n] = c; }
  }
  let c = -1;
  for (let n = 0; n < buf.length; n++) c = tabla[(c ^ buf[n]) & 0xFF] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

fs.writeFileSync(salida, Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]),
  trozo('IHDR', ihdr),
  trozo('IDAT', zlib.deflateSync(salidaRGB, { level: 9 })),
  trozo('IEND', Buffer.alloc(0)),
]));
console.log(`${entrada} -> ${salida}  (${w}x${h}, fusionado sobre ${colorHex})`);
