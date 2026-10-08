/*
  NoticiaX en la web publica: visitas, me gusta / no me gusta, comentarios y
  las noticias mas leidas. Todo pasa por /api/noticias (PHP). Si la API no
  responde, la noticia se sigue leyendo con normalidad: estas piezas son un
  extra y nunca deben romper la pagina.
*/

export interface Votos {
  si: number;
  no: number;
}

export interface ComentarioPublico {
  id: string;
  nombre: string;
  texto: string;
  fecha: string;
}

const RUTA = '/api/noticias';

async function pedir<T>(init?: RequestInit, params?: Record<string, string>): Promise<T | null> {
  try {
    const q = params ? `?${new URLSearchParams(params)}` : '';
    const r = await fetch(`${RUTA}${q}`, { ...init, headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) } });
    if (!(r.headers.get('content-type') ?? '').includes('application/json')) return null;
    const cuerpo = (await r.json()) as T & { ok?: boolean; error?: string };
    if (!r.ok || cuerpo.ok === false) throw new Error(cuerpo.error || 'No se pudo completar la acción.');
    return cuerpo;
  } catch (e) {
    if (init?.method === 'POST') throw e;
    return null;
  }
}

/** Votos y comentarios aprobados de una noticia. */
export function leerInteracciones(slug: string) {
  return pedir<{ votos: Votos; comentarios: ComentarioPublico[] }>(undefined, { slug });
}

/** Slugs de las noticias mas leidas, de mas a menos. */
export async function leerPopulares(): Promise<string[]> {
  const r = await pedir<{ populares: string[] }>(undefined, { accion: 'populares' });
  return r?.populares ?? [];
}

/** Cuenta una visita. ref: pagina de la que se llega; fuente: ?utm_source o ?fuente. */
export function registrarVista(slug: string, ref: string, fuente: string) {
  pedir({ method: 'POST', body: JSON.stringify({ accion: 'vista', slug, ref, fuente }), keepalive: true }).catch(() => undefined);
}

export async function votar(slug: string, voto: 'si' | 'no' | ''): Promise<Votos | null> {
  const r = await pedir<{ votos: Votos }>({ method: 'POST', body: JSON.stringify({ accion: 'voto', slug, voto }) });
  return r?.votos ?? null;
}

export async function comentar(slug: string, nombre: string, texto: string, web: string): Promise<void> {
  await pedir({ method: 'POST', body: JSON.stringify({ accion: 'comentar', slug, nombre, texto, web }) });
}

/* Voto guardado en el navegador, para marcar el boton elegido. */
const CLAVE_VOTOS = 'noticiax-votos';

export function votoGuardado(slug: string): 'si' | 'no' | '' {
  try {
    const v = JSON.parse(localStorage.getItem(CLAVE_VOTOS) ?? '{}') as Record<string, 'si' | 'no'>;
    return v[slug] ?? '';
  } catch {
    return '';
  }
}

export function guardarVoto(slug: string, voto: 'si' | 'no' | '') {
  try {
    const v = JSON.parse(localStorage.getItem(CLAVE_VOTOS) ?? '{}') as Record<string, string>;
    if (voto) v[slug] = voto;
    else delete v[slug];
    localStorage.setItem(CLAVE_VOTOS, JSON.stringify(v));
  } catch {
    /* sin almacenamiento: el voto cuenta igual en el servidor */
  }
}
