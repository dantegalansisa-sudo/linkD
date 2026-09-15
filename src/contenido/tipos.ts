/*
  Tipos del contenido que gestiona el panel de administracion.

  Todo lo que el cliente puede cambiar desde /admin vive en un unico documento
  (`Sitio`): noticias, recursos, obra social y las fotos sustituidas. El
  servidor guarda la version completa (con borradores) y publica en
  /datos/sitio.json solo lo marcado como publicado; la web publica lee ese
  archivo al arrancar y, si no existe todavia, usa el contenido que viene en
  el codigo (`base.ts`).
*/

import type { IconName } from '../components/ui/Icon';

/* ---------------- Bloques de texto ---------------- */

/** Un bloque del cuerpo de una noticia o de un recurso. */
export type Bloque =
  | { tipo: 'p'; texto: string }
  | { tipo: 'h2'; texto: string }
  | { tipo: 'lista'; items: string[] }
  /** Frase suelta en grande, con la regla naranja. */
  | { tipo: 'destacado'; texto: string }
  | { tipo: 'foto'; src: string; alt: string; pie?: string }
  | { tipo: 'video'; src: string; poster: string; pie?: string };

/* ---------------- Noticias ---------------- */

export interface Noticia {
  slug: string;
  titulo: string;
  subtitulo: string;
  /** Como se muestra: "18 de agosto de 2025". Se deriva de fechaISO. */
  fecha: string;
  /** Para ordenar y para <time>: "2025-08-18". */
  fechaISO: string;
  categoria: string;
  color: string;
  lectura: string;
  imagen: string;
  imagenAlt: string;
  /** Pie de la foto principal. */
  pie?: string;
  /** Entradilla de las tarjetas. */
  resumen: string;
  cuerpo: Bloque[];
  /** Caja de llamada al final del articulo. */
  cta: { titulo: string; texto: string; boton: string; interes?: string };
  /** Solo lo publicado sale en la web. */
  publicado?: boolean;
  /** Puede ocupar el destacado grande del inicio. */
  destacada?: boolean;
}

/* ---------------- Recursos ---------------- */

export type TipoRecurso = 'conferencias' | 'webinars' | 'entrevistas' | 'materiales-de-apoyo';

export const TIPOS_RECURSO: TipoRecurso[] = ['conferencias', 'webinars', 'entrevistas', 'materiales-de-apoyo'];

/** Video de un recurso: archivo propio o enlace de YouTube / Vimeo. */
export interface VideoRecurso {
  origen: 'archivo' | 'youtube' | 'vimeo';
  src: string;
  poster?: string;
}

export interface Participante {
  nombre: string;
  cargo?: string;
  foto?: string;
}

export interface ArchivoRecurso {
  nombre: string;
  url: string;
  /** Tamano legible: "2,4 MB". */
  tamano?: string;
  /** Extension en mayusculas: PDF, DOCX... */
  formato?: string;
}

export interface PiezaGaleria {
  tipo: 'foto' | 'video';
  src: string;
  /** Solo los videos: fotograma de portada. */
  poster?: string;
  alt: string;
}

/** Una conferencia, un webinar, una entrevista o un material de apoyo. */
export interface ItemRecurso {
  slug: string;
  tipo: TipoRecurso;
  titulo: string;
  subtitulo?: string;
  resumen: string;
  /** Una de las categorias de la pagina del recurso (Congresos, Grabaciones...). */
  categoria: string;
  fechaISO?: string;
  hora?: string;
  lugar?: string;
  modalidad?: 'presencial' | 'virtual' | 'hibrido';
  duracion?: string;
  participantes?: Participante[];
  portada: string;
  portadaAlt: string;
  video?: VideoRecurso;
  galeria?: PiezaGaleria[];
  archivos?: ArchivoRecurso[];
  cuerpo: Bloque[];
  /** Boton de inscripcion o de mas informacion. */
  enlace?: { texto: string; url: string };
  publicado?: boolean;
  destacado?: boolean;
}

/* ---------------- Obra social ---------------- */

export interface ProximaJornada {
  slug: string;
  fechaISO: string;
  titulo: string;
  lugar: string;
  texto: string;
  imagen: string;
  imagenAlt: string;
  cta: string;
  publicado?: boolean;
}

export interface Cifra {
  icon: IconName;
  valor: string;
  label: string;
}

export interface Jornada {
  slug: string;
  miga: string;
  /** Titular de la jornada, en naranja bajo "Video resumen de la ayuda". */
  titulo: string;
  fechaISO: string;
  lugar: string;
  resumen: string;
  portada: string;
  portadaAlt: string;
  video?: { src: string; poster: string };
  galeriaTexto: string;
  galeria: PiezaGaleria[];
  /** Dato destacado bajo el video (por ejemplo, mochilas entregadas). */
  nota?: { icon: IconName; titulo: string; texto: string };
  /** Quien impulso la jornada. */
  iniciativa?: { titulo: string; parrafos: string[] };
  /** Empresa o persona a la que se agradece, con su logotipo y fotos. */
  agradecimiento?: { logo: string; logoAlt: string; nombre: string; parrafos: string[]; fotos: string[]; cierre: string };
  cifras: Cifra[];
  publicado?: boolean;
}

export interface ObraSocialContenido {
  proximas: ProximaJornada[];
  jornadas: Jornada[];
  /** Cifras del programa en la pagina de Obra social. */
  cifras: Cifra[];
}

/* ---------------- Documento completo ---------------- */

export interface Sitio {
  /** Sube con cada guardado en el panel. */
  version: number;
  /** Fecha ISO del ultimo guardado. */
  actualizado: string;
  noticias: Noticia[];
  /** Nombre de categoria -> color de la etiqueta. */
  categoriasNoticias: Record<string, string>;
  recursos: Record<TipoRecurso, ItemRecurso[]>;
  obraSocial: ObraSocialContenido;
  /** Ruta original de una foto del sitio -> archivo que la sustituye. */
  imagenes: Record<string, string>;
}

/** Iconos que el panel ofrece para cifras y notas. */
export const ICONOS_CIFRAS: { icon: IconName; label: string }[] = [
  { icon: 'users', label: 'Personas' },
  { icon: 'heart', label: 'Corazón' },
  { icon: 'gift', label: 'Regalo' },
  { icon: 'graduation', label: 'Educación' },
  { icon: 'home', label: 'Hogar' },
  { icon: 'handshake', label: 'Colaboración' },
  { icon: 'box', label: 'Caja' },
  { icon: 'star', label: 'Estrella' },
  { icon: 'trophy', label: 'Trofeo' },
  { icon: 'sparkles', label: 'Destellos' },
  { icon: 'layers', label: 'Capas' },
  { icon: 'globe', label: 'Mundo' },
];
