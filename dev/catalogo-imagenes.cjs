// Genera src/contenido/catalogo-imagenes.ts a partir de las rutas /img y
// /video que aparecen en src/data: es la lista de fotos fijas que el panel de
// administracion permite sustituir.  Uso:  npm run catalogo
const fs = require('fs');
const path = require('path');
const raiz = path.dirname(__dirname);

const GRUPOS = [
  ['site.ts', 'Inicio y menú'],
  ['productos.ts', 'Productos'],
  ['ecosistemas.ts', 'Ecosistemas'],
  ['sectores.ts', 'Sectores'],
  ['empresariales.ts', 'Soluciones empresariales'],
  ['empresa.ts', 'Empresa'],
  ['historia.ts', 'Nuestra historia'],
  ['recursos.ts', 'Recursos'],
  ['politicas.ts', 'Políticas'],
  ['trabaja.ts', 'Trabaja con nosotros'],
  ['obra-social.ts', 'Obra social'],
];
// las fotos de noticias y jornadas se cambian en sus propios editores
const EXCLUIR = /^\/img\/(noticias|obra-social\/(utiles|cena|proximo|aprezio))/;

const RUTA = /'(\/(?:img|video)\/[^']+)'/g;
const CLAVES_CONTEXTO = ['titulo', 'nombre', 'title', 'label', 'slug', 'miga', 'name'];
const CADENA = "'((?:[^'\\\\]|\\\\.)*)'";

const catalogo = [];
const vistas = new Set();
for (const [archivo, grupo] of GRUPOS) {
  const lineas = fs.readFileSync(path.join(raiz, 'src/data', archivo), 'utf8').split('\n');
  lineas.forEach((linea, i) => {
    for (const m of linea.matchAll(RUTA)) {
      const ruta = m[1];
      if (EXCLUIR.test(ruta) || vistas.has(ruta)) continue;
      vistas.add(ruta);
      // alt en la misma linea o en las 3 siguientes
      let alt = '';
      for (let j = i; j <= Math.min(i + 3, lineas.length - 1); j++) {
        const misma = new RegExp('(?:alt|Alt)\\s*:\\s*' + CADENA).exec(lineas[j]);
        const partida = /(?:alt|Alt)\s*:\s*$/.test(lineas[j]) && new RegExp('^\\s*' + CADENA).exec(lineas[j + 1] || '');
        const a = misma || partida;
        if (a) {
          alt = a[1].replace(/\\'/g, "'");
          break;
        }
      }
      // contexto: titulo/nombre/slug mas cercano por encima
      let contexto = '';
      for (let j = i; j >= Math.max(0, i - 60); j--) {
        const c = new RegExp('^\\s*(?:' + CLAVES_CONTEXTO.join('|') + ')\\s*:\\s*' + CADENA).exec(lineas[j]);
        if (c) {
          contexto = c[1].replace(/\\'/g, "'");
          break;
        }
      }
      const clave = (/^\s*([A-Za-z]+)\s*:/.exec(linea) || [])[1] || '';
      catalogo.push({ ruta, grupo, alt, contexto, clave });
    }
  });
}
// fotos y videos que estan escritos directamente en componentes
const manuales = [
  { ruta: '/img/heros.png', grupo: 'Inicio y menú', alt: 'Ilustración de la portada del inicio', contexto: 'Portada', clave: 'hero' },
  { ruta: '/img/demo-enviando.webp', grupo: 'Formularios', alt: 'Ilustración del panel «Enviando tu solicitud»', contexto: 'Formulario de demo', clave: 'enviando' },
  { ruta: '/img/productos/radiologox/panel.webp', grupo: 'Formularios', alt: 'Pantalla de RadioloGOx en la página de solicitar demo', contexto: 'Solicitar demo', clave: 'panel' },
  { ruta: '/img/obra-social/donacion-lado.webp', grupo: 'Obra social', alt: 'Foto lateral del formulario «Quiero aportar»', contexto: 'Formulario de aporte', clave: 'lado' },
  { ruta: '/video/intro-cables.mp4', grupo: 'Videos', alt: 'Video de la animación de entrada (cables que se conectan)', contexto: 'Animación de entrada', clave: 'video' },
  { ruta: '/video/intro-poster.jpg', grupo: 'Videos', alt: 'Fotograma de espera de la animación de entrada', contexto: 'Animación de entrada', clave: 'poster' },
  { ruta: '/video/linkdicom-presentacion.mp4', grupo: 'Videos', alt: 'Video de presentación de LINKDICOM (botón «Ver video»)', contexto: 'Presentación', clave: 'video' },
  { ruta: '/video/portada.jpg', grupo: 'Videos', alt: 'Portada del video de presentación', contexto: 'Presentación', clave: 'poster' },
];
for (const m of manuales) {
  if (!vistas.has(m.ruta)) {
    vistas.add(m.ruta);
    catalogo.push(m);
  }
}

const q = (s) => "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
const salida = [
  '/*',
  '  Catalogo de las fotos y videos fijos del sitio, para la seccion "Imagenes',
  '  del sitio" del panel. GENERADO por dev/catalogo-imagenes.cjs a partir de',
  '  las rutas de src/data: si se anade una foto nueva a los datos, hay que',
  '  volver a generarlo (npm run catalogo) para que aparezca en el panel.',
  '*/',
  '',
  'export interface ImagenCatalogo {',
  '  /** Ruta original en el codigo; es la clave de la sustitucion. */',
  '  ruta: string;',
  '  grupo: string;',
  '  /** Donde esta: la pagina, el producto o la seccion. */',
  '  contexto: string;',
  '  /** Que se ve en ella. */',
  '  descripcion: string;',
  '  esVideo: boolean;',
  '}',
  '',
  'export const CATALOGO_IMAGENES: ImagenCatalogo[] = [',
  ...catalogo.map((c) => {
    const desc = c.alt || (/\/logos\//.test(c.ruta) && c.contexto ? 'Logotipo de ' + c.contexto : c.contexto || path.basename(c.ruta));
    return `  { ruta: ${q(c.ruta)}, grupo: ${q(c.grupo)}, contexto: ${q(c.contexto || '')}, descripcion: ${q(desc)}, esVideo: ${/\.(mp4|webm)$/.test(c.ruta)} },`;
  }),
  '];',
  '',
].join('\n');
fs.writeFileSync(path.join(raiz, 'src/contenido/catalogo-imagenes.ts'), salida);
console.log(catalogo.length, 'entradas');
const porGrupo = {};
for (const c of catalogo) porGrupo[c.grupo] = (porGrupo[c.grupo] || 0) + 1;
console.log(porGrupo);
console.log('sin alt:\n' + catalogo.filter((c) => !c.alt).map((c) => c.ruta + ' <- ' + c.contexto).join('\n'));
