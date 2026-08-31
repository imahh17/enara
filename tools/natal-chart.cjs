/**
 * Calcula la carta natal de Enara y la vuelca como JSON.
 * Nacimiento: 29/08/2026 08:03 CEST (06:03 UTC), Hospital de Basurto, Bilbao.
 *
 * Script de un solo uso: su salida se pega en js/data.js. No se sirve en la web.
 *   node tools/natal-chart.cjs
 */
const Astronomy = require('astronomy-engine');

const BIRTH_UTC = new Date(Date.UTC(2026, 7, 29, 6, 3, 0));
const LAT = 43.2634;   // Hospital de Basurto, Bilbao
const LON = -2.9515;

const SIGNOS = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
                'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];

const CUERPOS = [
  ['Sol', Astronomy.Body.Sun], ['Luna', Astronomy.Body.Moon],
  ['Mercurio', Astronomy.Body.Mercury], ['Venus', Astronomy.Body.Venus],
  ['Marte', Astronomy.Body.Mars], ['Júpiter', Astronomy.Body.Jupiter],
  ['Saturno', Astronomy.Body.Saturn], ['Urano', Astronomy.Body.Uranus],
  ['Neptuno', Astronomy.Body.Neptune], ['Plutón', Astronomy.Body.Pluto],
];

const norm = (d) => ((d % 360) + 360) % 360;
const rad = (d) => d * Math.PI / 180;
const deg = (r) => r * 180 / Math.PI;

/** Longitud eclíptica geocéntrica aparente, en grados. */
function longitud(body, date) {
  return Astronomy.Ecliptic(Astronomy.GeoVector(body, date, true)).elon;
}

/** Reparte una longitud eclíptica en signo + grados/minutos. */
function situar(lon) {
  const l = norm(lon);
  const idx = Math.floor(l / 30);
  const dentro = l - idx * 30;
  const gr = Math.floor(dentro);
  let min = Math.round((dentro - gr) * 60);
  if (min === 60) min = 59;
  return { lon: +l.toFixed(4), signo: SIGNOS[idx], signoIndex: idx, grado: gr, minuto: min };
}

// --- Ascendente y Medio Cielo -------------------------------------------------
function oblicuidad(date) {
  const t = (date.getTime() / 86400000 + 2440587.5 - 2451545.0) / 36525; // siglos julianos
  // Serie IAU 1980 para la oblicuidad media (precisión de sobra para esto)
  return 23.439291111 - 0.0130041667 * t - 1.6667e-7 * t * t + 5.02778e-7 * t * t * t;
}

const eps = oblicuidad(BIRTH_UTC);
const gst = Astronomy.SiderealTime(BIRTH_UTC);      // horas siderales en Greenwich
const ramc = norm(gst * 15 + LON);                  // tiempo sidéreo local, en grados

const mcLon = norm(deg(Math.atan2(Math.sin(rad(ramc)), Math.cos(rad(ramc)) * Math.cos(rad(eps)))));
const ascLon = norm(deg(Math.atan2(
  Math.cos(rad(ramc)),
  -(Math.sin(rad(ramc)) * Math.cos(rad(eps)) + Math.tan(rad(LAT)) * Math.sin(rad(eps)))
)));

// --- Planetas -----------------------------------------------------------------
const ayer = new Date(BIRTH_UTC.getTime() - 86400000);
const planetas = CUERPOS.map(([nombre, body]) => {
  const lon = longitud(body, BIRTH_UTC);
  const delta = norm(lon - longitud(body, ayer) + 180) - 180; // movimiento diario con signo
  return { nombre, ...situar(lon), retrogrado: delta < 0 };
});

// --- Nodo lunar verdadero -----------------------------------------------------
let cruce = Astronomy.SearchMoonNode(new Date(BIRTH_UTC.getTime() - 20 * 86400000));
for (;;) {
  const sig = Astronomy.NextMoonNode(cruce);
  if (Math.abs(sig.time.date - BIRTH_UTC) > Math.abs(cruce.time.date - BIRTH_UTC)) break;
  cruce = sig;
}
const nodoLon = longitud(Astronomy.Body.Moon, cruce.time.date);
const nodoNorte = cruce.kind === Astronomy.NodeEventKind.Ascending ? nodoLon : norm(nodoLon + 180);

// --- Casas: signos enteros ----------------------------------------------------
const ascIdx = Math.floor(norm(ascLon) / 30);
const casas = Array.from({ length: 12 }, (_, i) => ({
  numero: i + 1,
  signo: SIGNOS[(ascIdx + i) % 12],
  signoIndex: (ascIdx + i) % 12,
}));
const casaDe = (lon) => (((Math.floor(norm(lon) / 30) - ascIdx) + 12) % 12) + 1;

// --- Aspectos mayores ---------------------------------------------------------
const ASPECTOS = [
  { nombre: 'Conjunción', angulo: 0, orbe: 8 },
  { nombre: 'Sextil', angulo: 60, orbe: 5 },
  { nombre: 'Cuadratura', angulo: 90, orbe: 7 },
  { nombre: 'Trígono', angulo: 120, orbe: 7 },
  { nombre: 'Oposición', angulo: 180, orbe: 8 },
];
const puntos = [...planetas,
  { nombre: 'Ascendente', lon: norm(ascLon) },
  { nombre: 'Medio Cielo', lon: norm(mcLon) }];
const aspectos = [];
for (let i = 0; i < puntos.length; i++) {
  for (let j = i + 1; j < puntos.length; j++) {
    let sep = Math.abs(puntos[i].lon - puntos[j].lon);
    if (sep > 180) sep = 360 - sep;
    for (const a of ASPECTOS) {
      const desvio = Math.abs(sep - a.angulo);
      if (desvio <= a.orbe) {
        aspectos.push({ a: puntos[i].nombre, b: puntos[j].nombre, tipo: a.nombre, orbe: +desvio.toFixed(2) });
        break;
      }
    }
  }
}

const carta = {
  meta: {
    fechaLocal: '2026-08-29T08:03:00+02:00',
    fechaUTC: BIRTH_UTC.toISOString(),
    lugar: 'Hospital de Basurto, Bilbao',
    latitud: LAT, longitud: LON,
    sistemaCasas: 'Signos enteros (whole sign)',
    zodiaco: 'Tropical, eclíptica de la fecha',
    oblicuidad: +eps.toFixed(5),
    tiempoSideralLocal: +ramc.toFixed(4),
  },
  ascendente: situar(ascLon),
  medioCielo: situar(mcLon),
  nodoNorte: situar(nodoNorte),
  planetas: planetas.map((p) => ({ ...p, casa: casaDe(p.lon) })),
  casas,
  aspectos,
};

console.log(JSON.stringify(carta, null, 2));
