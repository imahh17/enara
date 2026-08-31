/**
 * Puerta de acceso a la página.
 *
 * AVISO HONESTO: esto no es seguridad. La comprobación ocurre en el navegador,
 * así que cualquiera con las herramientas de desarrollo puede saltársela. Sirve
 * para que quien reciba el enlace de pasada no entre sin más. Si algún día hace
 * falta protección de verdad, se pone en el servidor (Netlify y Vercel traen
 * protección por contraseña integrada).
 *
 * Lo que sí se evita es dejar la contraseña escrita en claro: se guarda solo la
 * huella FNV-1a de "usuario:contraseña".
 */
(function () {
  'use strict';

  const HUELLA = 'e64929a4';
  const LLAVE = 'enara-acceso';

  /** FNV-1a de 32 bits. Síncrono y sin dependencias: funciona hasta en file://. */
  function huella(texto) {
    let h = 0x811c9dc5;
    for (const c of texto) {
      h ^= c.codePointAt(0);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return h.toString(16).padStart(8, '0');
  }

  const puerta = document.getElementById('acceso');
  if (!puerta) return;

  // Si el <head> ya abrió la página —porque LOGIN_ACTIVO es false, o porque se
  // recuerda la sesión—, la puerta se retira del DOM y aquí no hay nada más que
  // hacer. Retirarla, y no solo ocultarla, evita que su formulario quede
  // accesible al teclado o al lector de pantalla.
  if (document.documentElement.classList.contains('desbloqueado')) {
    puerta.remove();
    return;
  }

  function abrir(guardar) {
    if (guardar) {
      try { localStorage.setItem(LLAVE, HUELLA); } catch (e) { /* modo privado */ }
    }
    document.documentElement.classList.add('desbloqueado');
    puerta.setAttribute('hidden', '');
    // Las animaciones esperaban a este momento para no gastarse detrás de la puerta.
    document.dispatchEvent(new CustomEvent('enara:desbloqueado'));
  }

  const form = puerta.querySelector('form');
  const usuario = puerta.querySelector('#acceso-usuario');
  const clave = puerta.querySelector('#acceso-clave');
  const aviso = puerta.querySelector('#acceso-aviso');

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const intento = huella(usuario.value.trim().toLowerCase() + ':' + clave.value);

    if (intento === HUELLA) {
      aviso.textContent = '';
      abrir(true);
      return;
    }

    aviso.textContent = 'Ese usuario o esa contraseña no son.';
    puerta.classList.remove('acceso--falla');
    void puerta.offsetWidth;               // reinicia la animación
    puerta.classList.add('acceso--falla');
    clave.select();
  });

  // El foco entra en el formulario al cargar.
  requestAnimationFrame(() => usuario.focus());
})();
