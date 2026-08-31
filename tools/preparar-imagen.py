#!/usr/bin/env python3
"""
Prepara un PNG con transparencia para servirlo ligero. Dos modos:

  --aplanar RRGGBB   funde el alfa contra un color plano y saca un PNG RGB.
                     Sirve cuando se sabe exactamente qué color hay detrás en
                     la página: el resultado se puede pasar a JPEG, que para
                     una ilustración con mucho pelo pesa cinco veces menos que
                     el PNG con alfa.

  --gris             pasa a gris + alfa conservando la transparencia. Para
                     dibujos que ya son monocromos: un tercio de los bytes.

Uso:  python3 tools/preparar-imagen.py entrada.png salida.png --aplanar FBF5EA
"""
import zlib, struct, sys


def leer(ruta):
    d = open(ruta, 'rb').read()
    if d[:8] != b'\x89PNG\r\n\x1a\n':
        raise SystemExit(f'{ruta}: no es un PNG')
    w, h, prof, tipo = struct.unpack('>IIBB', d[16:26])
    if prof != 8:
        raise SystemExit(f'{ruta}: solo 8 bits por canal')
    canales = {0: 1, 2: 3, 4: 2, 6: 4}[tipo]

    i, idat = 8, b''
    while i < len(d):
        largo = struct.unpack('>I', d[i:i + 4])[0]
        if d[i + 4:i + 8] == b'IDAT':
            idat += d[i + 8:i + 8 + largo]
        i += 12 + largo
    crudo = zlib.decompress(idat)

    paso = w * canales

    def paeth(a, b, c):
        p = a + b - c
        pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
        return a if (pa <= pb and pa <= pc) else (b if pb <= pc else c)

    filas, previa, pos = [], bytearray(paso), 0
    for _ in range(h):
        f = crudo[pos]; pos += 1
        linea = bytearray(crudo[pos:pos + paso]); pos += paso
        if f:
            for x in range(paso):
                a = linea[x - canales] if x >= canales else 0
                b = previa[x]
                c = previa[x - canales] if x >= canales else 0
                if   f == 1: linea[x] = (linea[x] + a) & 255
                elif f == 2: linea[x] = (linea[x] + b) & 255
                elif f == 3: linea[x] = (linea[x] + ((a + b) >> 1)) & 255
                elif f == 4: linea[x] = (linea[x] + paeth(a, b, c)) & 255
        filas.append(linea); previa = linea
    return w, h, canales, filas


def trozo(tipo, datos):
    return (struct.pack('>I', len(datos)) + tipo + datos
            + struct.pack('>I', zlib.crc32(tipo + datos) & 0xFFFFFFFF))


def escribir(ruta, w, h, canales_salida, filas):
    tipo = {1: 0, 2: 4, 3: 2, 4: 6}[canales_salida]
    crudo = b''.join(b'\x00' + bytes(f) for f in filas)   # filtro None: rápido y comprime bien aquí
    png = (b'\x89PNG\r\n\x1a\n'
           + trozo(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, tipo, 0, 0, 0))
           + trozo(b'IDAT', zlib.compress(crudo, 9))
           + trozo(b'IEND', b''))
    open(ruta, 'wb').write(png)


def main():
    entrada, salida, modo = sys.argv[1], sys.argv[2], sys.argv[3]
    w, h, canales, filas = leer(entrada)
    if canales != 4:
        raise SystemExit(f'{entrada}: se esperaba RGBA, tiene {canales} canales')

    if modo == '--aplanar':
        fondo = sys.argv[4].lstrip('#')
        fr, fg, fb = (int(fondo[i:i + 2], 16) for i in (0, 2, 4))
        salida_filas = []
        for f in filas:
            nueva = bytearray(w * 3)
            for x in range(w):
                r, g, b, a = f[x * 4:x * 4 + 4]
                if a == 255:
                    nueva[x * 3:x * 3 + 3] = bytes((r, g, b))
                elif a == 0:
                    nueva[x * 3:x * 3 + 3] = bytes((fr, fg, fb))
                else:
                    nueva[x * 3 + 0] = (r * a + fr * (255 - a)) // 255
                    nueva[x * 3 + 1] = (g * a + fg * (255 - a)) // 255
                    nueva[x * 3 + 2] = (b * a + fb * (255 - a)) // 255
            salida_filas.append(nueva)
        escribir(salida, w, h, 3, salida_filas)
        print(f'  {salida}: {w}x{h} RGB, aplanado sobre #{fondo.upper()}')

    elif modo == '--gris':
        salida_filas = []
        for f in filas:
            nueva = bytearray(w * 2)
            for x in range(w):
                r, g, b, a = f[x * 4:x * 4 + 4]
                nueva[x * 2 + 0] = (r * 299 + g * 587 + b * 114) // 1000
                nueva[x * 2 + 1] = a
            salida_filas.append(nueva)
        escribir(salida, w, h, 2, salida_filas)
        print(f'  {salida}: {w}x{h} gris+alfa')

    else:
        raise SystemExit(f'modo desconocido: {modo}')


main()
