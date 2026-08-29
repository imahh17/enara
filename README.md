# Enara · 29 de agosto de 2026

Una página-recuerdo del día que nació Enara, en el Hospital de Basurto de Bilbao,
a las 08:30 de la mañana.

Está escrita para que dentro de veinte años se pueda abrir y siga funcionando: sin
build, sin framework, sin dependencias que instalar. Se abre haciendo doble clic en
`index.html`.

---

## Cómo verla

**Doble clic en `index.html`.** Ya está.

Para desarrollar con recarga cómoda, cualquier servidor estático vale:

```bash
python3 -m http.server 8123
```

Para publicarla, sube la carpeta entera a Netlify, Vercel o GitHub Pages. No hace
falta configurar nada.

> Necesita conexión para dos cosas: la tipografía **Inter** (Google Fonts) y
> **GSAP** (jsDelivr). Sin internet la página se ve igual pero con la tipografía del
> sistema y sin animaciones — se degrada bien, no se rompe.

---

## Estructura

```
index.html            Todas las secciones
assets/golondrina.png El grabado de la golondrina en vuelo (hero)
assets/golondrina-final.png La golondrina posada del cierre
assets/paisaje-*.jpg  El paisaje del hero, en dos tamaños para srcset
assets/esquina.png    La esquina ornamental, una sola para las cuatro
assets/n-*.jpg        Retratos de «cumplen años contigo»
assets/h-*.jpg        Imágenes de «y un día como hoy pasó esto»
assets/c-*            La piedra y la flor de las curiosidades
assets/t-*.jpg        Las ilustraciones de las tarjetas de 2026
assets/eclipse.png    El eclipse que cierra la sección del cielo
tools/aplanar.cjs     Fusiona un PNG transparente sobre un color de fondo
css/styles.css        Estilos. Mobile first: la base es para móvil y las @media amplían
js/data.js            TODOS los datos de la página, en un único objeto
js/chart.js           Dibuja la rueda de la carta astral y la tabla de posiciones
js/main.js            Monta el contenido desde data.js y añade las animaciones
tools/natal-chart.cjs Calcula la carta natal (script de un solo uso)
tools/arco-solar.cjs  Genera el diagrama del recorrido del sol (un solo uso)
tools/carta-natal.json Resultado del cálculo, ya volcado en data.js
```

Los scripts de `tools/` **no** se sirven en la web. Se ejecutaron una vez para generar
datos que ahora viven dentro de `js/data.js` y de `index.html`.

---

## De dónde sale cada dato

Esto importa: dentro de veinte años conviene saber qué es medición real y qué es
simbolismo.

### Medido — datos reales, verificables

| Dato | Fuente |
|---|---|
| Clima del 29/08/2026 en Bilbao: 28,7 °C máx., 18,3 °C mín., 0 mm de lluvia, 0 % de nubes a las 08:00, 75 % de humedad, 15,3 km/h de viento | [Open-Meteo](https://open-meteo.com), coordenadas 43,263 N / 2,935 O, consultado el mismo 29/08/2026 |
| Amanecer 07:32 · ocaso 20:52 | Open-Meteo **y** `astronomy-engine`, que dan 07:32 los dos por separado |
| Altura del Sol al nacer: 9,6° sobre el horizonte | Calculado con `astronomy-engine` |
| Luna iluminada al 98,7 % | Calculado con `astronomy-engine`; coincide con las efemérides públicas (97–98 %) |
| Eclipse total de Sol del 12/08/2026 sobre Bilbao, ~29 s de totalidad | [IGN](https://astronomia.ign.es/eclipse-total-sol-de-12-de-agosto-2026), Eclipsophile. Bilbao quedó justo en el borde de la franja |
| Eclipse parcial de Luna del 28/08/2026 | Efemérides públicas |
| Posiciones planetarias, Ascendente, Medio Cielo, casas y aspectos | `tools/natal-chart.cjs` — ver abajo |
| Aste Nagusia 2026: del 22 al 30 de agosto; txupin el 22 desde el Arriaga; día grande el viernes 28 | Programa oficial de fiestas de Bilbao y prensa local |
| Efemérides del 29 de agosto | Wikipedia, HISTORY |

### Simbólico — tradición, no medición

El significado del nombre, el simbolismo de la golondrina, la numerología (camino de
vida 11), la piedra y la flor de agosto, el año del Caballo de Fuego y las
interpretaciones de la carta astral. Los **grados** de la carta son cálculo
astronómico exacto; **lo que significan** es interpretación.

---

## La carta astral

No está inventada ni copiada de ninguna web. Se calcula en `tools/natal-chart.cjs`:

```bash
cd tools && npm install && node natal-chart.cjs
```

- Momento: **2026-08-29 06:30 UTC** (08:30 CEST), Hospital de Basurto, 43,2634 N / 2,9515 O.
- Longitudes eclípticas geocéntricas aparentes de los diez astros con
  [`astronomy-engine`](https://github.com/cosinekitty/astronomy) (MIT, precisión JPL).
- Ascendente y Medio Cielo por trigonometría estándar a partir del tiempo sidéreo
  local y la oblicuidad de la eclíptica.
- Casas por **signos enteros** (whole sign). Zodiaco tropical.
- Retrogradación por comparación con la longitud de 24 h antes.

**Cómo se comprobó que está bien.** El punto delicado era la fórmula del Ascendente,
que va a mano. Se verificó así: en el instante exacto del amanecer, el grado de la
eclíptica que asoma por el horizonte debe coincidir con la longitud del Sol. El
cálculo da Ascendente 5,02° de Virgo y Sol 5,92° de Virgo — 0,9° de diferencia,
exactamente lo esperado, porque el amanecer se define por el borde superior del disco
solar más la refracción atmosférica, que ocurre antes de que el centro del Sol llegue
al horizonte. Además la hora del amanecer coincide al minuto con Open-Meteo, que es
una fuente independiente.

Resultado, para quien quiera contrastarlo:

- **Sol** 5° 57′ de Virgo, casa 1
- **Luna** 18° 59′ de Piscis, casa 7
- **Ascendente** 16° 06′ de Virgo
- **Medio Cielo** 13° 26′ de Géminis

---

## La golondrina

`assets/golondrina.png` es un grabado aportado por la familia. El original venía a
1536×1024 y pesaba 1,8 MB; está reescalado a **720×480 y guardado en gris + alfa
(108 KB)**. Se midió antes de convertir: la saturación media del dibujo era 1,3 sobre
255, o sea monocromo, así que los tres canales de color estaban duplicando datos para
nada. Se mantienen los 720 px de ancho a propósito —bajar la resolución sí se notaría
en pantallas retina— y el canal alfa, que es lo que le permite recortarse sobre el
papiro sin modos de fusión.

Los tres grabados en PNG (golondrina, esquina y golondrina del cierre) están guardados
probando **filtro None y filtro Paeth** y quedándose con el que menos pese en cada
caso; es sin pérdida y la diferencia no es despreciable en tramados finos.

Aparece dos veces en el hero: a la **izquierda** tal cual, volando hacia la derecha,
y a la **derecha** con `scaleX(-1)` para que vuele hacia dentro. Si algún día se cambia
el dibujo, basta con sustituir el PNG manteniendo la proporción 3:2.

**El cierre lleva otra golondrina**, `assets/golondrina-final.png`: esta está posada en
una rama, no en vuelo — el pájaro ya ha llegado. Guardada también en gris + alfa
(63 KB en vez de los 914 KB del original).

Su tratamiento es distinto al del hero y conviene entender por qué. La del hero es
casi una silueta y se resuelve con `invert(1)`. Esta tiene **pecho blanco y mucho
detalle tonal**: invertirla la dejaría en negativo fotográfico, con el pecho negro y
el dorso claro. Por eso aquí no se invierte: se sube el brillo para que el trazo
oscuro despegue del fondo de noche y se tiñe de oro con `sepia` + `hue-rotate`,
dejando intacta la estructura del dibujo.

## El paisaje del hero

`assets/paisaje-*.jpg` es un grabado del caserío y los montes, aportado por la familia.
El original venía en PNG a 1672×941 y pesaba 2,6 MB; está guardado como JPEG de calidad
80 en dos tamaños —**1672 px (441 KB)** y **900 px (108 KB)**— que se sirven por `srcset`,
así que un móvil se descarga la cuarta parte. En PNG habría pesado 2,8 MB, seis veces más.

Dos detalles que hacen que se integre en vez de parecer una foto pegada:

- **El papiro es exactamente su papel.** Muestreé el tono del propio dibujo (`#E7D8C6`)
  y ese es ahora el valor de `--papiro`. Por eso no se ve el canto de la imagen.
- **El dibujo emerge del papel.** Una `mask-image` lo deja casi transparente arriba y a
  plena tinta abajo, de modo que el cielo se funde con el fondo y el texto que cae encima
  se lee. En vertical esa máscara se relaja, porque allí el texto no llega al dibujo.

El encuadre es distinto según la pantalla, con una sola regla: anclado abajo, ancho
completo y altura por proporción, con un tope de `58svh`. En móvil vertical eso deja el
dibujo entero como franja al pie; en apaisado el tope entra en juego y `object-fit: cover`
recorta por arriba — es decir, cielo, que es justo lo que el papiro continúa sin que se note.


## El marco del hero

Las cuatro esquinas salen de **un único PNG**: el original es una esquina superior
izquierda y las otras tres son la misma imagen espejada por CSS (`scaleX`, `scaleY`,
`scale(-1)`). Una sola descarga para las cuatro.

Sobre el archivo:

- Venía con **444 px de espacio vacío a la derecha**, así que está recortado a la caja
  real del dibujo. Si no, la esquina no habría asentado en el vértice.
- Está guardado en **gris + alfa** en vez de color: el grabado es monocromo cálido, el
  color por canal no aportaba nada y duplicaba el peso (138 KB en vez de 306 KB). El tono
  sepia lo repone un `filter` de CSS.
- Va con `mix-blend-mode: multiply`, que es lo que hace que se lea como impreso sobre el
  papel: las hojas claras toman el tono del papiro y el fondo labrado queda en tinta.

El marco se separa del borde de la pantalla con la variable `--marco`, y de ella cuelga
todo lo demás: la posición de las cuatro esquinas, el recorte del paisaje y el relleno
lateral del contenido. **Cambiando ese único valor se ajusta el marco entero.**

El paisaje vive dentro de `.hero__lamina`, un contenedor con el mismo margen y
`overflow: hidden`. Por eso el dibujo llega justo hasta el marco y ni un píxel más,
incluso mientras hace parallax.

## Las imágenes

Las ocho imágenes de contenido —seis en efemérides y dos en curiosidades— **no están
recortadas a fichero**. Se
guardan enteras (420 px de lado mayor) y el encuadre se hace en CSS: cada persona
lleva en `js/data.js` un `foco` (`object-position`) y un `zoom`, y el marco recorta.
La ventaja es que reencuadrar es cambiar dos números, sin volver a exportar nada.

El `zoom` hace falta porque las fuentes traen encuadres muy distintos: la estampa de
Locke es un óvalo con mucho aire alrededor y sin acercarla la cara se quedaba diminuta.

Todas llevan un punto de sepia (`filter: sepia(.34)`). Vienen de mundos muy distintos
—una estampa de 1721, un óleo de 1853, una foto de los setenta, una ilustración
moderna— y sin ese ajuste no se hablaban entre sí ni con el resto de la página. Es
deliberadamente suave: el azul del vestido de Ingres y el rojo de la camisa siguen ahí.

Una imagen puede además llevar `tono` en `data.js` para saltarse ese filtro común. Lo
usan tres:

- **Faraday**, que venía sobre un azul eléctrico imposible de casar con el papiro: se
  apaga bastante más que el resto.
- **El peridoto y el gladiolo**, al revés: apenas se tiñen. Ahí el color *es* el dato
  —«la piedra de agosto es verde»— y el sepia de las efemérides se lo habría comido.

En curiosidades el marco es distinto al de efemérides: **apaisado, sin borde y al pie
del texto**, más estampa que retrato. El peridoto va además con `object-fit: contain`
(un campo `ajuste` en `data.js`), porque es un recorte y así se ve la piedra entera; el
gladiolo, al ser foto, va con `cover`.

El peridoto se queda en PNG con alfa y no se fusiona contra el fondo como las tarjetas
de 2026: detrás tiene el degradado de la sección, que a lo largo de la imagen varía
unos diez puntos de RGB, y aplanarlo dejaría un rectángulo tenue pero visible. Está
recortado a la piedra —el original era casi todo aire— para que los kilobytes se gasten
en detalle y no en transparencia.

> **Nota sobre la imagen de los Beatles:** es la portada de *Abbey Road* (1969), no una
> foto del concierto de 1966 del que habla el texto. Se eligió por reconocible; el `alt`
> lo dice tal cual para no dar a entender otra cosa.

## Las ilustraciones de las tarjetas de 2026

**Ojo con estas tres, que llevan una trampa deliberada.**

Los originales eran PNG con transparencia y pesaban **1,84 MB entre los tres**, algo
inasumible. Pero las tarjetas tienen un fondo liso y conocido (`--papiro-alto`,
`#F3EADC`), así que las imágenes van **fusionadas contra ese color exacto** y guardadas
como JPEG: **410 KB**, y en pantalla el resultado es idéntico. Ni marco ni borde hacen
falta; parecen impresas sobre el papel de la tarjeta.

Ese truco es también el que permite usar `object-fit: contain` sin que se vean bandas:
lo que sobra a los lados de la ilustración es exactamente el mismo color que hay detrás.

> **Si algún día cambias `--papiro-alto`, hay que regenerar estas tres imágenes**, o
> aparecerá un rectángulo de otro tono dentro de cada tarjeta. Es el precio de la
> optimización, y se hace así:
>
> ```bash
> node tools/aplanar.cjs original.png /tmp/plano.png "#F3EADC"
> sips --setProperty format jpeg --setProperty formatOptions 80 /tmp/plano.png --out assets/t-loquesea.jpg
> ```

## El eclipse de la sección del cielo

`assets/eclipse.png` cierra «El cielo de ese verano», centrado tras las dos tarjetas.
Va en **gris + alfa** (234 KB frente a los 487 KB en RGBA) y el tono cálido lo pone un
`filter`, como el resto de grabados.

Es el único que **no** se fusiona contra el fondo pese a lo que pesa, y por la misma
razón que el peridoto: detrás tiene el degradado de la sección, que a esa altura pasa
de morado a azul noche, y aplanarlo dejaría un rectángulo. Se probó también a cuantizar
el canal alfa, pero solo bajaba de 234 a 202 KB y arriesgaba bandas en el resplandor:
no compensaba. Lleva `loading="lazy"`, así que no pesa en el arranque.

## El diagrama del sol

`tools/arco-solar.cjs` genera el arco de la sección «El día». La posición del sol
**no está puesta a ojo**: sale del tiempo real transcurrido desde el amanecer
(58 minutos de los 800 que duró el día, un 7,25 %). Por eso queda tan abajo y tan
pegado al borde izquierdo — y eso es exactamente lo que el gráfico quiere contar.

Las marcas de hora van por la normal real de la elipse, no por el radio desde el
centro; con el radio salían torcidas justo donde el arco más se curva.

```bash
node tools/arco-solar.cjs > tools/arco-solar.svg
```

## Las estrellas

El campo estrellado de las secciones del atardecer, la carta astral y el cierre
**no es una imagen**: la estrella es un `<path>` de SVG reutilizado con `<use>`,
dibujado a la proporción del original (alto/ancho 1,69, medida del PNG de referencia).
Así pesa cero, escala sin pixelarse y se puede teñir por CSS — que es lo que permite
poner 225 sin que la página engorde.

Las siembra `sembrarEstrellas()` en `js/main.js` con un generador de semilla fija: el
cielo sale idéntico en cada carga, no baila entre visitas. Cada estrella recibe tamaño,
opacidad, duración y retardo propios, así que el parpadeo nunca se sincroniza.

Dos detalles pensados: en la sección del atardecer las estrellas se apagan hacia arriba
(donde el cielo aún tiene luz), y las estrellas grandes van más suaves que las pequeñas,
porque una estrella gorda justo detrás de una letra se lee como una mancha.

## Accesibilidad

- Respeta `prefers-reduced-motion`: sin animaciones, sin parallax y sin contadores.
  Todo el contenido queda visible y legible.
- Si GSAP no carga, la página se ve entera igualmente — las animaciones son un añadido,
  nunca un requisito para ver el contenido.
- La golondrina partida en letras del hero conserva el texto completo en `aria-label`.
- Contraste AA en todo el texto, incluida la sección del atardecer.
