/**
 * Modo diagnóstico del hero (?diag=1). No se carga nunca en uso normal.
 *
 * Mide, en cada fotograma, dónde ESTÁ cada elemento animado del hero frente a
 * dónde LE TOCARÍA estar según el scroll, y se queda con los picos. Así un
 * único pantallazo, tomado después de un flick natural, dice si el salto es:
 *
 *   · un retraso de la animación que luego se pone al día  → Δ grande
 *   · un cambio de altura del hero (relayout)              → "hero" cambia
 *   · la barra de direcciones moviendo el viewport         → "ih" cambia
 *   · la animación que ni siquiera está enganchada         → "anims 0"
 */
(function () {
  'use strict';

  const ave = document.querySelector('.golondrina--der');
  const txt = document.querySelector('.hero__contenido');
  const hero = document.querySelector('.hero');
  if (!ave || !txt || !hero) return;

  // El rango de las animaciones es 100svh. Se mide con una sonda real en vez
  // de suponerlo, porque es justo el valor del que se sospecha.
  const sonda = document.createElement('div');
  sonda.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:100svh;' +
                        'visibility:hidden;pointer-events:none';
  document.body.appendChild(sonda);

  const panel = document.createElement('pre');
  panel.style.cssText = [
    'position:fixed', 'top:0', 'left:0', 'right:0', 'z-index:99999',
    'margin:0', 'padding:.5rem .6rem',
    'font:600 11px/1.45 ui-monospace,Menlo,monospace',
    'background:#111', 'color:#0f0', 'white-space:pre',
    'pointer-events:none', 'text-shadow:none',
  ].join(';');
  document.body.appendChild(panel);

  const tyDe = (el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).f;

  /* La misma curva que el CSS, para que "toca" siga siendo comparable. */
  function curva(t) {
    const x1 = 0.7, y1 = 0, x2 = 1, y2 = 1;
    let lo = 0, hi = 1, sm = 0.5;
    for (let i = 0; i < 30; i++) {
      sm = (lo + hi) / 2;
      const x = 3 * (1 - sm) ** 2 * sm * x1 + 3 * (1 - sm) * sm * sm * x2 + sm ** 3;
      if (x < t) lo = sm; else hi = sm;
    }
    return 3 * (1 - sm) ** 2 * sm * y1 + 3 * (1 - sm) * sm * sm * y2 + sm ** 3;
  }

  /* Medida independiente de la curva: ¿en qué punto de su recorrido CREE la
     animación que está, comparado con el que le toca por el scroll? Si esto
     se desfasa, el problema es de sincronía y no de keyframes. */
  function progresoPropio() {
    const a = ave.getAnimations()[0];
    if (!a) return null;
    const t = a.currentTime;
    if (t == null) return null;
    const v = (typeof t === 'object' && 'value' in t) ? t.value : t;
    const d = a.effect.getComputedTiming().duration;
    const dv = (d && typeof d === 'object' && 'value' in d) ? d.value : d;
    return (dv ? v / dv : null);
  }

  const ih0 = window.innerHeight;
  const hero0 = hero.offsetHeight;
  let svh0 = sonda.offsetHeight;

  let picoAve = 0, picoTxt = 0, picoSinc = 0, scrollDelPico = 0, traSoltar = false;
  let heroCambio = '', ihCambio = '', svhCambio = '';
  let soltado = false, cuadros = 0, fps = 0, t0 = performance.now();

  addEventListener('touchend', () => { soltado = true; }, { passive: true });
  addEventListener('touchstart', () => { soltado = false; }, { passive: true });

  function medir() {
    const y = window.scrollY;
    const svh = sonda.offsetHeight;
    const rango = svh || 1;
    const p = Math.min(1, Math.max(0, y / rango));

    // Lo que dicen los keyframes: ave -82% de su alto, texto +22% del suyo.
    const e = curva(p);          // progreso ya pasado por la curva
    const aveEsp = e * -0.82 * ave.offsetHeight;
    const txtEsp = e *  0.22 * txt.offsetHeight;
    const opaEsp = 1 + e * (0.15 - 1);

    const aveReal = tyDe(ave);
    const txtReal = tyDe(txt);
    const opaReal = parseFloat(getComputedStyle(txt).opacity);

    const dAve = Math.abs(aveReal - aveEsp);
    const dOpa = Math.abs(opaReal - opaEsp);

    if (dAve > picoAve) { picoAve = dAve; scrollDelPico = Math.round(y); traSoltar = soltado; }
    if (dOpa > picoTxt) picoTxt = dOpa;

    if (hero.offsetHeight !== hero0) heroCambio = ' ¡CAMBIÓ a ' + hero.offsetHeight + '!';
    if (window.innerHeight !== ih0)  ihCambio   = '→' + window.innerHeight;
    if (svh !== svh0)                svhCambio  = ' ¡CAMBIÓ a ' + svh + '!';

    cuadros++;
    const dt = performance.now() - t0;
    if (dt > 500) { fps = Math.round(cuadros * 1000 / dt); cuadros = 0; t0 += dt; }

    const pp = progresoPropio();
    if (pp !== null && Math.abs(pp - p) > picoSinc) picoSinc = Math.abs(pp - p);

    if (cuadros % 6 === 0) {
      const n = (v, d) => v.toFixed(d);
      panel.textContent =
        'scroll ' + Math.round(y) + '   toca ' + n(p, 3) +
          '   cree ' + (pp === null ? '?' : n(pp, 3)) + '   fps ' + fps + '\n' +
        'svh ' + svh0 + svhCambio + '   ih ' + ih0 + ihCambio + '\n' +
        'hero ' + hero0 + heroCambio + '\n' +
        'ave  real ' + n(aveReal, 1) + '  toca ' + n(aveEsp, 1) + '   Δ ' + n(dAve, 1) + '\n' +
        'opa  real ' + n(opaReal, 2) + '  toca ' + n(opaEsp, 2) + '   Δ ' + n(dOpa, 2) + '\n' +
        'PICOS  Δave ' + n(picoAve, 1) + 'px   Δopa ' + n(picoTxt, 2) +
          '   Δsinc ' + n(picoSinc, 3) + '\n' +
        '       en scroll ' + scrollDelPico + '   tras soltar: ' + (traSoltar ? 'SÍ' : 'no') + '\n' +
        'anims ' + document.getAnimations().filter((a) => a.timeline &&
                     a.timeline.constructor.name.indexOf('Scroll') >= 0).length +
        ' ligadas al scroll  ·  ' + document.getAnimations().length + ' totales';
    }
    requestAnimationFrame(medir);
  }
  requestAnimationFrame(medir);
})();
