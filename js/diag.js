/**
 * Modo diagnóstico del hero (?diag=1). No se carga nunca en uso normal.
 *
 * La primera versión medía si la animación iba desfasada respecto al scroll.
 * Las medidas en un iPhone real dijeron que no: Δ 0.0 siempre, incluso en el
 * fotograma del salto. Si la animación sigue al scroll sin desfase y aun así
 * salta, lo que salta es EL SCROLL. Esta versión traza eso.
 *
 * Registra el desplazamiento de scroll de cada fotograma y se CONGELA sola en
 * cuanto encuentra una discontinuidad: un cambio de signo brusco o un salto
 * mucho mayor que los fotogramas vecinos. Congelada se puede fotografiar con
 * calma. Tocando el panel se reinicia.
 */
(function () {
  'use strict';

  const ave  = document.querySelector('.golondrina--der');
  const txt  = document.querySelector('.hero__contenido');
  const hero = document.querySelector('.hero');
  if (!ave || !txt || !hero) return;

  const sonda = document.createElement('div');
  sonda.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:100svh;' +
                        'visibility:hidden;pointer-events:none';
  document.body.appendChild(sonda);

  const panel = document.createElement('pre');
  panel.style.cssText = [
    'position:fixed', 'top:0', 'left:0', 'right:0', 'z-index:99999',
    'margin:0', 'padding:.4rem .5rem',
    'font:600 10px/1.35 ui-monospace,Menlo,monospace',
    'background:#000', 'color:#0f0', 'white-space:pre',
    'text-shadow:none',
  ].join(';');
  document.body.appendChild(panel);

  const tyDe = (el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).f;
  const med  = (xs) => { const o = xs.slice().sort((a, b) => a - b);
                         return o.length ? o[o.length >> 1] : 0; };

  let yAnt, aveAnt, ihAnt, congelado = false, tras = 0;
  let traza = [], cambiosIh = [], saltos = [];
  let picoSinc = 0, picoDAve = 0, heroCambio = '', svhCambio = '', ciego = false;
  let soltado = false, cuadros = 0, fps = 0, t0 = performance.now();
  const ih0 = window.innerHeight, hero0 = hero.offsetHeight, svh0 = sonda.offsetHeight;

  function reiniciar() {
    congelado = false; tras = 0; traza = []; cambiosIh = []; saltos = [];
    picoSinc = 0; picoDAve = 0;
    yAnt = window.scrollY; aveAnt = tyDe(ave); ihAnt = window.innerHeight;
  }
  panel.addEventListener('click', reiniciar);
  addEventListener('touchend',   () => { soltado = true;  }, { passive: true });
  addEventListener('touchstart', () => { soltado = false; }, { passive: true });
  reiniciar();

  function progresoPropio() {
    const a = ave.getAnimations()[0];
    if (!a || a.currentTime == null) return null;
    const t = a.currentTime, d = a.effect.getComputedTiming().duration;
    const tv = (typeof t === 'object' && 'value' in t) ? t.value : t;
    const dv = (typeof d === 'object' && d && 'value' in d) ? d.value : d;
    return dv ? tv / dv : null;
  }

  function medir() {
    const y = window.scrollY, ih = window.innerHeight, svh = sonda.offsetHeight;
    const p = Math.min(1, Math.max(0, y / (svh || 1)));
    const aveY = tyDe(ave);
    const d = y - yAnt, dAve = aveY - aveAnt;

    const ihCambioAhora = ih !== ihAnt;
    if (ihCambioAhora) { cambiosIh.push(Math.round(y)); ihAnt = ih; }
    if (hero.offsetHeight !== hero0) heroCambio = ' ¡' + hero.offsetHeight + '!';
    if (svh !== svh0) svhCambio = ' ¡' + svh + '!';

    const pp = progresoPropio();
    if (pp !== null) picoSinc = Math.max(picoSinc, Math.abs(pp - p));
    picoDAve = Math.max(picoDAve, Math.abs(dAve));

    if (!congelado) {
      traza.push({ d: Math.round(d), y: Math.round(y), raro: false });
      if (traza.length > 22) traza.shift();

      // Vecinos anteriores, sin contar el fotograma actual.
      const prev = traza.slice(-8, -1).map((f) => Math.abs(f.d)).filter((v) => v > 0);
      const m = med(prev);
      const ultimoSigno = (() => {
        for (let i = traza.length - 2; i >= 0; i--) if (traza[i].d !== 0) return Math.sign(traza[i].d);
        return 0;
      })();

      const reversion = ultimoSigno !== 0 && Math.sign(d) !== 0 &&
                        Math.sign(d) !== ultimoSigno && Math.abs(d) >= 15;
      const desmedido = Math.abs(d) >= 25 && m > 0.5 && Math.abs(d) >= 4 * m;

      if (traza.length > 8 && (reversion || desmedido)) {
        traza[traza.length - 1].raro = true;
        saltos.push({
          d: Math.round(d), y: Math.round(y), dAve: dAve.toFixed(1),
          ih: ihCambioAhora,
          tipo: reversion ? 'reversión' : 'desmedido',
          soltado: soltado,
        });
        congelado = true;
      }
    } else if (tras < 4) {                     // unos pocos fotogramas más de cola
      tras++;
      traza.push({ d: Math.round(d), y: Math.round(y), raro: false });
    }

    yAnt = y; aveAnt = aveY;

    cuadros++;
    const dt = performance.now() - t0;
    if (dt > 500) { fps = Math.round(cuadros * 1000 / dt); cuadros = 0; t0 += dt; }

    // Si el progreso avanza pero ningún fotograma registra desplazamiento, el
    // hilo principal no está viendo el scroll y esta traza no vale para nada.
    if (traza.length > 12 && traza.every((f) => f.d === 0) && p > 0.02) ciego = true;

    const s = saltos[0];
    panel.textContent =
      'scroll ' + Math.round(y) + '   progreso ' + p.toFixed(3) + '   fps ' + fps + '\n' +
      'svh ' + svh0 + svhCambio + '   ih ' + ih0 + '→' + ih +
        '   cambios ' + cambiosIh.length + (cambiosIh.length ? ' @' + cambiosIh.join(',') : '') + '\n' +
      'hero ' + hero0 + heroCambio + '   sinc ' + picoSinc.toFixed(3) +
        '   ave/frame máx ' + picoDAve.toFixed(1) + 'px\n' +
      '── Δscroll por fotograma ──\n' +
      traza.map((f) => (f.raro ? '[' + f.d + ']' : String(f.d))).join(' ') + '\n' +
      (s
        ? '■ SALTO ' + s.d + 'px @ scroll ' + s.y + '  (' + s.tipo + ')\n' +
          '  el ave se movió ' + s.dAve + 'px de golpe\n' +
          '  la barra cambió ese frame: ' + (s.ih ? 'SÍ' : 'no') +
            '   tras soltar: ' + (s.soltado ? 'SÍ' : 'no') + '\n' +
          'CONGELADO · toca el panel para reiniciar'
        : (ciego
          ? '⚠ Δscroll = 0 en todos los fotogramas mientras el progreso\n' +
            '  cambia: el hilo principal NO ve este scroll (scroll\n' +
            '  asíncrono de iOS). Desde aquí el salto es invisible.'
          : 'sin saltos aún · sigue haciendo scroll'));

    requestAnimationFrame(medir);
  }
  requestAnimationFrame(medir);
})();
