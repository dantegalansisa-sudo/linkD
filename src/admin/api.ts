/*
  Cliente de la API del panel (/api/ldwam/*).

  Todas las peticiones que cambian algo llevan la cabecera X-LINKDICOM-Admin:
  el servidor la exige y un formulario de otro sitio no puede ponerla, asi
  que nadie puede hacer cambios "en nombre" de una sesion abierta.
*/

import type { Sitio } from '../contenido/tipos';

export class ErrorApi extends Error {
  codigo: number;
  extra: Record<string, unknown>;
  constructor(mensaje: string, codigo: number, extra: Record<string, unknown> = {}) {
    super(mensaje);
    this.codigo = codigo;
    this.extra = extra;
  }
}

const CABECERAS = { 'X-LINKDICOM-Admin': '1' };

async function leer<T>(r: Response): Promise<T> {
  const tipo = r.headers.get('content-type') ?? '';
  if (!tipo.includes('application/json')) {
    throw new ErrorApi(
      r.status === 404 ? 'La API del panel no responde (¿está publicada la carpeta api/ldwam?).' : `Respuesta inesperada del servidor (${r.status}).`,
      r.status,
    );
  }
  const cuerpo = (await r.json()) as { ok?: boolean; error?: string } & Record<string, unknown>;
  if (!r.ok || cuerpo.ok === false) {
    throw new ErrorApi(cuerpo.error || `Error ${r.status}.`, r.status, cuerpo);
  }
  return cuerpo as T;
}

export async function get<T>(ruta: string, params?: Record<string, string>): Promise<T> {
  const q = params ? '?' + new URLSearchParams(params).toString() : '';
  const r = await fetch(`/api/ldwam/${ruta}${q}`, { credentials: 'same-origin', cache: 'no-store' });
  return leer<T>(r);
}

export async function post<T>(ruta: string, cuerpo: unknown, params?: Record<string, string>): Promise<T> {
  const q = params ? '?' + new URLSearchParams(params).toString() : '';
  const r = await fetch(`/api/ldwam/${ruta}${q}`, {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', ...CABECERAS },
    body: JSON.stringify(cuerpo ?? {}),
  });
  return leer<T>(r);
}

/* ---------------- Tipos de respuesta ---------------- */

export interface Usuario {
  id: string;
  nombre: string;
  correo: string;
  rol: 'administrador' | 'editor';
  activo: boolean;
  creado: string;
  ultimoAcceso: string;
}

export interface Maestro extends Sitio {
  inicializado: boolean;
  /** Huella del contenido del codigo con el que se cargo la partida. */
  huellaBase?: string;
  actualizadoPor: string;
}

export interface Medio {
  id: string;
  nombre: string;
  tipo: 'imagen' | 'video' | 'documento';
  extension: string;
  url: string;
  mini?: string;
  ancho?: number;
  alto?: number;
  tamano: number;
  fecha: string;
  usuario: string;
  uso?: string;
}

export interface LimitesSubida {
  directo: number;
  trozo: number;
  maximo: number;
  webp: boolean;
  gd: boolean;
}

export interface Solicitud {
  id: string;
  fecha: string;
  tipo: string;
  origen: string;
  datos: Record<string, string>;
  correoEnviado: boolean;
  estado: 'nueva' | 'atendida';
  atendidaPor?: string;
  atendidaEl?: string;
}

export interface Estado {
  resumen: {
    inicializado: boolean;
    version: number;
    actualizado: string;
    actualizadoPor: string;
    publicadoEl: string;
    noticias: { total: number; publicados: number };
    recursos: Record<string, { total: number; publicados: number }>;
    proximas: { total: number; publicados: number };
    jornadas: { total: number; publicados: number };
    imagenesSustituidas: number;
    medios: { imagen: number; video: number; documento: number };
    solicitudesNuevas: number;
    solicitudesTotal: number;
  };
  actividad: { fecha: string; usuario: string; accion: string; detalle: string }[];
  servidor: {
    php: string;
    panel: string;
    gd: boolean;
    webp: boolean;
    exif: boolean;
    finfo: boolean;
    uploadMax: number;
    postMax: number;
    memoria: string;
    tiempoMax: number;
    privado: string;
    privadoEscribible: boolean;
    privadoDentroDePublic: boolean;
    mediosEscribible: boolean;
    datosEscribible: boolean;
    medios: { bytes: number; archivos: number };
    https: boolean;
  };
}

/* ---------------- Subida de archivos ---------------- */

let limites: LimitesSubida | null = null;

export async function leerLimites(): Promise<LimitesSubida> {
  if (limites) return limites;
  const r = await get<{ limites: LimitesSubida }>('medios', { tipo: 'ninguno' });
  limites = r.limites;
  return limites;
}

/** Cuando el servidor no admite el archivo entero de una vez, va por trozos. */
const DIRECTO_MAXIMO = 6 * 1024 * 1024;

export async function subirArchivo(
  archivo: File,
  alAvanzar?: (fraccion: number) => void,
  uso = '',
): Promise<Medio> {
  const l = await leerLimites();

  // margen para la envoltura multipart, que tambien cuenta en el limite de POST
  if (archivo.size <= Math.min(l.directo - 128 * 1024, DIRECTO_MAXIMO)) {
    const cuerpo = new FormData();
    cuerpo.append('archivo', archivo);
    cuerpo.append('uso', uso);
    alAvanzar?.(0.05);
    const r = await fetch('/api/ldwam/medios', { method: 'POST', credentials: 'same-origin', headers: CABECERAS, body: cuerpo });
    const res = await leer<{ medio: Medio }>(r);
    alAvanzar?.(1);
    return res.medio;
  }

  if (archivo.size > l.maximo) {
    throw new ErrorApi('El archivo supera el máximo permitido (1,5 GB).', 413);
  }

  const inicio = await post<{ id: string; trozo: number }>('medios', { nombre: archivo.name, tamano: archivo.size, uso }, { accion: 'iniciar' });
  const total = Math.ceil(archivo.size / inicio.trozo);
  for (let i = 0; i < total; i++) {
    const parte = archivo.slice(i * inicio.trozo, Math.min(archivo.size, (i + 1) * inicio.trozo));
    let intentos = 0;
    for (;;) {
      try {
        const r = await fetch(`/api/ldwam/medios?accion=trozo&id=${inicio.id}&indice=${i}`, {
          method: 'POST',
          credentials: 'same-origin',
          headers: { ...CABECERAS, 'Content-Type': 'application/octet-stream' },
          body: parte,
        });
        await leer(r);
        break;
      } catch (e) {
        if (++intentos >= 3 || (e instanceof ErrorApi && e.codigo === 401)) throw e;
        await new Promise((res) => setTimeout(res, 800 * intentos));
      }
    }
    alAvanzar?.(((i + 1) / total) * 0.97);
  }
  const fin = await post<{ medio: Medio }>('medios', { id: inicio.id }, { accion: 'terminar' });
  alAvanzar?.(1);
  return fin.medio;
}
