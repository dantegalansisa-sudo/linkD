# LINKDICOM — Sitio web

Rediseño de la plataforma web de **LINKDICOM**: landing animada, oscura y de alto
contraste, construida sobre la identidad de marca (azul marino profundo + naranja).

## Stack

- **React 18** + **TypeScript**
- **Vite 5** como bundler
- **Framer Motion 11** para toda la capa de animación
- CSS propio con sistema de tokens (sin frameworks de utilidades)

## Arrancar en local

```bash
npm install
npm run dev
```

El sitio queda en `http://localhost:5180`.

```bash
npm run build     # compila TypeScript y genera dist/
npm run preview   # sirve el build de producción
```

## Estructura

```
src/
  components/
    sections/     Secciones de la página (Hero, Stats, About, ...)
    ui/           Piezas reutilizables (cursor, botones, contadores, escenas SVG)
  data/site.ts    TODO el contenido editable del sitio en un solo archivo
  hooks/          useParallax, useSpotlight
  styles/
    tokens.css    Variables de color, tipografía, espaciado y curvas de easing
    base.css      Reset, tipografía y utilidades de layout
    components.css Botones, cards, chips, cursor, marquee, ruido
    sections.css  Estilos por sección
  utils/easings.ts Curvas y variants compartidos
```

### Dónde tocar el contenido

Casi todo el texto vive en [`src/data/site.ts`](src/data/site.ts): navegación,
estadísticas, productos del ecosistema, soluciones, portales, módulos, industrias,
productos de IA, columnas del footer y datos de contacto.

## Sistema de diseño

Las secciones cambian de tema con una clase — `theme-dark` o `theme-light` — que
remapea los mismos tokens (`--surface`, `--text`, `--border`, ...). Los componentes
leen siempre los tokens, así que se adaptan solos.

Curvas de animación en `src/utils/easings.ts`. La curva principal es
`premium: cubic-bezier(0.76, 0, 0.24, 1)`.

## Capa de animación

| Pieza | Archivo |
|---|---|
| Titulares que se revelan palabra por palabra | `ui/RevealText.tsx` |
| Botones que siguen al cursor | `ui/MagneticButton.tsx` |
| Contadores animados al entrar en viewport | `ui/AnimatedCounter.tsx` |
| Red de nodos viva en canvas, a sangre completa (hero) | `ui/NetworkCanvas.tsx` |
| Ilustraciones SVG animadas de las cards | `ui/Scene.tsx` |
| Barra de progreso de scroll | `ui/ScrollProgress.tsx` |
| Parallax por scroll | `hooks/useParallax.ts` |

Todo respeta `prefers-reduced-motion`.

## Hero a sangre completa

El hero no vive dentro de una card: la escena animada ocupa el 100% del ancho de la
ventana y el contenido se apoya encima. El contraste lo garantiza `.hero__scrim`
(dos gradientes superpuestos, horizontal y vertical), no un color de fondo sólido.

Se compone en tres bandas métricas — texto | escena | portal de acceso — y cierra con
una franja de confianza también a sangre. Las bandas de IA y de cierre siguen el mismo
criterio.

Para cambiar el fondo por un video, sustituye `<NetworkCanvas />` y el `<img>` de
`.hero__building` por un `<video muted loop playsinline>` dentro de `.hero__bg`;
el resto de la composición no cambia.

## Assets

- `public/brand/linkdicom-logo.png` — logo recortado del original, fondo transparente
- `public/brand/linkdicom-logo-dark.png` — variante con el tagline aclarado para fondos oscuros
- `public/img/hero-network.jpg` — render original; en el hero se recorta al edificio y
  la red de nodos se dibuja en vivo sobre canvas
- `assets-originales/` — archivos tal como los entregó el cliente

## Deploy en Vercel

El repo trae `vercel.json` configurado. En Vercel: *New Project* → importar este
repositorio → framework **Vite** (se detecta solo) → *Deploy*. No requiere
variables de entorno.
