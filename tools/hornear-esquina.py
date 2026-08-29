"""
Hornea el `filter` + `mix-blend-mode: multiply` de las esquinas dentro del PNG.

Por qué: en el hero había cuatro esquinas con un filtro de cinco funciones y
además fusión multiply. En iOS, mix-blend-mode obliga a recomponer en el hilo
principal en cada fotograma, y ahí se muere la inercia del scroll.

Multiply sobre un fondo P da `tono * P`. Eso mismo se consigue sin fusión
pintando tinta oscura con alfa = 1 - luminancia: donde el grabado es claro
queda transparente (se ve el papel) y donde es oscuro queda tinta.
"""
import struct, zlib, sys

SRC, DST = 'tools/esquina-fuente.png', 'assets/esquina-tinta.png'
TINTA = (0x3E, 0x2C, 0x1B)          # marrón oscuro cálido

def leer(ruta):
    d = open(ruta, 'rb').read()
    w, h, _, color = struct.unpack('>IIBB', d[16:26])
    C = {0:1, 2:3, 3:1, 4:2, 6:4}[color]
    i, idat = 8, b''
    while i < len(d):
        ln = struct.unpack('>I', d[i:i+4])[0]
        if d[i+4:i+8] == b'IDAT': idat += d[i+8:i+8+ln]
        i += 12 + ln
    raw = zlib.decompress(idat); anc = w*C; prev = bytearray(anc); filas = []; pos = 0
    for y in range(h):
        ft = raw[pos]; pos += 1
        L = bytearray(raw[pos:pos+anc]); pos += anc
        for x in range(anc):
            a = L[x-C] if x >= C else 0
            b = prev[x]; c = prev[x-C] if x >= C else 0
            if   ft == 1: L[x] = (L[x]+a) & 255
            elif ft == 2: L[x] = (L[x]+b) & 255
            elif ft == 3: L[x] = (L[x]+(a+b)//2) & 255
            elif ft == 4:
                p = a+b-c; pa, pb, pc = abs(p-a), abs(p-b), abs(p-c)
                L[x] = (L[x] + (a if (pa<=pb and pa<=pc) else (b if pb<=pc else c))) & 255
        filas.append(bytes(L)); prev = L
    return w, h, C, filas

def filtro_css(g):
    """Aplica sepia(.20) saturate(1.7) hue-rotate(-20) contrast(1.45)
       brightness(.8) a un gris y devuelve la luminancia resultante."""
    r = v = b = g
    # sepia(.20)
    a = .20
    sr = (1-a)*r + a*(0.393*r + 0.769*v + 0.189*b)
    sv = (1-a)*v + a*(0.349*r + 0.686*v + 0.168*b)
    sb = (1-a)*b + a*(0.272*r + 0.534*v + 0.131*b)
    # saturate(1.7)
    s = 1.7
    r2 = (0.213+0.787*s)*sr + (0.715-0.715*s)*sv + (0.072-0.072*s)*sb
    v2 = (0.213-0.213*s)*sr + (0.715+0.285*s)*sv + (0.072-0.072*s)*sb
    b2 = (0.213-0.213*s)*sr + (0.715-0.715*s)*sv + (0.072+0.928*s)*sb
    # contrast(1.45) y brightness(.8)
    f = lambda c: max(0.0, min(1.0, ((c-0.5)*1.45 + 0.5) * 0.8))
    r3, v3, b3 = f(r2), f(v2), f(b2)
    return 0.2126*r3 + 0.7152*v3 + 0.0722*b3

w, h, C, filas = leer(SRC)
assert C == 2, f'se esperaba gris+alfa, hay {C} canales'

# Tabla de conversión: para cada gris, el alfa de tinta equivalente
tabla = [max(0.0, min(1.0, 1.0 - filtro_css(g/255.0))) for g in range(256)]

out = bytearray()
for y in range(h):
    out.append(0)
    f = filas[y]
    for x in range(w):
        g, a = f[x*2], f[x*2+1]
        out += bytes((TINTA[0], TINTA[1], TINTA[2], int(a * tabla[g] + 0.5)))

def trozo(t, dd):
    return struct.pack('>I', len(dd)) + t + dd + struct.pack('>I', zlib.crc32(t+dd) & 0xffffffff)

png = (b'\x89PNG\r\n\x1a\n'
       + trozo(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 6, 0, 0, 0))
       + trozo(b'IDAT', zlib.compress(bytes(out), 9))
       + trozo(b'IEND', b''))
open(DST, 'wb').write(png)
import os
print(f'{w}x{h} · {os.path.getsize(SRC)/1024:.0f} KB (gris+alfa) -> {len(png)/1024:.0f} KB (tinta+alfa)')
