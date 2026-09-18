/*
  Contenido en tiempo de ejecucion.

  Antes de pintar nada, la web pide /datos/sitio.json (lo que el panel de
  administracion ha publicado). Si no existe o falla, se queda con el
  contenido del codigo. Como se carga una sola vez antes del primer render,
  el resto de la web lo lee con funciones normales, sin contexto ni estados.

  Con ?borrador=1 en la URL, y una sesion abierta en el panel, se carga la
  version completa (con lo no publicado) para poder revisarla antes de
  publicar.

  Mientras nadie haya guardado nada desde el panel (editado: false), lo
  publicado es solo una copia del contenido del codigo hecha al instalar el
  panel; en ese caso manda el codigo, que puede ser mas nuevo.
*/

import { SITIO_BASE } from './base';
import { fechaLarga } from './formato';
import type { ItemRecurso, Jornada, Noticia, ProximaJornada, Sitio, TipoRecurso } from './tipos';

let sitio: Sitio = SITIO_BASE;
let borrador = false;

/** Rellena lo que falte y ordena, venga de donde venga el documento. */
function normalizar(bruto: Partial<Sitio>): Sitio {
  const base = SITIO_BASE;
  const s: Sitio = {
    version: bruto.version ?? 0,
    actualizado: bruto.actualizado ?? '',
    noticias: Array.isArray(bruto.noticias) ? bruto.noticias : base.noticias,
    categoriasNoticias: bruto.categoriasNoticias ?? base.categoriasNoticias,
    recursos: {
      conferencias: bruto.recursos?.conferencias ?? [],
      webinars: bruto.recursos?.webinars ?? [],
      entrevistas: bruto.recursos?.entrevistas ?? [],
      'materiales-de-apoyo': bruto.recursos?.['materiales-de-apoyo'] ?? [],
    },
    obraSocial: {
      proximas: bruto.obraSocial?.proximas ?? base.obraSocial.proximas,
      jornadas: bruto.obraSocial?.jornadas ?? base.obraSocial.jornadas,
      cifras: bruto.obraSocial?.cifras?.length ? bruto.obraSocial.cifras : base.obraSocial.cifras,
    },
    imagenes: bruto.imagenes ?? {},
  };

  // la fecha visible siempre sale de la ISO, y la mas nueva va primero
  s.noticias = s.noticias
    .map((n) => ({ ...n, fecha: n.fecha || fechaLarga(n.fechaISO), color: n.color || s.categoriasNoticias[n.categoria] || '#2563eb' }))
    .sort((a, b) => b.fechaISO.localeCompare(a.fechaISO));
  s.obraSocial.jornadas = [...s.obraSocial.jornadas].sort((a, b) => b.fechaISO.localeCompare(a.fechaISO));
  s.obraSocial.proximas = [...s.obraSocial.proximas].sort((a, b) => a.fechaISO.localeCompare(b.fechaISO));
  return s;
}

/** Carga el contenido publicado. Nunca falla: como mucho se queda con el del codigo. */
export async function cargarSitio(): Promise<void> {
  const params = new URLSearchParams(window.location.search);
  borrador = params.get('borrador') === '1';

  const url = borrador ? '/api/admin/contenido?accion=borrador' : `/datos/sitio.json`;
  try {
    const r = await fetch(url, {
      cache: 'no-cache',
      credentials: 'same-origin',
      signal: AbortSignal.timeout(4000),
    });
    if (!r.ok) {
      borrador = false;
      return;
    }
    const cuerpo = (await r.json()) as Partial<Sitio> & { sitio?: Partial<Sitio> };
    const bruto = cuerpo.sitio ?? cuerpo;
    // documentos anteriores a 'editado': la carga inicial deja la version en 1
    const editado = bruto.editado ?? (bruto.version ?? 0) > 1;
    sitio = normalizar(editado ? bruto : SITIO_BASE);
  } catch {
    borrador = false;
  }
}

export function getSitio(): Sitio {
  return sitio;
}

export function esBorrador(): boolean {
  return borrador;
}

/** Noticias publicadas, de la mas nueva a la mas antigua. */
export function getNoticias(): Noticia[] {
  return sitio.noticias.filter((n) => n.publicado !== false);
}

export function contarCategorias(): { nombre: string; total: number; color: string }[] {
  const totales = new Map<string, number>();
  for (const n of getNoticias()) totales.set(n.categoria, (totales.get(n.categoria) ?? 0) + 1);
  return [...totales].map(([nombre, total]) => ({ nombre, total, color: sitio.categoriasNoticias[nombre] ?? '#2563eb' }));
}

/** Items publicados de un recurso, los mas recientes primero. */
export function getRecursos(tipo: TipoRecurso): ItemRecurso[] {
  return (sitio.recursos[tipo] ?? [])
    .filter((i) => i.publicado !== false)
    .sort((a, b) => (b.fechaISO ?? '').localeCompare(a.fechaISO ?? ''));
}

export function getProximasJornadas(): ProximaJornada[] {
  return sitio.obraSocial.proximas.filter((p) => p.publicado !== false);
}

export function getJornadas(): Jornada[] {
  return sitio.obraSocial.jornadas.filter((j) => j.publicado !== false);
}

export function getCifrasObraSocial() {
  return sitio.obraSocial.cifras;
}

/**
 * Ruta de una foto del sitio, sustituida si el panel la cambio.
 * Sirve tambien para videos y posters. Acepta undefined para no complicar
 * a quien la usa con fotos opcionales.
 */
export function imagen(ruta: string): string;
export function imagen(ruta: string | undefined): string | undefined;
export function imagen(ruta: string | undefined): string | undefined {
  if (!ruta) return ruta;
  return sitio.imagenes[ruta] ?? ruta;
}
