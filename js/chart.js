/**
 * Dibuja la rueda de la carta astral y rellena la tabla de posiciones.
 *
 * Convención del dibujo: como en cualquier carta, el Ascendente queda a la
 * izquierda y las longitudes crecen en sentido antihorario. Con casas por
 * signos enteros, la rueda se alinea al comienzo del signo del Ascendente,
 * y el grado exacto del AC se marca aparte con su propio eje.
 */
(function () {
  'use strict';

  const NS = 'http://www.w3.org/2000/svg';
  const CX = 310, CY = 310;
  const R_EXT = 302, R_SIGNOS = 258, R_CASAS = 214;
  const R_GLIFO = 184, R_GRADO = 154, R_ASPECTOS = 138;

  const norm = (d) => ((d % 360) + 360) % 360;

  /**
   * Los signos y planetas son caracteres Unicode que muchos navegadores pintan
   * como emoji de color. El selector de variación U+FE0E los obliga a usar la
   * forma de texto, que es la que queremos.
   */
  const glifo = (g) => (g && g.length === 1 ? g + '\uFE0E' : g);

  /** Longitud eclíptica → ángulo de dibujo (grados, antihorario desde la derecha). */
  let origen = 0;
  const anguloDe = (lon) => norm(180 + (lon - origen));

  /** Ángulo de dibujo → punto en el SVG. */
  function punto(ang, r) {
    const t = ang * Math.PI / 180;
    return [CX + r * Math.cos(t), CY - r * Math.sin(t)];
  }

  function el(nombre, attrs, texto) {
    const n = document.createElementNS(NS, nombre);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (texto != null) n.textContent = texto;
    return n;
  }

  function circulo(r, clase) {
    return el('circle', { cx: CX, cy: CY, r: r, class: clase });
  }

  function radio(ang, r1, r2, clase) {
    const [x1, y1] = punto(ang, r1), [x2, y2] = punto(ang, r2);
    return el('line', { x1, y1, x2, y2, class: clase });
  }

  /**
   * Separa los glifos que caerían unos encima de otros, conservando su
   * posición real para la marca y la línea de guía.
   */
  function separar(angulos, minimo) {
    const orden = angulos.map((a, i) => ({ i, real: a, disp: a }))
                         .sort((x, y) => x.real - y.real);
    for (let vuelta = 0; vuelta < 60; vuelta++) {
      let movido = false;
      for (let k = 0; k < orden.length; k++) {
        const a = orden[k], b = orden[(k + 1) % orden.length];
        let hueco = norm(b.disp - a.disp);
        if (hueco > 180) continue;              // el salto que cierra el círculo
        if (hueco < minimo) {
          const empuje = (minimo - hueco) / 2;
          a.disp = norm(a.disp - empuje);
          b.disp = norm(b.disp + empuje);
          movido = true;
        }
      }
      if (!movido) break;
    }
    const salida = [];
    orden.forEach((o) => { salida[o.i] = o.disp; });
    return salida;
  }

  const CLASE_ASPECTO = {
    'Conjunción': 'r-aspecto--union',
    'Sextil': 'r-aspecto--armonico',
    'Trígono': 'r-aspecto--armonico',
    'Cuadratura': 'r-aspecto--tenso',
    'Oposición': 'r-aspecto--tenso',
  };

  function dibujar(svg, carta, astro) {
    const { planetas, casas, aspectos, ascendente, medioCielo } = carta;
    origen = Math.floor(norm(ascendente.lon) / 30) * 30;   // arranque del signo del AC

    const g = (clase) => { const x = el('g', clase ? { class: clase } : {}); svg.appendChild(x); return x; };

    // ── Anillos ────────────────────────────────────────────────────────────
    const anillos = g();
    [R_EXT, R_SIGNOS, R_CASAS, R_ASPECTOS].forEach((r) => anillos.appendChild(circulo(r, 'r-anillo')));

    // ── Signos ─────────────────────────────────────────────────────────────
    const gsignos = g();
    for (let i = 0; i < 12; i++) {
      const inicio = anguloDe(origen + i * 30);
      gsignos.appendChild(radio(inicio, R_SIGNOS, R_EXT, 'r-sector'));

      const medio = anguloDe(origen + i * 30 + 15);
      const [x, y] = punto(medio, (R_SIGNOS + R_EXT) / 2);
      const signo = casas[i].signo;                    // casa i+1 = signo i-ésimo desde el AC
      gsignos.appendChild(el('text', { x, y, class: 'r-signo' }, glifo(astro.glifosSigno[signo])));
    }

    // ── Marcas de grado, cada 5° ───────────────────────────────────────────
    const gmarcas = g();
    for (let d = 0; d < 360; d += 5) {
      const ang = anguloDe(origen + d);
      const largo = d % 30 === 0 ? 10 : 5;
      gmarcas.appendChild(radio(ang, R_CASAS, R_CASAS + largo, 'r-marca'));
    }

    // ── Casas ──────────────────────────────────────────────────────────────
    const gcasas = g();
    casas.forEach((casa, i) => {
      gcasas.appendChild(radio(anguloDe(origen + i * 30), R_CASAS, R_SIGNOS, 'r-casa'));
      const [x, y] = punto(anguloDe(origen + i * 30 + 15), R_CASAS + 22);
      gcasas.appendChild(el('text', { x, y, class: 'r-casa-num' }, casa.numero));
    });

    // ── Ejes AC / MC ───────────────────────────────────────────────────────
    const gejes = g();
    [[ascendente.lon, 'AC'], [norm(ascendente.lon + 180), 'DC'],
     [medioCielo.lon, 'MC'], [norm(medioCielo.lon + 180), 'IC']].forEach(([lon, nombre]) => {
      const ang = anguloDe(lon);
      const principal = nombre === 'AC' || nombre === 'MC';
      gejes.appendChild(radio(ang, principal ? R_ASPECTOS : R_CASAS - 14, R_EXT, 'r-eje'));
      const [x, y] = punto(ang, R_EXT + 12);
      gejes.appendChild(el('text', { x, y, class: 'r-etiqueta-eje' }, nombre));
    });

    // ── Aspectos, dentro del círculo central ───────────────────────────────
    const gasp = g();
    const porNombre = {};
    planetas.forEach((p) => { porNombre[p.nombre] = p; });
    aspectos.forEach((a) => {
      const p1 = porNombre[a.a], p2 = porNombre[a.b];
      if (!p1 || !p2) return;                       // los ejes no se cruzan por el centro
      const [x1, y1] = punto(anguloDe(p1.lon), R_ASPECTOS);
      const [x2, y2] = punto(anguloDe(p2.lon), R_ASPECTOS);
      gasp.appendChild(el('line', {
        x1, y1, x2, y2, class: 'r-aspecto ' + (CLASE_ASPECTO[a.tipo] || ''),
      }));
    });

    // ── Planetas ───────────────────────────────────────────────────────────
    const reales = planetas.map((p) => anguloDe(p.lon));
    const mostrados = separar(reales, 9);
    const gplanetas = g();

    planetas.forEach((p, i) => {
      const real = reales[i], disp = mostrados[i];

      // marca en la posición exacta + guía hasta el glifo desplazado
      gplanetas.appendChild(radio(real, R_CASAS - 8, R_CASAS, 'r-marca'));
      const [gx, gy] = punto(real, R_CASAS - 8);
      const [hx, hy] = punto(disp, R_GLIFO + 16);
      gplanetas.appendChild(el('line', { x1: gx, y1: gy, x2: hx, y2: hy, class: 'r-marca' }));

      const [x, y] = punto(disp, R_GLIFO);
      const luz = p.nombre === 'Sol' || p.nombre === 'Luna';
      gplanetas.appendChild(el('text',
        { x, y, class: 'r-planeta' + (luz ? ' r-planeta--luz' : '') },
        glifo(astro.glifosPlaneta[p.nombre])));

      const [tx, ty] = punto(disp, R_GRADO);
      gplanetas.appendChild(el('text', { x: tx, y: ty, class: 'r-grado' },
        p.grado + '°' + (p.retrogrado ? ' ℞' : '')));
    });
  }

  /** Tabla de posiciones bajo la rueda. */
  function tabla(tbody, carta, astro) {
    const filas = [
      { nombre: 'Ascendente', ...carta.ascendente, casa: 1 },
      ...carta.planetas,
      { nombre: 'Medio Cielo', ...carta.medioCielo, casa: '' },
      { nombre: 'Nodo Norte', ...carta.nodoNorte, casa: '' },
    ];

    filas.forEach((f) => {
      const tr = document.createElement('tr');

      const th = document.createElement('th');
      th.setAttribute('scope', 'row');
      th.innerHTML = '<span class="g" aria-hidden="true">' +
        glifo(astro.glifosPlaneta[f.nombre] || '') + '</span>' + f.nombre +
        (f.retrogrado ? '<span class="retro" title="retrógrado">℞</span>' : '');
      tr.appendChild(th);

      [f.signo,
       f.grado + '° ' + String(f.minuto).padStart(2, '0') + '′',
       f.casa || '—'].forEach((valor) => {
        const td = document.createElement('td');
        td.textContent = valor;
        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });
  }

  window.CartaAstral = {
    render() {
      const svg = document.getElementById('rueda');
      const tbody = document.querySelector('#tabla-planetas tbody');
      if (svg) dibujar(svg, DATA.carta, DATA.astro);
      if (tbody) tabla(tbody, DATA.carta, DATA.astro);
    },
  };
})();
