/**
 * Genera el diagrama del recorrido del sol del 29/08/2026 en Bilbao.
 *
 * La posición del sol sobre el arco va por tiempo real transcurrido desde el
 * amanecer, no a ojo: por eso queda tan abajo y tan a la izquierda — que es
 * justo lo que cuenta el gráfico.
 *   node tools/arco-solar.cjs
 */
const AMANECER = 7 * 60 + 32;     // 07:32
const OCASO    = 20 * 60 + 52;    // 20:52
const NACE     = 8 * 60 + 30;     // 08:30
const LUZ      = OCASO - AMANECER;

const CX = 290, CY = 190, RX = 225, RY = 150;
const rad = (g) => g * Math.PI / 180;
const f = (v) => +v.toFixed(1);

/** Punto del arco para una fracción del día (0 = amanecer, 1 = ocaso). */
function enArco(frac) {
  const t = rad(180 - frac * 180);
  return [CX + RX * Math.cos(t), CY - RY * Math.sin(t), t];
}

const fracNace = (NACE - AMANECER) / LUZ;
const [sx, sy] = enArco(fracNace);
const [ix, iy] = enArco(0);
const [fx, fy] = enArco(1);

// Marcas de hora sobre el arco.
// Van por la normal real de la elipse, no por el radio desde el centro: si no,
// quedan torcidas justo donde el arco es más curvo.
const marcas = [];
for (let h = 1; h * 60 < LUZ; h++) {
  const [x, y, t] = enArco((h * 60) / LUZ);
  let nx = RY * Math.cos(t), ny = -RX * Math.sin(t);
  const n = Math.hypot(nx, ny); nx /= n; ny /= n;
  const largo = h % 3 === 0 ? 9 : 5.5;
  marcas.push(`<line x1="${f(x)}" y1="${f(y)}" ` +
              `x2="${f(x + nx * largo)}" y2="${f(y + ny * largo)}"/>`);
}

const arcoCompleto = `M ${f(ix)} ${f(iy)} A ${RX} ${RY} 0 0 1 ${f(fx)} ${f(fy)}`;
const arcoAndado   = `M ${f(ix)} ${f(iy)} A ${RX} ${RY} 0 0 1 ${f(sx)} ${f(sy)}`;
// Cuña de día ya transcurrido: del amanecer al sol y de vuelta por el horizonte
const cuna = `${arcoAndado} L ${f(sx)} ${CY} L ${f(ix)} ${CY} Z`;

const rayos = Array.from({ length: 8 }, (_, i) => {
  const a = rad(i * 45 + 11);
  const r1 = 14, r2 = 21;
  return `<line x1="${f(sx + Math.cos(a) * r1)}" y1="${f(sy + Math.sin(a) * r1)}" ` +
         `x2="${f(sx + Math.cos(a) * r2)}" y2="${f(sy + Math.sin(a) * r2)}"/>`;
}).join('\n          ');

console.log(`      <svg class="arco" viewBox="0 0 580 236" role="img"
           aria-label="Diagrama del recorrido del sol el 29 de agosto de 2026 en Bilbao. El sol sale a las 07:32, se pone a las 20:52, y la posición de las 08:30 queda muy cerca del amanecer, a 9,6 grados sobre el horizonte.">
        <defs>
          <linearGradient id="luzDelDia" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stop-color="var(--coral)" stop-opacity=".55"/>
            <stop offset="1" stop-color="var(--melocoton)" stop-opacity="0"/>
          </linearGradient>
        </defs>

        <!-- lo que llevaba de día cuando nació: una cuña mínima -->
        <path class="arco__cuna" d="${cuna}"/>

        <line class="arco__horizonte" x1="34" y1="${CY}" x2="546" y2="${CY}"/>
        <path  class="arco__resto" d="${arcoCompleto}"/>
        <g     class="arco__horas">
          ${marcas.join('\n          ')}
        </g>
        <path  class="arco__andado" d="${arcoAndado}"/>

        <line class="arco__plomada" x1="${f(sx)}" y1="${f(sy)}" x2="${f(sx)}" y2="${CY}"/>

        <g class="arco__sol">
          ${rayos}
          <circle cx="${f(sx)}" cy="${f(sy)}" r="10.5"/>
        </g>

        <g class="arco__guia">
          <path d="M ${f(sx + 16)} ${f(sy - 10)} L 150 96 L 196 96"/>
        </g>
        <text class="arco__hito"  x="204" y="103">08:30</text>

        <text class="arco__borde" x="${f(ix)}" y="${CY + 26}" text-anchor="middle">07:32</text>
        <text class="arco__pie"   x="${f(ix)}" y="${CY + 44}" text-anchor="middle">amanecer</text>
        <text class="arco__borde" x="${f(fx)}" y="${CY + 26}" text-anchor="middle">20:52</text>
        <text class="arco__pie"   x="${f(fx)}" y="${CY + 44}" text-anchor="middle">ocaso</text>
      </svg>`);
