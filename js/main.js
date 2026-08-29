/**
 * Enara · montaje del contenido y animaciones.
 *
 * Todo el contenido se pinta desde DATA. Las animaciones son un añadido:
 * si GSAP no carga o el usuario pide menos movimiento, la página se ve igual,
 * solo que quieta.
 */
(function () {
  'use strict';

  const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hayGsap = typeof window.gsap !== 'undefined';
  const $  = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  /* ══════════════════ Contenido ══════════════════ */

  const lista = (clave, html) => {
    const nodo = $('[data-lista="' + clave + '"]');
    if (nodo) nodo.innerHTML = html;
  };

  function pintar() {
    lista('simbolos', DATA.nombre.simbolos
      .map((s) => `<li><h3>${s.titulo}</h3><p>${s.texto}</p></li>`).join(''));

    const c = DATA.clima;
    const cifras = [
      { n: c.tempAlNacer, suf: '°C', dec: 1, txt: 'Al nacer' },
      { n: c.nubes,       suf: '%',  dec: 0, txt: 'De nubes' },
      { n: c.lluvia,      suf: 'mm', dec: 0, txt: 'De lluvia' },
      { n: c.tempMaxima,  suf: '°C', dec: 1, txt: 'Máxima del día' },
      { n: c.humedad,     suf: '%',  dec: 0, txt: 'De humedad' },
      { n: c.viento,      suf: 'km/h', dec: 1, txt: 'De viento' },
    ];
    lista('cifras', cifras.map((f) =>
      `<li><b data-contar="${f.n}" data-dec="${f.dec}" data-suf="${f.suf}">${
        f.n.toLocaleString('es-ES', { minimumFractionDigits: f.dec })}${f.suf}</b><span>${f.txt}</span></li>`
    ).join(''));

    // El marco recorta y la imagen de dentro se encuadra y se acerca. El origen
    // del zoom es el mismo punto que el encuadre, para que al acercar no se
    // escape lo que importa de la foto.
    const retratoDe = (e) => {
      if (!e.foto) return '';
      const foco = e.foco || '50% 30%';
      return `<span class="retrato"><img src="${e.foto}" alt="${e.alt || ''}" loading="lazy"
        decoding="async" style="object-position:${foco};transform-origin:${foco}
        ;transform:scale(${e.zoom || 1})${e.ajuste ? ';object-fit:' + e.ajuste : ''}${
          e.tono ? ';filter:' + e.tono : ''}"></span>`;
    };

    lista('nacidos', DATA.efemerides.nacidos.map((e) =>
      `<li><b>${e.año}</b>${retratoDe(e)}<span><strong>${e.quien}</strong>${e.que}</span></li>`
    ).join(''));

    lista('hechos', DATA.efemerides.hechos.map((e) =>
      `<li><b>${e.año}</b>${retratoDe(e)}<span>${e.que}</span></li>`
    ).join(''));

    lista('capsula', DATA.capsula2026.map((t) => {
      const ilustracion = t.foto
        ? `<img class="ilustracion" src="${t.foto}" alt="${t.alt || ''}" loading="lazy" decoding="async">`
        : '';
      return `<li>${ilustracion}<p class="etiqueta">${t.etiqueta}</p>` +
             `<h3>${t.titulo}</h3><p>${t.texto}</p></li>`;
    }).join(''));

    // La imagen cierra la ficha, debajo del párrafo.
    lista('curiosidades', DATA.curiosidades.map((t) =>
      `<li><span class="dato">${t.dato}</span><h3>${t.titulo}</h3>` +
      `<p>${t.texto}</p>${retratoDe(t)}</li>`).join(''));

    $$('[data-texto]').forEach((n) => { n.textContent = DATA.cielo[n.dataset.texto].texto; });

    // Pilares de la carta: el texto es interpretación, los grados son cálculo.
    const busca = (clave) => clave === 'Ascendente'
      ? DATA.carta.ascendente
      : DATA.carta.planetas.find((p) => p.nombre === clave);

    lista('pilares', DATA.astro.pilares.map((p) => {
      const pos = busca(p.clave);
      const g = DATA.astro.glifosPlaneta[p.clave];
      return `<li><span class="glifo" aria-hidden="true">${g.length === 1 ? g + '\uFE0E' : g}</span>
        <p class="grados">${pos.grado}° ${String(pos.minuto).padStart(2, '0')}′ de ${pos.signo}</p>
        <h3>${p.titulo}</h3><p>${p.texto}</p></li>`;
    }).join(''));

    lista('notas', DATA.astro.notas.map((n) => `<li>${n}</li>`).join(''));

    if (window.CartaAstral) CartaAstral.render();
  }

  /**
   * Siembra el campo de estrellas. El generador lleva semilla fija: el cielo
   * sale idéntico en cada carga, no baila entre visitas.
   */
  const enMovil = () => window.matchMedia('(max-width: 47.99rem)').matches;

  function sembrarEstrellas() {
    // En una pantalla de móvil el mismo número de estrellas queda apelmazado,
    // porque caben en mucha menos superficie. Ahí van a la mitad.
    const factor = enMovil() ? 0.5 : 1;

    $$('[data-estrellas]').forEach((caja, n) => {
      const total = Math.round((parseInt(caja.dataset.estrellas, 10) || 0) * factor);
      let semilla = 20260829 + n * 7919;
      const rnd = () => (semilla = (semilla * 1103515245 + 12345) % 2147483648) / 2147483648;

      let html = '';
      for (let i = 0; i < total; i++) {
        const x = rnd() * 100;
        const y = rnd() * 100;
        // Sesgado a estrellas pequeñas: unas pocas grandes y muchas de fondo.
        const tam = 4 + Math.pow(rnd(), 2.4) * 26;
        // Las grandes van más suaves: si no, una estrella gorda justo detrás
        // de una letra se lee como una mancha.
        let op = (0.22 + rnd() * 0.68) * (1 - ((tam - 4) / 26) * 0.4);
        // En la sección del atardecer el cielo aún tiene luz arriba: allí las
        // estrellas se apagan, como pasa de verdad al anochecer.
        if (caja.dataset.desvanece === 'arriba') op *= Math.pow(y / 100, 1.5);

        html += '<svg class="estrella" viewBox="0 0 60 101" width="' + tam.toFixed(1) + '"'
          + ' style="left:' + x.toFixed(2) + '%;top:' + y.toFixed(2) + '%'
          + ';--op:' + op.toFixed(3)
          + ';--dur:' + (2.6 + rnd() * 4.8).toFixed(2) + 's'
          + ';--retardo:-' + (rnd() * 7).toFixed(2) + 's">'
          + '<use href="#estrella-forma"/></svg>';
      }
      caja.innerHTML = html;
    });
  }

  /**
   * Escala ENARA para que ocupe justo el ancho disponible, en cualquier pantalla.
   * Se mide con un Range porque el texto no desborda su caja en escritorio y
   * scrollWidth mentiría.
   */
  function ajustarNombre() {
    const nodo = $('.hero__nombre');
    if (!nodo) return;
    const caja = nodo.parentElement;
    const estilo = getComputedStyle(caja);
    const disponible = caja.clientWidth
      - parseFloat(estilo.paddingLeft) - parseFloat(estilo.paddingRight);

    const BASE = 200;
    nodo.style.fontSize = BASE + 'px';
    const rango = document.createRange();
    rango.selectNodeContents(nodo);
    const ancho = rango.getBoundingClientRect().width;
    if (!ancho) { nodo.style.fontSize = ''; return; }

    // El nombre lo limita el ancho, pero también la altura: en pantallas
    // anchas y bajas, si solo mandara el ancho, ENARA se comería el hero.
    const porAncho  = BASE * (disponible * 0.98) / ancho;
    const porAlto   = window.innerHeight * 0.32;
    nodo.style.fontSize = Math.min(porAncho, porAlto, 272) + 'px';
  }

  /** Parte un texto en letras animables sin perder el texto para el lector de pantalla. */
  function partir(nodo) {
    const texto = nodo.textContent;
    if (!nodo.getAttribute('aria-label')) nodo.setAttribute('aria-label', texto);
    nodo.textContent = '';
    const letras = [];
    for (const ch of texto) {
      const s = document.createElement('span');
      s.className = 'l';
      s.setAttribute('aria-hidden', 'true');
      s.textContent = ch === ' ' ? ' ' : ch;
      nodo.appendChild(s);
      if (ch !== ' ') letras.push(s);
    }
    return letras;
  }

  /* ══════════════════ Animaciones ══════════════════ */

  function animar() {
    gsap.registerPlugin(ScrollTrigger);

    /* — Hero: el nombre entra letra a letra — */
    const nombre = $('[data-partir]');
    const letras = partir(nombre);
    gsap.from(letras, {
      yPercent: 115, opacity: 0, duration: 1.15, ease: 'power4.out',
      stagger: 0.055, delay: 0.15,
    });

    gsap.from('.hero__pie', { opacity: 0, y: 14, duration: 1, delay: 0.85, ease: 'power2.out' });
    gsap.from('.hero__scroll', { opacity: 0, duration: 1, delay: 1.6 });

    /* — Hero: BIENVENIDA / WELCOME / ONGI ETORRI en bucle — */
    const cajas = $$('[data-saludo]');
    const saludos = cajas.map(partir);
    gsap.set(cajas, { opacity: 1 });            // el CSS solo dejaba ver el primero
    gsap.set(saludos.flat(), { opacity: 0, yPercent: 60 });

    const bucle = gsap.timeline({ repeat: -1, delay: 0.5 });
    saludos.forEach((grupo, i) => {
      const t = i * 3.1;
      bucle.to(grupo, { opacity: 1, yPercent: 0, duration: 0.5,
                        ease: 'power3.out', stagger: 0.028 }, t);
      bucle.to(grupo, { opacity: 0, yPercent: -60, duration: 0.42,
                        ease: 'power2.in', stagger: 0.022 }, t + 2.25);
    });

    /* — Hero: las golondrinas aparecen por los lados… — */
    gsap.from('.golondrina--izq .golondrina__ave',
      { xPercent: -260, yPercent: 45, rotate: -12, opacity: 0,
        duration: 2.1, ease: 'power3.out', delay: 0.35 });
    gsap.from('.golondrina--der .golondrina__ave',
      { xPercent: 300, yPercent: -40, rotate: 10, opacity: 0,
        duration: 2.3, ease: 'power3.out', delay: 0.6 });

    /* — …y siguen volando con el scroll — */
    const conElScroll = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 };

    gsap.to('.golondrina--izq', {
      xPercent: 62, yPercent: -95, rotate: -9, ease: 'none',
      scrollTrigger: conElScroll,
    });
    gsap.to('.golondrina--der', {
      xPercent: -78, yPercent: -150, rotate: 7, ease: 'none',
      scrollTrigger: conElScroll,
    });

    /* — Parallax del paisaje: se queda algo atrás respecto a la página — */
    gsap.to('.hero__paisaje', { yPercent: 11, ease: 'none', scrollTrigger: conElScroll });
    gsap.to('.hero__contenido',      { yPercent: 22, opacity: 0.15, ease: 'none',
                                       scrollTrigger: conElScroll });

    /* — Entradas de sección — */
    $$('[data-anim]').forEach((nodo) => {
      gsap.fromTo(nodo, { opacity: 0, y: 26 }, {
        opacity: 1, y: 0, duration: 0.9, ease: 'power2.out',
        scrollTrigger: { trigger: nodo, start: 'top 85%' },
      });
    });

    $$('[data-lista]').forEach((nodo) => {
      gsap.fromTo(nodo.children, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.09,
        scrollTrigger: { trigger: nodo, start: 'top 88%' },
      });
    });

    /* — Contadores — */
    $$('[data-contar]').forEach((nodo) => {
      const fin = parseFloat(nodo.dataset.contar);
      const dec = parseInt(nodo.dataset.dec, 10);
      const suf = nodo.dataset.suf;
      const v = { n: 0 };
      gsap.to(v, {
        n: fin, duration: 1.4, ease: 'power2.out',
        scrollTrigger: { trigger: nodo, start: 'top 92%' },
        onUpdate() {
          nodo.textContent = v.n.toLocaleString('es-ES', {
            minimumFractionDigits: dec, maximumFractionDigits: dec,
          }) + suf;
        },
      });
    });

    /* — El sol recorre su arco — */
    const andado = $('.arco__andado');
    if (andado) {
      const largo = andado.getTotalLength();
      const disparo = { trigger: '.arco', start: 'top 82%' };

      gsap.fromTo(andado, { strokeDasharray: largo, strokeDashoffset: largo },
        { strokeDashoffset: 0, duration: 1.1, ease: 'power2.out', scrollTrigger: disparo });
      gsap.from('.arco__cuna', { scaleX: 0, transformOrigin: 'left center',
        duration: 1.1, ease: 'power2.out', scrollTrigger: disparo });
      gsap.from('.arco__sol', { scale: 0, opacity: 0, transformOrigin: 'center',
        svgOrigin: andado.getPointAtLength(largo).x + ' ' + andado.getPointAtLength(largo).y,
        duration: .8, ease: 'back.out(2.2)', delay: .75, scrollTrigger: disparo });
      gsap.from(['.arco__plomada', '.arco__guia', '.arco__hito'],
        { opacity: 0, duration: .7, delay: 1.15, scrollTrigger: disparo });
      gsap.from('.arco__horas line', { opacity: 0, duration: .5, stagger: .045,
        delay: .3, scrollTrigger: disparo });
    }

    /* — El eclipse aparece abriéndose — */
    gsap.fromTo('.eclipse__img', { scale: .78, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.6, ease: 'power3.out',
        scrollTrigger: { trigger: '.eclipse', start: 'top 85%' } });

    /* — La rueda astral se despliega — */
    const rueda = $('#rueda');
    if (rueda) {
      gsap.fromTo(rueda, { rotate: -14, scale: 0.9, opacity: 0 },
        { rotate: 0, scale: 1, opacity: 1, duration: 1.6, ease: 'power3.out',
          transformOrigin: '50% 50%',
          scrollTrigger: { trigger: rueda, start: 'top 82%' } });
    }

    /* — La golondrina del cierre se aleja — */
    gsap.fromTo('.cierre__ave', { opacity: 0, scale: 0.5, y: 40 },
      { opacity: 1, scale: 1, y: 0, duration: 1.4, ease: 'power3.out',
        scrollTrigger: { trigger: '.cierre', start: 'top 80%' } });
  }

  /* ══════════════════ Arranque ══════════════════ */

  pintar();
  sembrarEstrellas();
  ajustarNombre();

  let temporizador;
  let eraMovil = enMovil();
  window.addEventListener('resize', () => {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => {
      ajustarNombre();
      // Solo se resiembra al cruzar el corte; si no, el cielo cambiaría en
      // cada arrastre del ratón.
      if (enMovil() !== eraMovil) { eraMovil = enMovil(); sembrarEstrellas(); }
      if (hayGsap && window.ScrollTrigger) ScrollTrigger.refresh();
    }, 150);
  });

  // Las fuentes web cambian el ancho del texto: hay que remedir cuando cargan.
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(ajustarNombre);

  if (hayGsap && !quieto) {
    animar();
  } else {
    // Sin animaciones: nos aseguramos de que nada se quede invisible.
    $$('[data-anim]').forEach((n) => { n.style.opacity = 1; });
    $$('[data-lista]').forEach((n) => {
      Array.from(n.children).forEach((h) => { h.style.opacity = 1; });
    });
  }
})();
