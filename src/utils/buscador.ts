/*
  Buscador del sitio (la lupa del menu).

  No hay servidor de busqueda: el indice se arma en el navegador con lo que ya
  tiene la web, el contenido fijo del codigo (menus, fichas de producto,
  soluciones, sectores, paginas de empresa) y el que publica el panel
  (noticias, recursos y jornadas de obra social). Son unos cientos de
  entradas, asi que buscar es recorrerlas y puntuarlas.
*/

import type { IconName } from '../components/ui/Icon';
import { getJornadas, getNoticias, getRecursos } from '../contenido/store';
import { TIPOS_RECURSO, type TipoRecurso } from '../contenido/tipos';
import { ECOSISTEMAS } from '../data/ecosistemas';
import { EMPRESARIALES } from '../data/empresariales';
import { PRODUCTOS_FICHA } from '../data/productos';
import { RECURSOS_PAGINAS } from '../data/recursos';
import { SECTORES } from '../data/sectores';
import { NAV } from '../data/site';

export type TonoResultado = 'azul' | 'naranja' | 'morado' | 'verde' | 'rojo';

export interface ResultadoBusqueda {
  titulo: string;
  /** Donde vive: Productos › Productos de salud › PACS / RIS */
  migas: string[];
  ruta: string;
  icon: IconName;
  tono: TonoResultado;
}

interface Entrada extends ResultadoBusqueda {
  /** Texto normalizado del titulo y de las migas, para puntuar mas alto. */
  nTitulo: string;
  nMigas: string;
  /** Resumen corto (la descripcion del menu): pesa mas que el texto largo. */
  nResumen: string;
  /** Todo lo demas que se puede encontrar (descripciones, puntos...). */
  nTexto: string;
  /** Prioridad de partida: una ficha de producto pesa mas que una noticia. */
  peso: number;
}

/** minusculas y sin acentos: "Radiología" y "radiologia" son lo mismo */
export function normalizar(t: string): string {
  return t
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

const NOMBRE_RECURSO: Record<TipoRecurso, string> = {
  conferencias: 'Conferencias',
  webinars: 'Webinars',
  entrevistas: 'Entrevistas',
  'materiales-de-apoyo': 'Materiales de apoyo',
};
const ICONO_RECURSO: Record<TipoRecurso, IconName> = {
  conferencias: 'users',
  webinars: 'graduation',
  entrevistas: 'headset',
  'materiales-de-apoyo': 'file-text',
};
const TONO_RECURSO: Record<TipoRecurso, TonoResultado> = {
  conferencias: 'naranja',
  webinars: 'morado',
  entrevistas: 'verde',
  'materiales-de-apoyo': 'azul',
};

/** Color de una entrada del menu -> uno de los cinco tonos de la lista. */
function tonoDe(color?: string): TonoResultado {
  switch ((color ?? '').toLowerCase()) {
    case '#f97316':
    case '#f59e0b':
    case '#ff6a13':
      return 'naranja';
    case '#6d5bd0':
    case '#7c3aed':
      return 'morado';
    case '#0f8a5f':
      return 'verde';
    case '#ef4444':
    case '#e0489a':
      return 'rojo';
    default:
      return 'azul';
  }
}

const capital = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

/** Texto extra (descripciones, puntos, pestanas) de cada pagina, por ruta. */
function textosPorRuta(): Map<string, string[]> {
  const m = new Map<string, string[]>();
  const anadir = (ruta: string, ...t: (string | undefined)[]) => {
    const lista = m.get(ruta) ?? [];
    lista.push(...t.filter((x): x is string => !!x));
    m.set(ruta, lista);
  };
  for (const p of PRODUCTOS_FICHA) {
    anadir(
      `/producto/${p.slug}`,
      p.categoria,
      p.nombre,
      p.titulo,
      p.intro,
      p.heroTitulo,
      p.heroTexto,
      ...p.caracteristicas.map((c) => c.label),
      ...p.pestanas.flatMap((t) => [t.label, t.titulo, t.texto, ...t.puntos]),
    );
  }
  for (const e of EMPRESARIALES) {
    anadir(
      `/producto/${e.slug}`,
      e.categoria,
      e.nombreCompleto,
      e.titulo,
      e.intro,
      ...e.sellos.flatMap((s) => [s.titulo, s.texto]),
      ...e.porQue.map((v) => `${v.titulo} ${v.texto}`),
    );
  }
  for (const e of ECOSISTEMAS) {
    anadir(
      `/ecosistema/${e.slug}`,
      e.miga,
      e.titulo,
      e.tituloAccent,
      e.intro,
      ...e.bullets.map((b) => b.label),
      ...e.pilares.flatMap((p) => [p.titulo, p.texto]),
    );
  }
  for (const s of SECTORES) {
    anadir(`/sector/${s.slug}`, s.miga, s.heroTitulo, s.heroTituloAccent, s.heroTexto, ...s.heroBullets.map((b) => b.label));
  }
  for (const r of RECURSOS_PAGINAS) {
    anadir(`/recursos/${r.slug}`, r.titulo, r.subtitulo, r.resumen, ...r.categorias.map((c) => c.label));
  }
  return m;
}

let indice: Entrada[] | null = null;

/** El indice se arma la primera vez que alguien abre la lupa. */
function construirIndice(): Entrada[] {
  const extras = textosPorRuta();
  const lista: Entrada[] = [];
  const vistas = new Set<string>();

  /*
    alias: otros nombres por los que se busca la pagina y que cuentan como
    titulo (la categoria de un producto: quien busca "PACS" busca RadiologoX).
  */
  const entrada = (
    r: ResultadoBusqueda,
    peso: number,
    { alias = '', resumen = '' }: { alias?: string; resumen?: string },
    ...texto: (string | undefined)[]
  ) => {
    // una misma pagina sale en dos menus (LinkXpace en Soluciones y Productos)
    if (vistas.has(r.ruta)) return;
    vistas.add(r.ruta);
    lista.push({
      ...r,
      peso,
      nTitulo: normalizar(`${r.titulo} ${alias}`),
      nMigas: normalizar(r.migas.join(' ')),
      nResumen: normalizar(resumen),
      nTexto: normalizar([...texto, ...(extras.get(r.ruta) ?? [])].filter(Boolean).join(' ')),
    });
  };

  // Productos primero: si una pagina esta en los dos megamenus, manda la
  // miga de Productos, que es su ficha.
  const orden = [...NAV].sort((a, b) => (a.label === 'Productos' ? -1 : b.label === 'Productos' ? 1 : 0));
  for (const grupo of orden) {
    for (const col of grupo.columns ?? []) {
      const seccion = capital(`${col.title} ${col.titleAccent}`.toLowerCase());
      for (const it of col.items) {
        entrada(
          {
            titulo: it.label,
            migas: [grupo.label, seccion, ...(it.kicker ? [it.kicker] : [])],
            ruta: it.href,
            icon: it.icon,
            tono: col.tone === 'empresa' ? 'naranja' : 'azul',
          },
          grupo.label === 'Productos' ? 4 : 3,
          { alias: it.kicker, resumen: it.desc },
        );
      }
    }
    for (const ch of grupo.children ?? []) {
      if (!ch.href) continue;
      entrada(
        { titulo: ch.label, migas: [grupo.label], ruta: ch.href, icon: ch.icon, tono: tonoDe(ch.color) },
        3,
        { resumen: ch.desc },
      );
    }
  }

  // paginas que no estan en el menu
  entrada(
    { titulo: 'Nuestra historia', migas: ['Empresa', 'Quiénes somos'], ruta: '/empresa/nuestra-historia', icon: 'history', tono: 'naranja' },
    2,
    { resumen: 'trayectoria fundador origen años' },
  );
  entrada(
    { titulo: 'Solicitar una demo', migas: ['Contacto'], ruta: '/solicitar-demo', icon: 'calendar', tono: 'naranja' },
    2,
    { alias: 'demostración', resumen: 'cita reunión presentación' },
  );
  entrada(
    { titulo: 'Todas las noticias', migas: ['Noticias'], ruta: '/noticias', icon: 'newspaper', tono: 'azul' },
    1,
    { alias: 'actualidad novedades' },
  );

  // contenido que publica el panel
  for (const tipo of TIPOS_RECURSO) {
    for (const it of getRecursos(tipo)) {
      entrada(
        {
          titulo: it.titulo,
          migas: ['Recursos', NOMBRE_RECURSO[tipo]],
          ruta: `/recursos/${tipo}/${it.slug}`,
          icon: ICONO_RECURSO[tipo],
          tono: TONO_RECURSO[tipo],
        },
        1,
        { resumen: `${it.subtitulo ?? ''} ${it.categoria}` },
        it.resumen,
        ...(it.participantes ?? []).map((p) => `${p.nombre} ${p.cargo ?? ''}`),
      );
    }
  }
  for (const n of getNoticias()) {
    entrada(
      { titulo: n.titulo, migas: ['Noticias', n.categoria], ruta: `/noticias/${n.slug}`, icon: 'newspaper', tono: 'azul' },
      1,
      { resumen: n.subtitulo },
    );
  }
  for (const j of getJornadas()) {
    entrada(
      {
        titulo: j.tituloCorto || j.titulo,
        migas: ['Empresa', 'Obra social'],
        ruta: `/empresa/obra-social/${j.slug}`,
        icon: 'heart',
        tono: 'rojo',
      },
      1,
      { alias: j.titulo, resumen: j.lugar },
      j.resumen,
      j.descripcion,
    );
  }
  return lista;
}

/** Entradas que se ofrecen con la caja vacia. */
const SUGERIDAS = ['/producto/radiologox', '/ecosistema/centros-de-diagnostico', '/recursos/webinars', '/empresa/obra-social', '/empresa/contacto'];

export function sugerencias(): ResultadoBusqueda[] {
  indice ??= construirIndice();
  return SUGERIDAS.map((r) => indice!.find((e) => e.ruta === r)).filter((e): e is Entrada => !!e);
}

/** Resultados para lo escrito, del mas al menos relevante. */
export function buscar(consulta: string, maximo = 7): ResultadoBusqueda[] {
  const terminos = normalizar(consulta).split(/\s+/).filter(Boolean);
  if (!terminos.length) return [];
  indice ??= construirIndice();

  const puntuados: { e: Entrada; puntos: number }[] = [];
  for (const e of indice) {
    let puntos = 0;
    let todos = true;
    for (const t of terminos) {
      if (e.nTitulo.includes(t)) {
        // al principio de una palabra del titulo vale mas que en medio
        puntos += new RegExp(`(^|[^a-z0-9])${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(e.nTitulo) ? 14 : 9;
      } else if (e.nResumen.includes(t)) {
        puntos += 6;
      } else if (e.nMigas.includes(t)) {
        puntos += 5;
      } else if (e.nTexto.includes(t)) {
        puntos += 2;
      } else {
        todos = false;
        break;
      }
    }
    if (todos) puntuados.push({ e, puntos: puntos + e.peso });
  }
  return puntuados
    .sort((a, b) => b.puntos - a.puntos)
    .slice(0, maximo)
    .map(({ e }) => ({ titulo: e.titulo, migas: e.migas, ruta: e.ruta, icon: e.icon, tono: e.tono }));
}
