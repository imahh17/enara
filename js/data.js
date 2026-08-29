/**
 * Todos los datos de la página, congelados en el día del nacimiento.
 * El origen de cada bloque está documentado en README.md.
 */
const DATA = {

  nacimiento: {
    nombre: 'Enara',
    fecha: '29 de agosto de 2026',
    fechaCorta: '29 · 08 · 2026',
    hora: '08:30',
    lugar: 'Hospital de Basurto',
    ciudad: 'Bilbao',
    diaSemana: 'sábado',
    diaDelAño: 241,
    diasRestantes: 124,
  },

  // Open-Meteo, estación de Bilbao (43.263 N, 2.935 O). Ver README.
  clima: {
    amanecer: '07:32',
    ocaso: '20:52',
    horasDeLuz: '13 h 20 min',
    minutosTrasElAmanecer: 58,
    tempAlNacer: 18.3,
    tempMaxima: 28.7,
    tempMinima: 18.3,
    nubes: 0,
    humedad: 75,
    lluvia: 0,
    viento: 15.3,
    alturaDelSol: 9.6,
    resumen: 'Cielo despejado',
  },

  cielo: {
    eclipseSol: {
      fecha: '12 de agosto de 2026',
      dias: 17,
      duracion: '29 segundos',
      hora: '20:27',
      texto: 'Diecisiete días antes de que nacieras, el cielo de Bilbao se apagó a plena tarde. ' +
             'La franja de un eclipse total de Sol cruzó el norte de España y rozó la ciudad justo por el borde: ' +
             'apenas veintinueve segundos de noche, con el Sol casi tocando el horizonte.',
    },
    eclipseLuna: {
      fecha: '28 de agosto de 2026',
      texto: 'La víspera hubo luna llena — la Luna del Esturión — y además se eclipsó en parte. ' +
             'Cuando naciste, esa misma Luna seguía casi entera en el cielo.',
    },
    lunaIluminada: 98.7,
    lunaFase: 'Gibosa menguante',
  },

  nombre: {
    significado: 'golondrina',
    idioma: 'euskera',
    variantes: ['Ainara', 'Elaia'],
    especie: 'Hirundo rustica',
    personas: 3000,
    provincia: 'Gipuzkoa',
    simbolos: [
      {
        titulo: 'El regreso',
        texto: 'Las golondrinas vuelven cada primavera al mismo nido, después de cruzar un continente entero. ' +
               'Por eso son, en casi todas las culturas, el símbolo de volver a casa.',
      },
      {
        titulo: 'La esperanza',
        texto: 'Ver la primera golondrina significaba que el invierno se había terminado. ' +
               'Los marineros se la tatuaban para asegurarse de que volverían a tierra.',
      },
      {
        titulo: 'La libertad',
        texto: 'Duerme volando, come volando y bebe volando. Pasa casi toda su vida en el aire, ' +
               'y aun así siempre sabe exactamente dónde está su casa.',
      },
    ],
  },

  efemerides: {
    nacidos: [
      // `foco` es el punto de interés de cada imagen (object-position): así se
      // encuadra la cara sin recortar el fichero.
      { año: 1632, quien: 'John Locke', que: 'filósofo; escribió que todos nacemos libres e iguales',
        foto: 'assets/n-locke.jpg', foco: '48% 26%', zoom: 1.6,
        alt: 'Retrato grabado de John Locke' },
      { año: 1780, quien: 'Jean-Auguste-Dominique Ingres', que: 'pintor francés',
        foto: 'assets/n-ingres.jpg', foco: '51% 21%', zoom: 1.35,
        alt: 'Detalle del retrato de la princesa de Broglie, pintado por Ingres' },
      { año: 1958, quien: 'Michael Jackson', que: 'el rey del pop',
        foto: 'assets/n-jackson.jpg', foco: '49% 40%', zoom: 1.12,
        alt: 'Retrato de Michael Jackson de niño' },
    ],
    hechos: [
      { año: 1807, que: 'El ataque de los conejos a Napoleón. Durante una cacería organizada para Napoleón Bonaparte, sus hombres soltaron miles de conejos domesticados que, en lugar de huir, confundieron al Emperador con el encargado de alimentarlos y abalanzaron una turba hambrienta contra él, obligándolo a retirarse. Conejos 1 - Napoleón 0.',
        foto: 'assets/h-napoleon.jpg', foco: '50% 40%', zoom: 1,
        alt: 'Ilustración de Napoleón rodeado de conejos, con una bandera blanca' },
      { año: 1831, que: 'Michael Faraday presenta el primer transformador eléctrico. Sin ese día no habría enchufes.',
        foto: 'assets/h-faraday.jpg', foco: '52% 33%', zoom: 1.25,
        // El original tiene un fondo azul eléctrico que no pega con el papiro;
        // este tono lo apaga sin borrarlo del todo.
        tono: 'sepia(.6) saturate(.5) contrast(1.06)',
        alt: 'Retrato dibujado de Michael Faraday rodeado de esquemas de circuitos' },
      { año: 1966, que: 'Los Beatles dan su último concierto de pago, en San Francisco.',
        foto: 'assets/h-beatles.jpg', foco: '50% 64%', zoom: 1.35,
        alt: 'Portada del disco Abbey Road: los cuatro Beatles cruzando un paso de cebra' },
    ],
  },

  capsula2026: [
    {
      titulo: 'El año del Caballo de Fuego',
      texto: 'En el calendario chino, 2026 es el año del Caballo de Fuego: una combinación que solo ' +
             'vuelve cada sesenta años. La anterior fue en 1966. Se le atribuyen coraje, independencia ' +
             'y unas ganas enormes de moverse.',
      etiqueta: 'Cada 60 años',
    },
    {
      titulo: 'El verano de los eclipses',
      texto: 'España vivió el primero de tres eclipses solares consecutivos: 2026, 2027 y 2028. ' +
             'No pasaba nada parecido desde hacía más de un siglo.',
      etiqueta: 'Agosto de 2026',
    },
    {
      titulo: 'Naciste en plena Aste Nagusia',
      texto: 'La Semana Grande de Bilbao empezó el sábado 22 de agosto, con el txupin desde el balcón ' +
             'del Arriaga y Marijaia asomándose a la plaza. Duró nueve días, y tú llegaste el octavo. ' +
             'La víspera, el viernes 28, había sido el día grande. Y la noche siguiente a que nacieras ' +
             'ardió Marijaia y se acabaron las fiestas: naciste con Bilbao entero en la calle.',
      etiqueta: 'Del 22 al 30 de agosto',
    },
  ],

  curiosidades: [
    { dato: '11', titulo: 'Tu camino de vida', texto: 'Sumando las cifras de tu fecha (2+9+0+8+2+0+2+6) sale 29, y de ahí 11. En numerología el 11 es un número maestro: no se reduce más. Es una cifra de alta vibración que simboliza el despertar espiritual, la intuición elevada y el papel de guía o iluminador' },
    { dato: 'Peridoto', titulo: 'Tu piedra',
      foto: 'assets/c-peridoto.png', foco: '49% 54%', zoom: 1.18,
      // Aquí el color es el dato —la piedra de agosto es verde—, así que
      // apenas se tiñe: el sepia de las efemérides se la comería.
      tono: 'sepia(.1) saturate(.96)',
      alt: 'Un peridoto tallado, de un verde intenso',
      texto: 'La piedra de agosto es verde y se forma en el manto de la Tierra. Alguna llegó incluso dentro de un meteorito.' },
    { dato: 'Gladiolo', titulo: 'Tu flor',
      foto: 'assets/c-gladiolo.jpg', foco: '50% 46%', zoom: 1.05,
      tono: 'sepia(.12) saturate(.94)',
      alt: 'Un macizo de gladiolos de muchos colores',
      texto: 'Las flores de agosto son el gladiolo y la amapola. El gladiolo significa fuerza de carácter.' },
    { dato: '241', titulo: 'Día del año', texto: 'Naciste en el día 241 de 2026. Quedaban 124 para que acabara.' },
    { dato: '98,7 %', titulo: 'La Luna esa mañana', texto: 'Casi llena todavía, un día después del eclipse parcial. Gibosa menguante.' },
    { dato: '13 h 20', titulo: 'Duración de tu día', texto: 'El sol salió a las 07:32 y se puso a las 20:52. Tu primer día tuvo trece horas y veinte minutos de luz.' },
  ],
};

// Calculada con astronomy-engine. Ver tools/natal-chart.cjs y README.md.
DATA.carta = {
  "meta": {
    "fechaLocal": "2026-08-29T08:30:00+02:00",
    "fechaUTC": "2026-08-29T06:30:00.000Z",
    "lugar": "Hospital de Basurto, Bilbao",
    "latitud": 43.2634,
    "longitud": -2.9515,
    "sistemaCasas": "Signos enteros (whole sign)",
    "zodiaco": "Tropical, eclíptica de la fecha",
    "oblicuidad": 23.43582,
    "tiempoSideralLocal": 72.0341
  },
  "ascendente": {
    "lon": 166.1074,
    "signo": "Virgo",
    "signoIndex": 5,
    "grado": 16,
    "minuto": 6
  },
  "medioCielo": {
    "lon": 73.4316,
    "signo": "Géminis",
    "signoIndex": 2,
    "grado": 13,
    "minuto": 26
  },
  "nodoNorte": {
    "lon": 329.8395,
    "signo": "Acuario",
    "signoIndex": 10,
    "grado": 29,
    "minuto": 50
  },
  "planetas": [
    {
      "nombre": "Sol",
      "lon": 155.9554,
      "signo": "Virgo",
      "signoIndex": 5,
      "grado": 5,
      "minuto": 57,
      "retrogrado": false,
      "casa": 1
    },
    {
      "nombre": "Luna",
      "lon": 348.983,
      "signo": "Piscis",
      "signoIndex": 11,
      "grado": 18,
      "minuto": 59,
      "retrogrado": false,
      "casa": 7
    },
    {
      "nombre": "Mercurio",
      "lon": 157.4886,
      "signo": "Virgo",
      "signoIndex": 5,
      "grado": 7,
      "minuto": 29,
      "retrogrado": false,
      "casa": 1
    },
    {
      "nombre": "Venus",
      "lon": 200.9463,
      "signo": "Libra",
      "signoIndex": 6,
      "grado": 20,
      "minuto": 57,
      "retrogrado": false,
      "casa": 2
    },
    {
      "nombre": "Marte",
      "lon": 101.6571,
      "signo": "Cáncer",
      "signoIndex": 3,
      "grado": 11,
      "minuto": 39,
      "retrogrado": false,
      "casa": 11
    },
    {
      "nombre": "Júpiter",
      "lon": 133.1235,
      "signo": "Leo",
      "signoIndex": 4,
      "grado": 13,
      "minuto": 7,
      "retrogrado": false,
      "casa": 12
    },
    {
      "nombre": "Saturno",
      "lon": 13.8268,
      "signo": "Aries",
      "signoIndex": 0,
      "grado": 13,
      "minuto": 50,
      "retrogrado": true,
      "casa": 8
    },
    {
      "nombre": "Urano",
      "lon": 65.6298,
      "signo": "Géminis",
      "signoIndex": 2,
      "grado": 5,
      "minuto": 38,
      "retrogrado": false,
      "casa": 10
    },
    {
      "nombre": "Neptuno",
      "lon": 3.7351,
      "signo": "Aries",
      "signoIndex": 0,
      "grado": 3,
      "minuto": 44,
      "retrogrado": true,
      "casa": 8
    },
    {
      "nombre": "Plutón",
      "lon": 303.5622,
      "signo": "Acuario",
      "signoIndex": 10,
      "grado": 3,
      "minuto": 34,
      "retrogrado": true,
      "casa": 6
    }
  ],
  "casas": [
    {
      "numero": 1,
      "signo": "Virgo",
      "signoIndex": 5
    },
    {
      "numero": 2,
      "signo": "Libra",
      "signoIndex": 6
    },
    {
      "numero": 3,
      "signo": "Escorpio",
      "signoIndex": 7
    },
    {
      "numero": 4,
      "signo": "Sagitario",
      "signoIndex": 8
    },
    {
      "numero": 5,
      "signo": "Capricornio",
      "signoIndex": 9
    },
    {
      "numero": 6,
      "signo": "Acuario",
      "signoIndex": 10
    },
    {
      "numero": 7,
      "signo": "Piscis",
      "signoIndex": 11
    },
    {
      "numero": 8,
      "signo": "Aries",
      "signoIndex": 0
    },
    {
      "numero": 9,
      "signo": "Tauro",
      "signoIndex": 1
    },
    {
      "numero": 10,
      "signo": "Géminis",
      "signoIndex": 2
    },
    {
      "numero": 11,
      "signo": "Cáncer",
      "signoIndex": 3
    },
    {
      "numero": 12,
      "signo": "Leo",
      "signoIndex": 4
    }
  ],
  "aspectos": [
    {
      "a": "Sol",
      "b": "Mercurio",
      "tipo": "Conjunción",
      "orbe": 1.53
    },
    {
      "a": "Sol",
      "b": "Urano",
      "tipo": "Cuadratura",
      "orbe": 0.33
    },
    {
      "a": "Luna",
      "b": "Ascendente",
      "tipo": "Oposición",
      "orbe": 2.88
    },
    {
      "a": "Luna",
      "b": "Medio Cielo",
      "tipo": "Cuadratura",
      "orbe": 5.55
    },
    {
      "a": "Mercurio",
      "b": "Marte",
      "tipo": "Sextil",
      "orbe": 4.17
    },
    {
      "a": "Mercurio",
      "b": "Urano",
      "tipo": "Cuadratura",
      "orbe": 1.86
    },
    {
      "a": "Mercurio",
      "b": "Medio Cielo",
      "tipo": "Cuadratura",
      "orbe": 5.94
    },
    {
      "a": "Venus",
      "b": "Saturno",
      "tipo": "Oposición",
      "orbe": 7.12
    },
    {
      "a": "Marte",
      "b": "Saturno",
      "tipo": "Cuadratura",
      "orbe": 2.17
    },
    {
      "a": "Marte",
      "b": "Ascendente",
      "tipo": "Sextil",
      "orbe": 4.45
    },
    {
      "a": "Júpiter",
      "b": "Saturno",
      "tipo": "Trígono",
      "orbe": 0.7
    },
    {
      "a": "Júpiter",
      "b": "Medio Cielo",
      "tipo": "Sextil",
      "orbe": 0.31
    },
    {
      "a": "Saturno",
      "b": "Medio Cielo",
      "tipo": "Sextil",
      "orbe": 0.4
    },
    {
      "a": "Urano",
      "b": "Neptuno",
      "tipo": "Sextil",
      "orbe": 1.89
    },
    {
      "a": "Urano",
      "b": "Plutón",
      "tipo": "Trígono",
      "orbe": 2.07
    },
    {
      "a": "Urano",
      "b": "Medio Cielo",
      "tipo": "Conjunción",
      "orbe": 7.8
    },
    {
      "a": "Neptuno",
      "b": "Plutón",
      "tipo": "Sextil",
      "orbe": 0.17
    },
    {
      "a": "Ascendente",
      "b": "Medio Cielo",
      "tipo": "Cuadratura",
      "orbe": 2.68
    }
  ]
};

// Glifos e interpretaciones para la rueda astral.
DATA.astro = {
  glifosSigno: {
    Aries: '♈', Tauro: '♉', 'Géminis': '♊', 'Cáncer': '♋', Leo: '♌', Virgo: '♍',
    Libra: '♎', Escorpio: '♏', Sagitario: '♐', Capricornio: '♑', Acuario: '♒', Piscis: '♓',
  },
  glifosPlaneta: {
    Sol: '☉', Luna: '☽', Mercurio: '☿', Venus: '♀', Marte: '♂', 'Júpiter': '♃',
    Saturno: '♄', Urano: '♅', Neptuno: '♆', 'Plutón': '♇',
    Ascendente: 'AC', 'Medio Cielo': 'MC', 'Nodo Norte': '☊',
  },
  elementos: {
    Aries: 'fuego', Leo: 'fuego', Sagitario: 'fuego',
    Tauro: 'tierra', Virgo: 'tierra', Capricornio: 'tierra',
    'Géminis': 'aire', Libra: 'aire', Acuario: 'aire',
    'Cáncer': 'agua', Escorpio: 'agua', Piscis: 'agua',
  },
  pilares: [
    {
      clave: 'Sol', titulo: 'Tu Sol en Virgo',
      texto: 'El Sol dice quién eres cuando no actúas para nadie. En Virgo habla de una cabeza que ' +
             'se fija en los detalles que a los demás se les escapan, y de la manía cariñosa de querer ' +
             'arreglar las cosas para que funcionen mejor.',
    },
    {
      clave: 'Luna', titulo: 'Tu Luna en Piscis',
      texto: 'La Luna es lo que sientes antes de pensarlo. En Piscis es porosa: absorbe el estado de ánimo ' +
             'de la habitación entera. La víspera de tu nacimiento hubo luna llena, y esa Luna se quedó ' +
             'justo enfrente de tu Ascendente. Nada en tu carta está tan marcado.',
    },
    {
      clave: 'Ascendente', titulo: 'Tu Ascendente en Virgo',
      texto: 'El Ascendente es el grado exacto del cielo que asomaba por el horizonte de Bilbao a las 08:30. ' +
             'Es la puerta por la que el mundo te ve entrar. En tu caso está en el mismo signo que tu Sol, ' +
             'y eso es raro y bonito: por fuera te pareces mucho a lo que eres por dentro.',
    },
  ],
  notas: [
    'El Sol y Mercurio salieron juntos por el horizonte contigo: los dos en Virgo, los dos en la casa 1.',
    'Naciste con el Sol a solo 9,6° sobre el horizonte. Acababa de amanecer.',
    'Júpiter en trígono con Saturno, con un orbe de menos de un grado: expansión y estructura de acuerdo.',
  ],
};
