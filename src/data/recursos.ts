import type { IconName } from '../components/ui/Icon';

/*
  Paginas de Recursos: Conferencias, Webinars, Entrevistas y Materiales de
  Apoyo.

  Todavia no hay contenido real (ninguna conferencia, webinar ni entrevista
  publicada), asi que cada pagina monta su cabecera y, en lugar de una rejilla
  vacia, el panel "En Desarrollo" que el cliente diseno para Materiales de
  Apoyo. `categorias` son las secciones que tendra cada recurso cuando llegue
  el contenido: se muestran para que se vea que va a haber ahi.
*/

export interface Recurso {
  slug: string;
  titulo: string;
  subtitulo: string;
  /** Descripcion corta, la misma que usa el menu. */
  resumen: string;
  icon: IconName;
  color: string;
  bullets: { icon: IconName; label: string }[];
  imagen: string;
  imagenAlt: string;
  /** Foto del panel de "En Desarrollo". */
  imagenDesarrollo: string;
  imagenDesarrolloAlt: string;
  textoDesarrollo: string;
  categorias: { icon: IconName; label: string }[];
}

/** Palabras sueltas al margen de la cabecera, iguales en las cuatro. */
export const LEMA_RECURSOS = ['Tecnología', 'Salud', 'Innovación', 'Personas'];

export const RECURSOS_PAGINAS: Recurso[] = [
  {
    slug: 'conferencias',
    titulo: 'Conferencias',
    subtitulo: 'Nuestra participación en congresos, encuentros y eventos del sector salud y tecnología.',
    resumen: 'Congresos, encuentros y eventos del sector salud y tecnología.',
    icon: 'users',
    color: '#f97316',
    bullets: [
      { icon: 'users', label: 'Compartimos conocimiento' },
      { icon: 'lightbulb', label: 'Impulsamos la innovación' },
      { icon: 'handshake', label: 'Construimos alianzas' },
    ],
    imagen: '/img/recursos/conferencias.webp',
    imagenAlt: 'Ponencia de LINKDICOM ante el público de un congreso',
    imagenDesarrollo: '/img/recursos/conferencias.webp',
    imagenDesarrolloAlt: 'Ponencia de LINKDICOM ante el público de un congreso',
    textoDesarrollo:
      'Muy pronto podrás ver aquí la agenda de congresos, encuentros y eventos en los que participa LINKDICOM, con el detalle de cada uno y cómo asistir.',
    categorias: [
      { icon: 'users', label: 'Congresos' },
      { icon: 'graduation', label: 'Seminarios' },
      { icon: 'headset', label: 'Talleres y charlas' },
      { icon: 'handshake', label: 'Eventos que auspiciamos' },
    ],
  },
  {
    slug: 'webinars',
    titulo: 'Webinars',
    subtitulo: 'Charlas, demostraciones y sesiones educativas sobre tecnología, gestión y transformación digital en salud.',
    resumen: 'Charlas y demostraciones sobre tecnología y transformación digital.',
    icon: 'play',
    color: '#6d5bd0',
    bullets: [
      { icon: 'graduation', label: 'Aprende con expertos' },
      { icon: 'users', label: 'Conocimiento para tu equipo' },
      { icon: 'monitor', label: 'Tecnología aplicada a la realidad' },
    ],
    imagen: '/img/recursos/webinars.webp',
    imagenAlt: 'Webinar de LINKDICOM en la pantalla de un portátil',
    imagenDesarrollo: '/img/recursos/webinars.webp',
    imagenDesarrolloAlt: 'Webinar de LINKDICOM en la pantalla de un portátil',
    textoDesarrollo:
      'Muy pronto podrás inscribirte aquí a nuestros próximos webinars y ver las grabaciones de los anteriores, con su ficha, su ponente y su duración.',
    categorias: [
      { icon: 'calendar', label: 'Próximos' },
      { icon: 'play', label: 'Grabaciones' },
      { icon: 'monitor', label: 'Demostraciones' },
      { icon: 'graduation', label: 'Capacitaciones' },
    ],
  },
  {
    slug: 'entrevistas',
    titulo: 'Entrevistas',
    subtitulo: 'Conversaciones con especialistas, líderes y protagonistas de la transformación tecnológica en salud.',
    resumen: 'Conversaciones con especialistas y líderes del sector salud.',
    icon: 'headset',
    color: '#0f8a5f',
    bullets: [
      { icon: 'headset', label: 'Experiencias reales' },
      { icon: 'users', label: 'Voces del sector salud' },
      { icon: 'lightbulb', label: 'Ideas que impulsan el cambio' },
    ],
    imagen: '/img/recursos/entrevistas.webp',
    imagenAlt: 'Micrófono de estudio preparado para una entrevista',
    imagenDesarrollo: '/img/recursos/entrevistas.webp',
    imagenDesarrolloAlt: 'Micrófono de estudio preparado para una entrevista',
    textoDesarrollo:
      'Muy pronto podrás ver aquí nuestras conversaciones con directivos, especialistas y clientes sobre la transformación tecnológica de la salud.',
    categorias: [
      { icon: 'building', label: 'Directivos' },
      { icon: 'stethoscope', label: 'Especialistas' },
      { icon: 'handshake', label: 'Clientes y partners' },
      { icon: 'lightbulb', label: 'Innovación' },
    ],
  },
  {
    slug: 'materiales-de-apoyo',
    titulo: 'Materiales de Apoyo',
    subtitulo: 'Guías, manuales, documentos, infografías y recursos útiles para instituciones y profesionales.',
    resumen: 'Guías, manuales y documentos para tu institución.',
    icon: 'file-text',
    color: '#2563eb',
    bullets: [
      { icon: 'file-text', label: 'Documentación clara' },
      { icon: 'graduation', label: 'Formación para tu equipo' },
      { icon: 'settings', label: 'Recursos técnicos' },
    ],
    imagen: '/img/recursos/materiales.webp',
    imagenAlt: 'Manual de usuario PACS-RIS de LINKDICOM con sus formatos descargables',
    imagenDesarrollo: '/img/recursos/desarrollo.webp',
    imagenDesarrolloAlt: 'Especialista de LINKDICOM señalando los materiales de apoyo en pantalla',
    textoDesarrollo:
      'Muy pronto podrás ver aquí todos los materiales de formación e informaciones técnicas de LINKDICOM, con el fin de asegurarte una mejor comprensión y usabilidad de nuestras soluciones.',
    categorias: [
      { icon: 'file-text', label: 'Guías' },
      { icon: 'play', label: 'Tutoriales' },
      { icon: 'graduation', label: 'Manuales' },
      { icon: 'settings', label: 'Recursos técnicos' },
    ],
  },
];
