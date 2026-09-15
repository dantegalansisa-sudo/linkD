/*
  Utilidades de formato compartidas por la web y el panel: fechas en espanol,
  slugs, tiempo de lectura y enlaces de video.
*/

const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];
const MESES_CORTOS = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
const DIAS_CORTOS = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];

/** "2025-08-18" -> Date local (sin el desfase de zona horaria de Date.parse). */
export function fechaDesdeISO(iso: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso ?? '');
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

/** "2025-08-18" -> "18 de agosto de 2025". */
export function fechaLarga(iso: string): string {
  const d = fechaDesdeISO(iso);
  if (!d) return iso ?? '';
  return `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`;
}

/** "2025-08-18" -> "18 ago 2025". */
export function fechaCorta(iso: string): string {
  const d = fechaDesdeISO(iso);
  if (!d) return iso ?? '';
  return `${d.getDate()} ${MESES_CORTOS[d.getMonth()].toLowerCase()} ${d.getFullYear()}`;
}

/** Piezas del calendario de las jornadas: JUE / 24 / DIC 2026. */
export function piezasFecha(iso: string): { dia: string; numero: string; mes: string; mesCorto: string; anio: string } {
  const d = fechaDesdeISO(iso);
  if (!d) return { dia: '', numero: '', mes: '', mesCorto: '', anio: '' };
  return {
    dia: DIAS_CORTOS[d.getDay()],
    numero: String(d.getDate()).padStart(2, '0'),
    mes: `${MESES_CORTOS[d.getMonth()]} ${d.getFullYear()}`,
    mesCorto: MESES_CORTOS[d.getMonth()],
    anio: String(d.getFullYear()),
  };
}

/** Hoy como "2026-09-14" en hora local. */
export function hoyISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function esFutura(iso?: string): boolean {
  return !!iso && iso.slice(0, 10) >= hoyISO();
}

/** "LINKDICOM presenta RadioloGOx Beta" -> "linkdicom-presenta-radiologox-beta". */
export function slugificar(texto: string): string {
  return (texto ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/** Tiempo de lectura a 200 palabras por minuto, minimo 1. */
export function tiempoLectura(textos: string[]): string {
  const palabras = textos.join(' ').trim().split(/\s+/).filter(Boolean).length;
  const minutos = Math.max(1, Math.round(palabras / 200));
  return `${minutos} min de lectura`;
}

/** 2457600 -> "2,3 MB". */
export function tamanoLegible(bytes: number): string {
  if (!bytes) return '0 KB';
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1).replace('.', ',')} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2).replace('.', ',')} GB`;
}

/**
 * Reconoce un enlace de YouTube o Vimeo y devuelve la URL para incrustarlo.
 * Devuelve null si no es ninguno de los dos.
 */
export function enlaceIncrustable(url: string): { origen: 'youtube' | 'vimeo'; embed: string; id: string } | null {
  const u = (url ?? '').trim();
  const yt =
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/.exec(u);
  if (yt) return { origen: 'youtube', id: yt[1], embed: `https://www.youtube-nocookie.com/embed/${yt[1]}?rel=0` };
  const vm = /vimeo\.com\/(?:video\/)?(\d{5,})/.exec(u);
  if (vm) return { origen: 'vimeo', id: vm[1], embed: `https://player.vimeo.com/video/${vm[1]}` };
  return null;
}

/** Miniatura de YouTube para usar de portada cuando no se ha subido ninguna. */
export function miniaturaVideo(url: string): string | undefined {
  const e = enlaceIncrustable(url);
  if (e?.origen === 'youtube') return `https://i.ytimg.com/vi/${e.id}/hqdefault.jpg`;
  return undefined;
}
