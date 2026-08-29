# Enara

Una página-recuerdo del día que nació Enara: el 29 de agosto de 2026, a las 08:30 de la
mañana, en el Hospital de Basurto de Bilbao.

Cuenta cómo era el mundo aquel día. Qué significa su nombre —*enara* es golondrina en
euskera—, qué tiempo hizo, qué se veía en el cielo, quién más cumple años ese día y qué
pasaba en Bilbao, que estaba en plena Aste Nagusia. Termina con su carta astral,
calculada con las posiciones reales de los planetas sobre Bilbao a esa hora exacta.

Está hecha para durar: se abre haciendo doble clic en `index.html`, sin instalar nada.

## Verla

```bash
python3 -m http.server 8123
```

O directamente doble clic en `index.html`. Para publicarla, sube la carpeta entera a
Netlify, Vercel o GitHub Pages; no hay nada que configurar.

**Al republicar cambios, sube el número de `?v=` de los `css` y `js` en `index.html`.**
GitHub Pages sirve esos ficheros con diez minutos de caché, así que sin cambiar la
versión el navegador seguirá usando los antiguos y parecerá que los cambios no han
subido. En iPhone eso se nota especialmente, porque Safari no tiene recarga forzada:
si hace falta verlo al instante, abre la página en una pestaña privada.

## Qué hay dentro

```
index.html   La página
css/         Estilos
js/data.js   Todos los datos: el clima, las efemérides, la carta astral
js/          El resto del código
assets/      Los grabados y las fotos
tools/       Scripts de un solo uso que generaron algunos datos e imágenes
```

Los datos del clima y las posiciones planetarias son reales y están calculados, no
inventados. El resto —el significado del nombre, la numerología, las interpretaciones
de la carta— es tradición.
